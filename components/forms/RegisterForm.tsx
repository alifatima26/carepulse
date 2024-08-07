"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {Form, FormControl} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { Router } from "lucide-react"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { blob } from "stream/consumers";


const RegisterForm = ({ user }: {user: User}) => {

      const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof PatientFormValidation>>({
      resolver: zodResolver(PatientFormValidation),
      defaultValues: {
        ...PatientFormDefaultValues,
        name: "",
        email: "",
        phone: ""
      },
    });
   
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
  console.log("Form submitted");
  setIsLoading(true);

  let formData;
  if(values.identificationDocument && values.identificationDocument.length > 0)
  {
    //regarding the fileUpload
    const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
    })

    formData = new FormData();
    formData.append('blobFile', blobFile);
    formData.append('fileName', values.identificationDocument[0].name);

    //set to save the file
}

  try {
   
    const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
    }

    //@ts-ignore
    const patient = await registerPatient(patientData);

    // console.log(`Navigating to /patients/${user.$id}/rnew-appointment`);
    if (patient) {
      router.push(`/patients/${user.$id}/new-appointment`);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    setIsLoading(false);
  }
};

    
  return (

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know about yourself.</p>
        </section>

        <section className="space-y-4">
            <div className="mb-9 space-y-1">
            <h2 className="sub-haeder">Personal Information</h2>
            </div>
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

{/**for email & phoneNumber */}
        <div className="flex flex-col gap-6 xl:flex-row">
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
       placeholder="ex: +1(868)579-9831"
       />
        </div>


    {/**for dateOfBirth & gender */}
    <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
       fieldType={FormFieldType.DATE_PICKER}
       control={form.control}
       name="birthDate"
       label="Date of Birth"
       placeholder="johndoe@jsmastery.pro"
       />
      <CustomFormField
       fieldType={FormFieldType.SKELETON}
       control={form.control}
       name="gender"
       label="Gender"
       renderSkeleton={(field)=>(
        <FormControl>
            <RadioGroup className="flex h-11 gap-6 xl:justify-between"
            onValueChange={field.onChange}
            defaultValue={field.value}>
                {/**set array of diff gender array */}
                {GenderOptions.map((option)=>(
                    <div className="radio-group" key={option}>
                        <RadioGroupItem value={option} id={option}/>
                    <Label htmlFor={option} className="cursor-pointer">
                        {option}
                    </Label>
                    </div>
                )
                    )}
            </RadioGroup>
        </FormControl>
       )}
       />
        </div>

            {/**Emergency Address & Occupation */}
       <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
       fieldType={FormFieldType.INPUT}
       control={form.control}
       name="address"
       label="Address"
       placeholder="ex: 14th Street, New York, NY - 5101"
       />
    <CustomFormField
       fieldType={FormFieldType.INPUT}
       control={form.control}
       name="occupation"
       label="Occupation"
       placeholder="Software Engineer"
       />
    </div>

            {/**Emergency Contact Name & Number */}
    <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
       fieldType={FormFieldType.INPUT}
       control={form.control}
       name="emergencyContactName"
       label="Emergency contact name"
       placeholder="Guardian's name"
       />
        <CustomFormField
       fieldType={FormFieldType.PHONE_INPUT}
       control={form.control}
       name="emergencyContactNumber"
       label="Emergency contact number"
       placeholder="ex: +1(868)579-9831"
       />
    </div>


    <section className="space-y-4">
            <div className="mb-9 space-y-1">
            <h2 className="sub-haeder">Medical Information</h2>
            </div>

 {/* PRIMARY CARE PHYSICIAN */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                    <Image
                    src={doctor.image}
                    height={32}
                    width={32}
                    alt={doctor.name}
                    className="rounded-full border border-dark-500"
                    />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {/* INSURANCE & POLICY NUMBER */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>

          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medications"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>

          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Mother had brain cancer, Father has hypertension"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
            />
          </div>
        </section>


{/**Identification & verfucation */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type">
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

{/**checkbox consent */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

      <SubmitButton isLoading={isLoading}>
            Get Started
        </SubmitButton>
    </form>
  </Form>
)
}

export default RegisterForm