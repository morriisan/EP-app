import { prisma } from "@/lib/prisma";
import { Booking, User } from "@prisma/client";
import { format } from "date-fns";

export type BookingWithUser = Booking & {
  user: Pick<User, "id" | "name" | "email">;
};

export const bookingService = {
  // Get all bookings for admin
  async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { date: 'desc' },
      ],
    });
  },

  // Get all bookings for a specific date
  async getBookingsByDate(date: Date) {
    return prisma.booking.findMany({
      where: {
        date: date,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  },

  // Get all bookings for a date range
  async getBookingsInRange(startDate: Date, endDate: Date) {
    return prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  },

  // Get a user's bookings
  async getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  },

  // Check if user can book a date
  async canUserBook(userId: string, date: Date) {
    const existingUserBooking = await prisma.booking.findFirst({
      where: {
        userId,
        date: date,
        status: { not: "CANCELLED" },
      },
    });

    return !existingUserBooking;
  },

  // Create a new booking
  async createBooking(
    userId: string, 
    date: Date, 
    eventType: string,
    guestCount: number,
    description?: string
  ) {
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: date,
        status: {
          in: ["APPROVED", "PENDING"]
        },
      },
    });
    const status = existingBooking ? "WAITLISTED" : "PENDING";

    let waitlistPos: number | null = null;

    if (status === "WAITLISTED") {
      const lastWaitlisted = await prisma.booking.findFirst({
        where: {
          date: date,
          status: "WAITLISTED",
        },
        orderBy: {
          waitlistPos: 'desc',
        },
      });
      waitlistPos = (lastWaitlisted?.waitlistPos ?? 0) + 1;
    }

    return prisma.booking.create({
      data: {
        userId,
        date: date,
        eventType,
        guestCount,
        description,
        status,
        waitlistPos,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Check if booking can be approved
  async canApproveBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    
    if (!booking) return false;

    const existingApproved = await prisma.booking.findFirst({
      where: {
        date: booking.date,
        status: "APPROVED",
        id: { not: bookingId },
      },
    });

    return !existingApproved;
  },

  // Review a booking
  async reviewBooking(
    bookingId: string,
    adminId: string,
    status: "APPROVED" | "REJECTED",
    reviewNote?: string
  ) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        reviewedById: adminId,
        reviewNote,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Move rejected bookings to history
    if (status === "REJECTED") {
      await this.moveToHistory(booking, "REJECTED");
      return booking;
    }

    return booking;
  },

  // Move a booking to history
  async moveToHistory(
    booking: Booking & { user?: { name: string; email: string } }, 
    reason: "CANCELLED" | "PAST_DATE" | "REJECTED"
  ) {
    return prisma.$transaction([
      prisma.bookingHistory.create({
        data: {
          userId: booking.userId,
          userName: booking.user?.name,      
          userEmail: booking.user?.email,   
          date: booking.date,
          eventType: booking.eventType,
          guestCount: booking.guestCount,
          description: booking.description,
          status: booking.status,
          originalBookingId: booking.id,
          reason,
          waitlistPos: booking.waitlistPos,
          reviewedById: booking.reviewedById,
          reviewNote: booking.reviewNote,
        },
      }),
      prisma.booking.delete({
        where: { id: booking.id },
      }),
    ]);
  },

  // Cancel a booking
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!booking || booking.userId !== userId) {
      return null;
    }

    await this.moveToHistory(booking, "CANCELLED");
    return booking;
  },

  // Move past bookings to history
  async movePastBookingsToHistory() {
    const today = new Date();

    const pastBookings = await prisma.booking.findMany({
      where: {
        date: {
          lt: today
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    for (const booking of pastBookings) {
      await this.moveToHistory(booking, "PAST_DATE");
    }

    return pastBookings.length;
  },

  // Get booking history for a user
  async getUserBookingHistory(userId: string) {
    return prisma.bookingHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  },

  // Get all booking history records (admin only)
  async getAllBookingHistory() {
    const historyRecords = await prisma.bookingHistory.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { movedToHistoryAt: 'desc' },
      ],
    });

    // Transform the records to handle deleted users
    return historyRecords.map(record => ({
      ...record,
      user: record.user || {
        id: null,
        name: record.userName || 'Deleted User',
        email: record.userEmail || 'N/A',
      }
    }));
  },

  // Get all history for a specific date
  async getBookingHistoryByDate(date: Date) {
    return prisma.bookingHistory.findMany({
      where: {
        date: date,
      },
      orderBy: {
        movedToHistoryAt: 'desc',
      },
    });
  },

  // Get available dates in a range
  async getCalendarDates(startDate: Date, endDate: Date) {
    const bookings = await this.getBookingsInRange(startDate, endDate);
    const dateMap = new Map();

    // Group bookings by date
    bookings.forEach(booking => {
      const dateKey = format(booking.date, 'yyyy-MM-dd');
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: booking.date,
          status: booking.status,
          waitlistCount: bookings.filter(b => 
            format(b.date, 'yyyy-MM-dd') === dateKey && 
            b.status === 'WAITLISTED'
          ).length
        });
      }
    });

    return Array.from(dateMap.values());
  },

  // Promote a waitlisted booking to pending
  async promoteWaitlistedBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== 'WAITLISTED') {
      throw new Error('Booking is not in waitlist');
    }

    // Check if there's already a pending or approved booking for this date
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: booking.date,
        status: {
          in: ['PENDING', 'APPROVED']
        },
        id: { not: bookingId }
      },
    });

    if (existingBooking) {
      throw new Error('Another booking is already pending or approved for this date');
    }

    // Update the booking status to pending and remove waitlist position
    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'PENDING',
        waitlistPos: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

}; 