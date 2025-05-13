import * as React from 'react';
import { BookingStatus } from '@prisma/client';

interface BookingEmailProps {
  userName: string;
  userEmail: string;
  date: Date;
  status: BookingStatus;
  description?: string;
  waitlistPos?: number;
  reviewNote?: string;
}

export const NewBookingEmailAdmin: React.FC<Readonly<BookingEmailProps>> = ({
  userName,
  userEmail,
  date,
  status,
  description,
}) => (
  <div>
    <h2>New Booking Request</h2>
    <p>User: {userName} ({userEmail})</p>
    <p>Date: {date.toLocaleDateString()}</p>
    <p>Status: {status}</p>
    {description && <p>Description: {description}</p>}
  </div>
);

export const BookingRequestReceivedEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
  status,
}) => (
  <div>
    <h2>Booking Request Received</h2>
    <p>Your booking request for {date.toLocaleDateString()} has been received.</p>
    <p>Current status: {status}</p>
    <p>We will notify you when an admin reviews your request.</p>
  </div>
);

export const BookingReviewedEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
  status,
  reviewNote,
}) => (
  <div>
    <h2>Booking {status === "APPROVED" ? "Approved" : "Rejected"}</h2>
    <p>
      Your booking for {date.toLocaleDateString()} has been {status === "APPROVED" ? "approved" : "rejected"}.
    </p>
    {reviewNote && <p>Admin note: {reviewNote}</p>}
  </div>
);

export const WaitlistEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
  waitlistPos,
}) => (
  <div>
    <h2>Added to Waitlist</h2>
    <p>You have been added to the waitlist for {date.toLocaleDateString()}.</p>
    <p>Your position on the waitlist: {waitlistPos}</p>
    <p>We will notify you if a spot becomes available.</p>
  </div>
);

export const SpotAvailableEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
}) => (
  <div>
    <h2>Spot Available</h2>
    <p>A spot has become available for your waitlisted date: {date.toLocaleDateString()}.</p>
    <p>Your booking has been moved to pending status and will be reviewed by an admin.</p>
  </div>
); 