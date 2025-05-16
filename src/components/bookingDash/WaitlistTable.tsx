'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface WaitlistedBooking {
  id: string;
  userId: string;
  date: string;
  status: 'WAITLISTED';
  waitlistPos: number;
  user: {
    name: string;
    email: string;
  };
  isDateAvailable?: boolean;
}

interface BookingResponse {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'WAITLISTED' | 'REJECTED';
}

export function WaitlistTable() {
  const [waitlistedBookings, setWaitlistedBookings] = useState<WaitlistedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState<string | null>(null);

  const checkDateAvailability = async (date: string) => {
    try {
      const response = await fetch(`/api/bookings?date=${date}`);
      if (!response.ok) throw new Error('Failed to check date availability');
      const bookings = await response.json();
      
      // Date is available if there are no PENDING or APPROVED bookings
      return !bookings.some((booking: BookingResponse) => 
        booking.status === 'PENDING' || booking.status === 'APPROVED'
      );
    } catch (error) {
      console.error('Error checking date availability:', error);
      return false; // Assume date is not available if there's an error
    }
  };

  const fetchWaitlistedBookings = useCallback(async () => {
    try {
      // Get waitlisted bookings
      const response = await fetch('/api/bookings/admin?status=WAITLISTED');
      if (!response.ok) throw new Error('Failed to fetch waitlisted bookings');
      const waitlisted = await response.json();

      // Check availability for each waitlisted booking's date
      const bookingsWithAvailability = await Promise.all(
        waitlisted.map(async (booking: WaitlistedBooking) => ({
          ...booking,
          isDateAvailable: await checkDateAvailability(booking.date)
        }))
      );

      setWaitlistedBookings(bookingsWithAvailability);
    } catch (error) {
      console.error('Error fetching waitlisted bookings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load waitlisted bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaitlistedBookings();
  }, [fetchWaitlistedBookings]);

  const handlePromote = async (bookingId: string) => {
    setPromoting(bookingId);
    try {
      const response = await fetch('/api/bookings/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to promote booking');
      }

      toast.success('Booking promoted to pending successfully');
      fetchWaitlistedBookings(); // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to promote booking');
    } finally {
      setPromoting(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waitlist Management</CardTitle>
        <CardDescription>
          Manage waitlisted booking requests. Green checkmark indicates the date is now available.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Waitlist Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waitlistedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No waitlisted bookings found
                </TableCell>
              </TableRow>
            ) : (
              waitlistedBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {new Date(booking.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.user.name}</span>
                      <span className="text-sm text-muted-foreground">{booking.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-600/20">
                      Position #{booking.waitlistPos}
                    </span>
                  </TableCell>
                  <TableCell>
                    {booking.isDateAvailable ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span>Date Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>Date Occupied</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handlePromote(booking.id)}
                      variant={booking.isDateAvailable ? "default" : "secondary"}
                      size="sm"
                      disabled={!!promoting || !booking.isDateAvailable}
                    >
                      {promoting === booking.id ? 'Promoting...' : 'Promote to Pending'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 