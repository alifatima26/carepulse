import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

//destructure the paarms an destructure the userId from it
const Register = async ({ params : { userId } }: SearchParamProps) => {

  //now get user from lib
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
    <section className="remove-scrollbar container">
      <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
        <Image
        src={'/assets/icons/logo-full.svg'}
        height={1000}
        width={1000}
        alt="patient"
        className="mb-12 h-10 w-fit"/>

      <RegisterForm user={user}/>

      <p className="copyright py-12"> 
      © 2024 CarePulse
     </p>
      </div>
    </section>



    {/* added image here */}
    <Image
    src={'/assets/images/register-img.png'}
    height={1000}
    width={1000}
    alt="patient"
    className="side-img max-w-[390px]"
    />
</div>
  )
}

export default Register