"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { Router } from "lucide-react"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"


//enum is like bydefault value types of field
//these all are input types 
export enum FormFieldType{
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',    //for loading state
}  

      const PatientForm = () => {

      const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof UserFormValidation>>({
      resolver: zodResolver(UserFormValidation),
      defaultValues: {
        name: "",
        email: "",
        phone: ""
      },
    });
   
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
  console.log("Form submitted");
  setIsLoading(true);

  try {
    const user = { 
      name: values.name,
      email: values.email,
      phone: values.phone 
    };

    console.log("User data to create:", user);

    const newUser = await createUser(user);
    console.log("User created:", newUser);
    
    if (newUser) {
      console.log(`Navigating to /patients/${newUser.$id}/register`);

      router.push(`/patients/${newUser.$id}/register`);
    } 
    else {
      console.error("User creation failed, no user returned.");
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    setIsLoading(false);
  }
};

    
  return (

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule your first appointment.</p>
        </section>

       {/* add customFormField*/}
       <CustomFormField
       fieldType={FormFieldType.INPUT}
       control={form.control}
       name="name"
       label="Full name"
       placeholder="John Doe"
       iconSrc='/assets/icons/user.svg'
       iconAlt='user'
       />
       <CustomFormField
       fieldType={FormFieldType.INPUT}
       control={form.control}
       name="email"
       label="Email"
       placeholder="johndoe@jsmastery.pro"
       iconSrc='/assets/icons/email.svg'
       iconAlt='email'
       />
      <CustomFormField
       fieldType={FormFieldType.PHONE_INPUT}
       control={form.control}
       name="phone"
       label="Phone Number"
       placeholder="(555) 123-4563"
       />
      <SubmitButton isLoading={isLoading}>
            Get Started
        </SubmitButton>
    </form>
  </Form>
)
}

export default PatientForm