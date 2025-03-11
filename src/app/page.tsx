import{ProtectedRoute} from "@/components/ProtectedRoute";

export default function Home() {
  console.log("morri");
  return (

   
    <div>
    <h1>welcome</h1>

    <ProtectedRoute>
      <div>
        <h1>hei</h1>
      </div>
    </ProtectedRoute>


   </div>
   
    
  )
}