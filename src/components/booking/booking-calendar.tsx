'use client';

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { BookingForm } from '@/components/booking/booking-form';


interface BookingCalendarProps {
  bookedDates: Array<{
    date: Date;
    status: string;
    waitlistCount?: number;
  }>;
  userBookings: Array<{
    date: Date;
    status: string;
  }>;
}

export function BookingCalendar({ bookedDates: initialBookedDates, userBookings }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookedDates, setBookedDates] = useState(initialBookedDates);

  const handleMonthChange = async (month: Date) => {
    try {
      const response = await fetch(`/api/calendar?month=${month.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch calendar data');
      
      const newBookings = await response.json();
      setBookedDates(prevBookings => {
        const allBookings = [...prevBookings, ...newBookings];
        const bookingMap = new Map();
        
        allBookings.forEach(booking => {
          const dateKey = format(new Date(booking.date), 'yyyy-MM-dd');
          bookingMap.set(dateKey, booking);
        });
        
        return Array.from(bookingMap.values());
      });
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    console.log('Selected date:', date ? format(date, 'yyyy-MM-dd') : 'none');
    setSelectedDate(date);
  };

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
    return booking?.status === 'PENDING' ;
  };

  const isDateWaitlist = (date: Date) => {
    const booking = getDateBooking(date);
    return booking?.status === 'WAITLISTED';
  };

  const hasUserBooking = (date: Date) => {
    return userBookings.some(booking => 
      format(booking.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      (booking.status === 'APPROVED' || booking.status === 'PENDING' || booking.status === 'WAITLISTED')
    );
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  return (
    <div className="space-y-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md border"
        disabled={(date) => isDateInPast(date) || hasUserBooking(date)}
        modifiers={{
          userBooked: (date) => hasUserBooking(date) && !isDatePending(date),
          userBookedPending: (date) => hasUserBooking(date) && isDatePending(date),
          booked: (date) => isDateBooked(date) && !hasUserBooking(date),
          pending: (date) => isDatePending(date) && !hasUserBooking(date),
          waitlist: (date) => isDateWaitlist(date) && hasUserBooking(date) && !isDatePending(date),
        }}
        modifiersClassNames={{
          userBooked: 'bg-red-300 cursor-not-allowed',
          userBookedPending: 'bg-red-400 cursor-not-allowed ',
          booked: 'bg-red-100 text-gray-500 cursor-not-allowed',
          pending: 'bg-yellow-100 text-gray-900 cursor-pointer',
          waitlist: 'bg-blue-100 text-gray-500 cursor-not-allowed',
        }}
        onMonthChange={handleMonthChange}
      />

      {selectedDate && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">
            Book for {format(selectedDate, 'MMMM d, yyyy')}
            {isDatePending(selectedDate) && !hasUserBooking(selectedDate) && (
              <span className="ml-2 text-sm text-yellow-600">(Will be waitlisted)</span>
            )}
          </h3>
          <BookingForm 
            date={selectedDate}
            onSuccess={() => setSelectedDate(undefined)}
            waitlistCount={getDateBooking(selectedDate)?.waitlistCount}
            isPending={isDatePending(selectedDate)}
          />
        </div>
      )}
    </div>
  );
} 