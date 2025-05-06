
import { LogoutButton } from "@/components/LogoutButton";
import { AuthPanel } from "@/components/AuthPanel";

export default function Home() {
  return (

   
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-center mt-10" >welcome</h1>

      <LogoutButton />
      <AuthPanel />


   </div>
   
    
  )
}