'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingFormProps {
  date: Date;
  onSuccess: () => void;
  isLoggedIn: boolean;
}

export function BookingForm({ date, onSuccess, isLoggedIn }: BookingFormProps) {
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    
    if (!eventType || !guestCount || !phoneNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a new date at noon to prevent timezone issues
      const bookingDate = new Date(date);
      bookingDate.setHours(12, 0, 0, 0);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: bookingDate,
          eventType,
          guestCount: parseInt(guestCount),
          description,
          phoneNumber: phoneNumber.trim(),
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create booking');
      }

      await res.json();
      
      toast.success('Request submitted successfully!');

      setDescription('');
      setEventType('');
      setGuestCount('');
      setPhoneNumber('');
      onSuccess();
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="eventType" className="text-base font-medium text-gray-900 dark:text-white ">
            Event Type <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={eventType} 
            onValueChange={setEventType}
            disabled={!isLoggedIn}
          >
            <SelectTrigger className="w-full bg-theme-accent-secondary focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="engagement">Engagement Party</SelectItem>
              <SelectItem value="birthday">Birthday Party</SelectItem>
              <SelectItem value="corporate">Corporate Event</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="guestCount" className="text-base font-medium text-gray-900 dark:text-white">
            Number of Guests <span className="text-red-500">*</span>
          </Label>
          <Input
            id="guestCount"
            type="number"
            min="1"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            placeholder="Enter expected number of guests"
            disabled={!isLoggedIn}
            className="w-full bg-theme-accent-secondary text-gray-900 dark:text-gray-100 focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber" className="text-base font-medium text-gray-900 dark:text-white">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            disabled={!isLoggedIn}
            className="w-full bg-theme-accent-secondary text-gray-900 dark:text-gray-100 focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-base font-medium text-gray-900 dark:text-white">
            Special Requirements and Notes
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isLoggedIn ? "Please describe your event and any special requirements or multiple dates..." : "Please sign in to make a booking"}
            disabled={!isLoggedIn}
            className="w-full min-h-[100px] text-base p-4 bg-theme-accent-secondary text-gray-900 dark:text-gray-100 border-0 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting || !isLoggedIn}
          className="px-8 py-2.5 text-base bg-theme-accent-primary hover:bg-black/80 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-theme-accent-primary focus-visible:ring-offset-2"
        >
          {!isLoggedIn ? 'Please Sign In' : isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
} 