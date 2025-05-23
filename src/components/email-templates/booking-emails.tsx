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

const EmailWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    color: '#333333'
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: '30px',
      borderBottom: '2px solid #ffc0cb',
      paddingBottom: '20px'
    }}>
      <h1 style={{
        color: '#d87093',
        margin: '0',
        fontSize: '24px',
        fontWeight: 'normal'
      }}>
        Engel Paradis AS
      </h1>
      <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0' }}>
        Selskaps lokle
      </p>
    </div>
    {children}
    <div style={{
      marginTop: '30px',
      padding: '20px',
      borderTop: '2px solid #ffc0cb',
      textAlign: 'center',
      fontSize: '12px',
      color: '#666'
    }}>
      <p>Engel Paradis AS</p>
      <p>Haavard martinsens vei 19, 0978 Oslo</p>
      <p>Contact: +47 900 52 670</p>
      <p style={{ marginTop: '10px' }}>
        <a 
          href="https://www.engelparadis.com" 
          style={{ 
            color: '#d87093', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          www.engelparadis.com
        </a>
      </p>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "APPROVED": return { bg: '#e6ffe6', text: '#006600' };
      case "PENDING": return { bg: '#fff3e6', text: '#cc7700' };
      case "WAITLISTED": return { bg: '#e6e6ff', text: '#000066' };
      case "REJECTED": return { bg: '#ffe6e6', text: '#cc0000' };
      default: return { bg: '#f2f2f2', text: '#666666' };
    }
  };

  const colors = getStatusColor();
  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500'
    }}>
      {status}
    </span>
  );
};

export const NewBookingEmailAdmin: React.FC<Readonly<BookingEmailProps>> = ({
  userName,
  userEmail,
  date,
  status,
  description,
}) => (
  <EmailWrapper>
    <h2 style={{ color: '#d87093', fontSize: '20px', marginBottom: '20px' }}>
      New Booking Request
    </h2>
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
      <p style={{ margin: '10px 0' }}><strong>User:</strong> {userName}</p>
      <p style={{ margin: '10px 0' }}><strong>Email:</strong> {userEmail}</p>
      <p style={{ margin: '10px 0' }}><strong>Date:</strong> {date.toLocaleDateString('no-NO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      <p style={{ margin: '10px 0' }}>
        <strong>Status:</strong> <StatusBadge status={status} />
      </p>
      {description && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #eee' }}>
          <strong>Description:</strong>
          <p style={{ margin: '10px 0', lineHeight: '1.5' }}>{description}</p>
        </div>
      )}
    </div>
  </EmailWrapper>
);

export const BookingRequestReceivedEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
  status,
}) => (
  <EmailWrapper>
    <h2 style={{ color: '#d87093', fontSize: '20px', marginBottom: '20px', textAlign: 'center' }}>
      Thank You for Your Booking Request
    </h2>
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ fontSize: '16px', margin: '15px 0' }}>
        We have received your booking request for
      </p>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        margin: '15px 0',
        color: '#d87093' 
      }}>
        {date.toLocaleDateString('no-NO', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <p style={{ margin: '15px 0' }}>
        Current status: <StatusBadge status={status} />
      </p>
      <p style={{ 
        margin: '20px 0', 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '6px',
        border: '1px solid #eee'
      }}>
        We will notify you when your request has been reviewed.
      </p>
    </div>
  </EmailWrapper>
);

export const BookingReviewedEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
  status,
  reviewNote,
}) => (
  <EmailWrapper>
    <h2 style={{ 
      color: status === "APPROVED" ? '#006600' : '#cc0000', 
      fontSize: '20px', 
      marginBottom: '20px',
      textAlign: 'center'
    }}>
      Booking {status === "APPROVED" ? "Approved" : "Rejected"}
    </h2>
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ fontSize: '16px', margin: '15px 0' }}>
        Your booking request for
      </p>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        margin: '15px 0',
        color: '#d87093' 
      }}>
        {date.toLocaleDateString('no-NO', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <p style={{ margin: '15px 0' }}>
        has been <StatusBadge status={status} />
      </p>
      {reviewNote && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fff', 
          borderRadius: '6px',
          border: '1px solid #eee'
        }}>
          <strong>Admin Note:</strong>
          <p style={{ margin: '10px 0', lineHeight: '1.5' }}>{reviewNote}</p>
        </div>
      )}
    </div>
  </EmailWrapper>
);

export const WaitlistEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
  waitlistPos,
  userName
}) => (
  <EmailWrapper>
    <h2 style={{ color: '#d87093', fontSize: '20px', marginBottom: '20px', textAlign: 'center' }}>
    Dear {userName}
    </h2>
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ fontSize: '16px', margin: '15px 0' }}>
        You have been added to the waitlist for
      </p>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        margin: '15px 0',
        color: '#d87093' 
      }}>
        {date.toLocaleDateString('no-NO', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <div style={{ 
        margin: '20px 0', 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '6px',
        border: '1px solid #eee'
      }}>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          Your position on the waitlist:
        </p>
        <p style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#d87093',
          margin: '10px 0' 
        }}>
          #{waitlistPos}
        </p>
      </div>
      <p style={{ margin: '15px 0', color: '#666' }}>
        We will notify you if a spot becomes available.
      </p>
    </div>
  </EmailWrapper>
);

export const SpotAvailableEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
}) => (
  <EmailWrapper>
    <h2 style={{ color: '#006600', fontSize: '20px', marginBottom: '20px', textAlign: 'center' }}>
      Good News! A Spot is Available
    </h2>
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ fontSize: '16px', margin: '15px 0' }}>
        A spot has become available for your waitlisted date:
      </p>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        margin: '15px 0',
        color: '#d87093' 
      }}>
        {date.toLocaleDateString('no-NO', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <div style={{ 
        margin: '20px 0', 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '6px',
        border: '1px solid #eee'
      }}>
        <p style={{ margin: '10px 0', lineHeight: '1.5' }}>
          Your booking has been moved to pending status and will be reviewed by an admin shortly.
        </p>
      </div>
    </div>
  </EmailWrapper>
);

export const BookingCanceledEmail: React.FC<Readonly<BookingEmailProps>> = ({
  date,
  userName,
}) => (
  <EmailWrapper>
    <h2 style={{ color: '#d87093', fontSize: '20px', marginBottom: '20px', textAlign: 'center' }}>
      Booking Cancellation Confirmation
    </h2>
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ fontSize: '16px', margin: '15px 0' }}>
        Dear {userName}, your booking for
      </p>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        margin: '15px 0',
        color: '#d87093' 
      }}>
        {date.toLocaleDateString('no-NO', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <div style={{ 
        margin: '20px 0', 
        padding: '15px', 
        backgroundColor: '#fff', 
        borderRadius: '6px',
        border: '1px solid #eee'
      }}>
        <p style={{ margin: '10px 0', lineHeight: '1.5' }}>
          has been successfully canceled. If you wish to make a new booking, please visit our website.
        </p>
      </div>
    </div>
  </EmailWrapper>
); 