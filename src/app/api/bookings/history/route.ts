import { NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/lib/auth-middleware";
import { bookingService } from "@/services/booking-service";


// Get user's booking history
export const GET = requireAuth(async (req: Request, session) => {
  try {
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const history = await bookingService.getUserBookingHistory(session.user.id);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to get booking history:", error);
    return NextResponse.json(
      { error: "Failed to get booking history" },
      { status: 500 }
    );
  }
});

// Move past bookings to history (admin only)
export const POST = requireAdmin(async () => {
  try {
    const movedCount = await bookingService.movePastBookingsToHistory();
    return NextResponse.json({ 
      message: `Moved ${movedCount} past bookings to history`,
      count: movedCount 
    });
  } catch (error) {
    console.error("Failed to move past bookings to history:", error);
    return NextResponse.json(
      { error: "Failed to move past bookings to history" },
      { status: 500 }
    );
  }
});
