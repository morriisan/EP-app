'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingTable } from "./BookingTable";
import { BookingHistoryTable } from "./BookingHistoryTable";
import { WaitlistTable } from "./WaitlistTable";
import { useSession } from "@/lib/auth-client";

export function BookingDashboard() {
  const { data: session } = useSession();

  if (!session || session.user.role !== "admin") {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Management</h1>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Bookings</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="history">Booking History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <BookingTable />
        </TabsContent>

        <TabsContent value="waitlist">
          <WaitlistTable />
        </TabsContent>
        
        <TabsContent value="history">
          <BookingHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
} 