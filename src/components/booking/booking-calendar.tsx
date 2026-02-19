'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';


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
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date | undefined;
}

export function BookingCalendar({ bookedDates: initialBookedDates, userBookings, onDateSelect, selectedDate: externalSelectedDate }: BookingCalendarProps) {
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(undefined);
  const selectedDate = externalSelectedDate ?? internalSelectedDate;
  const [bookedDates, setBookedDates] = useState(initialBookedDates);
  const [displayMonth, setDisplayMonth] = useState<Date>(selectedDate ?? new Date());

  const monthRange = useMemo(() => {
    const today = new Date();
    return {
      startMonth: new Date(today.getFullYear(), today.getMonth(), 1),
      endMonth: new Date(today.getFullYear() + 10, 11, 1),
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setDisplayMonth(selectedDate);
    }
  }, [selectedDate]);

  const handleMonthChange = async (month: Date) => {
    setDisplayMonth(month);
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
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      setInternalSelectedDate(date);
    }
  };

  const getDateBooking = (date: Date) => {
    return bookedDates.find(booking => 
      format(booking.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isDatePending = (date: Date) => {
    const booking = getDateBooking(date);
    return booking?.status === 'PENDING' ;
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
        
        className="rounded-md bg-white dark:bg-black text-theme-default"
        captionLayout="dropdown"
        startMonth={monthRange.startMonth}
        endMonth={monthRange.endMonth}
        disabled={(date) => isDateInPast(date) || hasUserBooking(date)}
        modifiers={{
          userBooked: (date) => hasUserBooking(date) && !isDatePending(date),
          userBookedPending: (date) => hasUserBooking(date) && isDatePending(date),
        }}
        modifiersClassNames={{
          userBooked: 'bg-red-800 ',
          userBookedPending: 'bg-red-800 cursor-not-allowed',
        }}
        onMonthChange={handleMonthChange}
      />


    </div>
  );
} 