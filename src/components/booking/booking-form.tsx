'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingFormProps {
  date: Date;
  onSuccess: () => void;
  waitlistCount?: number;
  isPending: boolean;
}

export function BookingForm({ date, onSuccess, waitlistCount, isPending }: BookingFormProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create a new date at noon to prevent timezone issues
      const bookingDate = new Date(date);
      bookingDate.setHours(12, 0, 0, 0);
      
      console.log('Selected datex:', format(date, 'yyyy-MM-dd'));
      console.log('Booking date to send:', format(bookingDate, 'yyyy-MM-dd HH:mm:ss'));

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: bookingDate,
          description
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create booking');
      }

      const booking = await res.json();
      
      if (booking.status === 'WAITLISTED') {
        toast.success(`Added to waitlist! You are #${booking.waitlistPos} in line.`);
      } else {
        toast.success('Booking submitted successfully!');
      }

      setDescription('');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {waitlistCount && waitlistCount > 0 && (
        <div className="text-sm text-yellow-600 mb-4">
          Currently {waitlistCount} {waitlistCount === 1? 'person' : 'people'} on waitlist
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any special requirements or notes..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : isPending ? 'Join Waitlist' : 'Book Now'}
        </Button>
      </div>
    </form>
  );
} 