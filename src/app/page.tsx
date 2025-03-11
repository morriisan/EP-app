//
// import SignIn from "@/components/sign-in";
import SignIn from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";

export default function Home() {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen">
    <SignUp />
    <SignIn/>
    </div>
    </>
    
  )
}