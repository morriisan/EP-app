//import{ProtectedRoute} from "@/components/ProtectedRoute";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function Home() {
  console.log("morri");
  return (

   
    <div>
    <h1 className="text-2xl font-bold text-center mt-10" >welcome</h1>

      <AdminDashboard />
    


   </div>
   
    
  )
}