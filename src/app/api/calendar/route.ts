import { NextResponse } from "next/server";
import { bookingService } from "@/services/booking-service";
import { addMonths } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month parameter is required" },
        { status: 400 }
      );
    }

    const startDate = new Date(month);
    const endDate = addMonths(startDate, 3); // Get 3 months of data

    const calendarDates = await bookingService.getCalendarDates(startDate, endDate);
    
    return NextResponse.json(calendarDates);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 }
    );
  }
} 