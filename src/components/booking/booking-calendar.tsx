'use client';

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { BookingForm } from '@/components/booking/booking-form';
import { CalendarDay } from '@/services/calendar-service';
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  bookedDates: Date[];
}

export function BookingCalendar({ bookedDates }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    console.log('Selected date:', date ? format(date, 'yyyy-MM-dd') : 'none');
    setSelectedDate(date);
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
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
        disabled={(date) => isDateBooked(date) || isDateInPast(date)}
        modifiers={{
          booked: isDateBooked,
          past: isDateInPast,
        }}
        modifiersClassNames={{
          booked: 'bg-gray-100 text-gray-500 cursor-not-allowed',
          past: 'bg-gray-50 text-gray-400 cursor-not-allowed',
        }}
      />

      {selectedDate && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">
            Book for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <BookingForm 
            date={selectedDate}
            onSuccess={() => setSelectedDate(undefined)}
          />
        </div>
      )}
    </div>
  );
} 