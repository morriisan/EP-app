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

  const getDateBooking = (date: Date) => {
    return bookedDates.find(booking => 
      format(booking.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isDateBooked = (date: Date) => {
    const booking = getDateBooking(date);
    return booking?.status === 'APPROVED';
  };

  const isDatePending = (date: Date) => {
    const booking = getDateBooking(date);
    return booking?.status === 'PENDING';
  };

  const hasUserBooking = (date: Date) => {
    return userBookings.some(booking => 
      format(booking.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      (booking.status === 'APPROVED' || booking.status === 'PENDING' || booking.status === 'WAITLISTED')
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-theme-section-primary rounded-xl shadow-sm">
        <div className="p-6 border-b border-theme-border-default">
          <h2 className="text-xl font-semibold text-theme-primary">Available Dates</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-theme-primary">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-800"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-600"></div>
              <span>Waitlist Available</span>
            </div>
          </div>
        </div>
        <div className="p-2 flex justify-center items-center">
          <BookingCalendar 
            bookedDates={bookedDates}
            userBookings={userBookings}
            isLoggedIn={isLoggedIn}
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
              Book for {format(selectedDate, 'MMMM d, yyyy')}
              {((isDatePending(selectedDate) && !hasUserBooking(selectedDate)) || isDateBooked(selectedDate)) && (
                <span className="ml-2 text-sm text-yellow-600 dark:text-yellow-400">(Will be waitlisted)</span>
              )}
            </h2>
          </div>
          <div className="p-6">
            <BookingForm 
              date={selectedDate}
              onSuccess={() => setSelectedDate(undefined)}
              waitlistCount={getDateBooking(selectedDate)?.waitlistCount}
              isPending={isDatePending(selectedDate)}
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