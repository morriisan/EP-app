'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BookingFormProps {
  date?: Date;
  onSuccess?: () => void;
}

export function BookingForm({ date, onSuccess }: BookingFormProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select a date first');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          description
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await res.json();
      toast.success(booking.status === 'WAITLISTED' 
        ? 'Added to waitlist successfully!' 
        : 'Booking submitted successfully!'
      );
      setDescription('');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/40 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-pink-800 dark:text-pink-300 mb-6">
        {date ? `Book for ${format(date, 'MMMM d, yyyy')}` : 'Make a Booking'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="description" className="text-base font-medium">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={date ? "Add any special requirements or notes..." : "Please select a date first"}
            className="min-h-[100px] w-full"
            disabled={!date}
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || !date}
            className={`px-8 py-2.5 text-base ${!date ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : date ? 'Book Now' : 'Select a Date'}
          </Button>
        </div>
      </form>
    </div>
  );
} 