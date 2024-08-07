'use server';

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";



export const createAppointment = async( appointment: CreateAppointmentParams)=>{
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
          );

          return parseStringify(newAppointment);

    } catch (error) {
        console.log(error)
    }
}


//server side function for getAppointment
export const getAppointment = async(appointmentId: string)=>{

    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )

        return parseStringify(appointment);

    } catch (error) {
        console.log(error)
    }
}

//now fetch all recent appointments 
export const getRecentAppointmentList=async()=>{
try {
    //fetch all recent appointments
    const appointments = await databases.listDocuments(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        [Query.orderDesc('$createdAt')]    //recent appointment in desc order
    );

    //now counts of all appointments
    const initialCounts = {
        scheduledCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
    }
    //now iterate the counts when added new one (appointments)   increase a count for every 
    const counts = (
        appointments.documents as Appointment[]).reduce((acc, appointment)=>{
            if(appointment.status === 'scheduled')
            {
                acc.scheduledCount +=1;
            }
            else if(appointment.status === 'pending')
            {
                    acc.pendingCount +=1;
            }
            else if(appointment.status === 'cancelled')
            {
                        acc.cancelledCount +=1;
            }
            return acc;
        }, initialCounts)

        //format into the data object
        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
          };
      
          return parseStringify(data);
} catch (error) {
    console.log(error);
}
}


//update the appointments 
//  UPDATE APPOINTMENT
export const updateAppointment = async ({
    appointmentId,
    userId,
    appointment,
    type,
    timeZone,
  }: UpdateAppointmentParams) => {
    try {
      // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
      const updatedAppointment = await databases.updateDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        appointmentId,
        appointment
      );
  
      if (!updatedAppointment) throw Error;
  
      //SMS notifications
      const smsMessage = `Hi! it's CarePulse.
      ${type === "schedule" ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime}
         with Dr. ${appointment.primaryPhysician}` 
      : `We regret to inform that your appointment has been ncancelled for the following reason: ${appointment.cancellationReason}`}.`;

      console.log("SMS:", smsMessage);
      await sendSMSNotification(userId, smsMessage);
  
      revalidatePath("/admin");
      return parseStringify(updatedAppointment);
    } catch (error) {
      console.error("An error occurred while scheduling an appointment:", error);
    }
  };

//  SEND SMS NOTIFICATION
export const sendSMSNotification = async (userId: string, content: string) => {
    try {
      // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
      //new appwrite msg content
      const message = await messaging.createSms(
        ID.unique(),    //msg ID
        content,       //message content
        [],    
        [userId]    //araaay for users
      );
      return parseStringify(message);
    } catch (error) {
      console.error("An error occurred while sending sms:", error);
    }
  };
