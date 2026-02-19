import { BookingServerComponent } from "@/components/booking/booking-server-component";

export default function BookingPage() {
  return (
    <main className="container mx-auto px-2 py-16">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-light tracking-wider text-theme-primary mb-8">Request a Date</h1>
        <p className="text-lg text-theme-accent-primary text-center font-light">
          Select a date and submit your booking request for the date you want to book
        </p>
      </div>
      <BookingServerComponent />
    </main>
  );
} 