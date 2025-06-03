'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Booking {
  id: string;
  userId: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  description?: string;
  eventType: string;
  guestCount: number;
  reviewNote?: string;
  user: {
    name: string;
    email: string;
  };
}

export function BookingTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [bookingToReject, setBookingToReject] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/admin');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (bookingId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/bookings/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status,
          reviewNote: reviewNotes[bookingId],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to review booking');
      }

      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchBookings(); // Refresh the list
      setReviewNotes(prev => ({ ...prev, [bookingId]: '' }));
      setBookingToReject(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to review booking');
    }
  };

  const toggleDescription = (bookingId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <ConfirmationDialog
        open={!!bookingToReject}
        onOpenChange={(open) => !open && setBookingToReject(null)}
        onConfirm={() => bookingToReject && handleReview(bookingToReject, 'REJECTED')}
        title="Reject Booking"
        description="Are you sure you want to reject this booking? This action cannot be undone. The user will be notified of this rejection."
        confirmText="Reject"
        variant="destructive"
      />

      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
          <CardDescription>
            Review and manage booking requests
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Review Note</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
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
                      <div className="flex flex-col gap-2 max-w-[300px]">
                        <div>
                          <span className="font-medium">Event Type: </span>
                          <span className="text-sm">{booking.eventType}</span>
                        </div>
                        <div>
                          <span className="font-medium">Guests: </span>
                          <span className="text-sm">{booking.guestCount}</span>
                        </div>
                        {booking.description && (
                          <div>
                            <span className="font-medium">Special Requirements:</span>
                            <div className="mt-1">
                              <p className="text-sm break-words whitespace-pre-wrap">
                                {expandedDescriptions[booking.id] 
                                  ? booking.description 
                                  : truncateText(booking.description, 100)}
                              </p>
                              {booking.description.length > 100 && (
                                <button
                                  onClick={() => toggleDescription(booking.id)}
                                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 underline"
                                >
                                  {expandedDescriptions[booking.id] ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        booking.status === 'PENDING' 
                          ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                          : booking.status === 'APPROVED' 
                          ? 'bg-green-50 text-green-700 ring-green-600/20'
                          : 'bg-red-50 text-red-700 ring-red-600/20'
                      }`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="Add a review note..."
                        value={reviewNotes[booking.id] || ''}
                        onChange={(e) => setReviewNotes(prev => ({
                          ...prev,
                          [booking.id]: e.target.value
                        }))}
                        className="min-h-[60px] resize-none"
                        disabled={booking.status === 'REJECTED'}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleReview(booking.id, 'APPROVED')}
                            variant="default"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => setBookingToReject(booking.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {booking.status === 'APPROVED' && (
                        <Button
                          onClick={() => setBookingToReject(booking.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Reject
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
} 