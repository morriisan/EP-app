import { BookingServerComponent } from "@/components/booking/booking-server-component";

export default async function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book a Date</h1>
      <BookingServerComponent />
    </div>
  );
} 