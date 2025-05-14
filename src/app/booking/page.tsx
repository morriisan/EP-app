import { BookingServerComponent } from "@/components/booking/booking-server-component";

export default async function BookingPage() {
  return (
    <>
      <div className="flex items-center gap-4 border-b px-4 py-2">
        <h1 className="text-2xl font-semibold">Book a Date</h1>
      </div>
      <div className="p-4">
        <BookingServerComponent />
      </div>
    </>
  );
} 