//
// import SignIn from "@/components/sign-in";
import SignIn from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("NODE_ENV:", process.env.NODE_ENV);

  }, []);
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen">
    <SignUp />
    <SignIn/>
    </div>
    </>
    
  )
}