"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"

import StatusBadge from "../StatusBadge"
import { format } from "libphonenumber-js"
import { formatDate } from "react-datepicker/dist/date_utils"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import AppointmentModal from "../AppointmentModal"
import { Appointment } from "@/types/appwrite.types"

import Image from "next/image"

export const columns: ColumnDef<Appointment>[] = [

    //add on emore header before status (id)
    //these are appointments ID
    {
        header: 'ID',
        //cell is something a fuction that return <p> tag with some data</p>
        cell: ({row}) =>
            <p className="text-14-medium">
            {row.index + 1}
            </p>
    },
    {
        accessorKey: 'patient',
        header: 'Patient',
        cell: ({row}) => {
            const appointment = row.original;
            return(
            <p className="text-14-medium">
                {appointment.patient.name}
            </p>
            )
        }
    },

  {
    accessorKey: "status",
    header: "Status",
    cell:({row}) => (
        <div className="min-w-[120px]">
            <StatusBadge status={row.original.status}/>
        </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointments",
    cell: ({row})=> (
        <p className="text-14-regular min-w-[100px]">
            {formatDateTime(row.original.schedule).dateTime}
        </p>
    )
  },
  {
    accessorKey: "primaryPhysician",
    header: 'Doctor',
    cell: ({ row }) => {
        const doctor = Doctors.find((doc)=> doc.name === row.original.primaryPhysician)

        return(
            <div className="flex items-center gap-3">
                <Image
                src={doctor?.image}
                height={100}
                width={100}
                alt={doctor?.name}
                className='size-8'
                />
            
            <p className="whitespace-nowrap">
                {doctor?.name}
            </p>
            </div>
        )
    },  
},

    //add columns actions here
   {
    id: 'actions',
    header: () => 
        <div className="pl-4">
            Actions Done
        </div>,
    cell: ({row: {original:data}}) => {
        return (
            <div className="flex gap-1">
                {data.status === 'scheduled' || data.status === 'pending' ? (
                    <AppointmentModal
                     patientId={data.patient.$id}
                     userId={data.userId}
                    appointment={data}
                    type="schedule"
                    />
                ):(
                    <Button disabled className="text-transparent">Schedule</Button>
                )}
                    {data.status !== 'cancelled' ? (
                        <AppointmentModal
                            patientId={data.patient.$id}
                            userId={data.userId}
                            appointment={data}
                            type="cancel"
                        />
                    ) : 
                    (
                        <Button disabled className="text-transparent">Cancel</Button>
                    )}
                </div>
           
        )
    }
   }


]
  