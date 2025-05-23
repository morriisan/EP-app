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
  isLoggedIn: boolean;
}

export function BookingForm({ date, onSuccess, waitlistCount, isPending, isLoggedIn }: BookingFormProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {waitlistCount && waitlistCount > 0 && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-6">
          Currently {waitlistCount} {waitlistCount === 1? 'person' : 'people'} on waitlist
        </div>
      )}
      <div className="space-y-4">
        <Label htmlFor="description" className="text-base font-medium text-gray-900 dark:text-black">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={isLoggedIn ? "Add any special requirements or notes..." : "Please sign in to make a booking"}
          disabled={!isLoggedIn}
          className="w-full min-h-[100px] text-base p-4 bg-white  text-gray-900 dark:text-gray-100 border-0 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting || !isLoggedIn}
          className={`px-8 py-2.5 text-base bg-pink-500 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600 text-white ${!isLoggedIn ? 'opacity-50 dark:opacity-40 cursor-not-allowed' : ''}`}
        >
          {!isLoggedIn ? 'Please Sign In' : isSubmitting ? 'Submitting...' : isPending ? 'Join Waitlist' : 'Book Now'}
        </Button>
      </div>
    </form>
  );
} 