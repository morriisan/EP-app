import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { bookingService } from "@/services/booking-service";

export const POST = requireAdmin(async (req: Request) => {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await bookingService.promoteWaitlistedBooking(bookingId);
    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Booking not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === 'Booking is not in waitlist' || 
          error.message === 'Another booking is already pending or approved for this date') {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    console.error("Error promoting booking:", error);
    return NextResponse.json(
      { error: "Failed to promote booking" },
      { status: 500 }
    );
  }
}); 