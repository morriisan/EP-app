import { Booking, User } from "@prisma/client";
import { Resend } from 'resend';
import * as React from 'react';
import {
  NewBookingEmailAdmin,
  BookingRequestReceivedEmail,
  BookingReviewedEmail,
  WaitlistEmail,
  SpotAvailableEmail,
  BookingCanceledEmail,
} from '@/components/email-templates/booking-emails';

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingWithUser = Booking & {
  user: Pick<User, "name" | "email">;
};

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  react: React.ReactElement;
}

interface ResendError {
  statusCode: number;
  message: string;
  name: string;
}

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to send email with retry logic
async function sendEmailWithRetry(emailConfig: EmailConfig, retries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await resend.emails.send(emailConfig);
      return result;
    } catch (error) {
      const resendError = error as ResendError;
      // Check if it's a rate limit error (429)
      if (resendError.statusCode === 429) {
        if (attempt === retries) {
          throw error; // If we're out of retries, throw the error
        }
        // Wait longer for each retry
        await delay(delayMs * attempt);
        continue;
      }
      throw error; // For other errors, throw immediately
    }
  }
}

export const notificationService = {
  // Send notification when a booking is created
  async sendBookingCreatedNotification(booking: BookingWithUser) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error("Admin email not configured");

    try {
      // Email to admin
      await sendEmailWithRetry({
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

      // Add delay before sending user email
      await delay(1000);

      // Email to user
      await sendEmailWithRetry({
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

      console.log('Successfully sent emails to:', { admin: adminEmail, user: booking.user.email });
    } catch (error) {
      console.error('Failed to send emails:', error);
      throw error;
    }
  },

  // Send notification when a booking is reviewed
  async sendBookingReviewedNotification(booking: BookingWithUser) {
    await sendEmailWithRetry({
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
    await sendEmailWithRetry({
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
    await sendEmailWithRetry({
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

  // Send notification when a booking is canceled
  async sendBookingCanceledNotification(booking: BookingWithUser) {
    try {
      await sendEmailWithRetry({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: booking.user.email,
        subject: "Booking Cancellation Confirmation",
        react: React.createElement(BookingCanceledEmail, {
          userName: booking.user.name,
          userEmail: booking.user.email,
          date: booking.date,
          status: booking.status,
        }),
      });

      // Also notify admin about the cancellation
      const adminEmail = "morrisan2001@gmail.com";
      if (adminEmail) {
        await delay(1000); // Add delay before sending admin email
        await sendEmailWithRetry({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: adminEmail,
          subject: `Booking Canceled - ${booking.user.name}`,
          react: React.createElement(NewBookingEmailAdmin, {
            userName: booking.user.name,
            userEmail: booking.user.email,
            date: booking.date,
            status: booking.status,
            description: "This booking has been canceled by the user.",
          }),
        });
      }

      console.log('Successfully sent cancellation emails to:', { user: booking.user.email, admin: adminEmail });
    } catch (error) {
      console.error('Failed to send cancellation emails:', error);
      throw error;
    }
  },
}; 