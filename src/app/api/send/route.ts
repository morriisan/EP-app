import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { requireAuth } from "@/lib/auth-middleware";
import { 
  NewBookingEmailAdmin,
  BookingRequestReceivedEmail,
  BookingReviewedEmail,
  WaitlistEmail,
  SpotAvailableEmail 
} from '@/components/email-templates/booking-emails';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = requireAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let emailComponent;
    switch (type) {
      case "NEW_BOOKING":
        emailComponent = React.createElement(NewBookingEmailAdmin, {
          userName: data.userName,
          userEmail: data.userEmail,
          date: new Date(data.date),
          status: data.status,
          description: data.description
        });
        break;
      case "BOOKING_RECEIVED":
        emailComponent = React.createElement(BookingRequestReceivedEmail, {
          userName: data.userName,
          userEmail: data.userEmail,
          date: new Date(data.date),
          status: data.status
        });
        break;
      case "BOOKING_REVIEWED":
        emailComponent = React.createElement(BookingReviewedEmail, {
          userName: data.userName,
          userEmail: data.userEmail,
          date: new Date(data.date),
          status: data.status,
          reviewNote: data.reviewNote
        });
        break;
      case "WAITLIST":
        emailComponent = React.createElement(WaitlistEmail, {
          userName: data.userName,
          userEmail: data.userEmail,
          date: new Date(data.date),
          status: data.status,
          waitlistPos: data.waitlistPos
        });
        break;
      case "SPOT_AVAILABLE":
        emailComponent = React.createElement(SpotAvailableEmail, {
          userName: data.userName,
          userEmail: data.userEmail,
          date: new Date(data.date),
          status: data.status
        });
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.to,
      subject: data.subject,
      react: emailComponent,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(emailData);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}); 