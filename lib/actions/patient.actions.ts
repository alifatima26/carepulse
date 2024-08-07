
'use server';

import { ID, Query } from "node-appwrite";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import {InputFile} from "node-appwrite/file"



// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
    try {
      console.log("Creating user with data:", user);

      // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
      const newuser = await users.create(
        ID.unique(),
        user.email,
        user.phone,
        undefined,    //its password not defined
        user.name
      );

      console.log("New user created:", newuser);
  
      return parseStringify(newuser);
    } 
    
      catch (error: any) {
      console.error('Error creating user:', error);

      // Check existing user
      if (error && error?.code === 409) {
        const existingUser = await users.list([
          Query.equal("email", [user.email]),
        ]);
  
        return existingUser.users[0];
      }
      throw new Error("An error occurred while creating a new user.");
    }
  };


  // done user is created 
  
 //Get User  for authenticated user 
 export const getUser = async (userId: string)=>{

  try {
    //get a user
    const user = await users.get(userId)
    console.log(user);

    return parseStringify(user);
    
  } catch (error) {
    console.log(error)
  }
 } 


 //register patient
export const registerPatient = async({identificationDocument, ...patient}: RegisterUserParams)=>{

  try {
    //upload that file
    //use appwrite storage

    let file;

    if(identificationDocument){
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string,
      )
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
      console.log("File uploaded with ID:", file.$id);
    }

    console.log({gender: patient.gender})

    console.log(
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient
      }
    )

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
          identificationDocumentId: file?.$id || null,
          identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
          ...patient
      }
    )
    console.log("New patient document created:", newPatient);
    return parseStringify(newPatient);
    
  } catch (error) {
    console.error("Error registering patient:", error);

  }
}

//create server action for getPatinet appointment
export const getPatient = async (userId: string)=>{

  try {
    //get a user
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    )

    return parseStringify(patients.documents[0]);
    
  } catch (error) {
    console.log(error)
  }
 } 