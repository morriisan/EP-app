'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { BookingCalendar } from '@/components/booking/booking-calendar';
import { BookingForm } from '@/components/booking/booking-form';

interface BookingClientWrapperProps {
  bookedDates: Array<{
    date: Date;
    status: string;
    waitlistCount?: number;
  }>;
  userBookings: Array<{
    date: Date;
    status: string;
  }>;
  isLoggedIn: boolean;
}

export function BookingClientWrapper({ bookedDates, userBookings, isLoggedIn }: BookingClientWrapperProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-theme-section-primary rounded-xl shadow-sm">
        <div className="p-6 border-b border-theme-border-default">
          <h2 className="text-xl font-semibold text-theme-primary">Request Booking Date</h2>
        </div>
        <div className="p-2 flex justify-center items-center">
          <BookingCalendar
              bookedDates={bookedDates}
              userBookings={userBookings}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
        </div>
      </div>

      {/* Booking Form Section - Under Calendar */}
      {selectedDate ? (
        <div className="bg-theme-section-primary rounded-xl shadow-sm">
          <div className="p-6 border-b border-theme-border-default">
            <h2 className="text-xl font-semibold text-theme-primary">
              Request for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
          </div>
          <div className="p-6">
            <BookingForm 
              date={selectedDate}
              onSuccess={() => setSelectedDate(undefined)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      ) : (
        <div className="bg-theme-section-primary rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-theme-primary">Select a Date</h2>
            <p className="text-theme-default mt-2">
              Choose a date from the calendar to start booking your event.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 