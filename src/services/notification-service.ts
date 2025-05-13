import { Booking, User } from "@prisma/client";
import { Resend } from 'resend';
import * as React from 'react';
import {
  NewBookingEmailAdmin,
  BookingRequestReceivedEmail,
  BookingReviewedEmail,
  WaitlistEmail,
  SpotAvailableEmail,
} from '@/components/email-templates/booking-emails';

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingWithUser = Booking & {
  user: Pick<User, "name" | "email">;
};

export const notificationService = {
  // Send notification when a booking is created
  async sendBookingCreatedNotification(booking: BookingWithUser) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error("Admin email not configured");

    // Email to admin
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: adminEmail,
      subject: "New Booking Request",
      react: React.createElement(NewBookingEmailAdmin, {
        userName: booking.user.name,
        userEmail: booking.user.email,
        date: booking.date,
        status: booking.status,
        description: booking.description || undefined,
      }),
    });

    // Email to user
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: booking.user.email,
      subject: "Booking Request Received",
      react: React.createElement(BookingRequestReceivedEmail, {
        userName: booking.user.name,
        userEmail: booking.user.email,
        date: booking.date,
        status: booking.status,
      }),
    });
  },

  // Send notification when a booking is reviewed
  async sendBookingReviewedNotification(booking: BookingWithUser) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: booking.user.email,
      subject: `Booking ${booking.status === "APPROVED" ? "Approved" : "Rejected"}`,
      react: React.createElement(BookingReviewedEmail, {
        userName: booking.user.name,
        userEmail: booking.user.email,
        date: booking.date,
        status: booking.status,
        reviewNote: booking.reviewNote || undefined,
      }),
    });
  },

  // Send notification when someone joins waitlist
  async sendWaitlistNotification(booking: BookingWithUser) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: booking.user.email,
      subject: "Added to Waitlist",
      react: React.createElement(WaitlistEmail, {
        userName: booking.user.name,
        userEmail: booking.user.email,
        date: booking.date,
        status: booking.status,
        waitlistPos: booking.waitlistPos || undefined,
      }),
    });
  },

  // Send notification when a spot becomes available
  async sendSpotAvailableNotification(booking: BookingWithUser) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: booking.user.email,
      subject: "Spot Available",
      react: React.createElement(SpotAvailableEmail, {
        userName: booking.user.name,
        userEmail: booking.user.email,
        date: booking.date,
        status: booking.status,
      }),
    });
  },
}; 