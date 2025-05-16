'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface BookingHistory {
  id: string;
  userId: string;
  date: string;
  status: 'PENDING' | 'WAITLISTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason: 'CANCELLED' | 'PAST_DATE' | 'REJECTED';
  reviewNote?: string;
  movedToHistoryAt: string;
  user: {
    name: string;
    email: string;
  };
}

export function BookingHistoryTable() {
  const { data: session } = useSession();
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const response = await fetch('/api/bookings/admin?type=history');
      if (!response.ok) throw new Error('Failed to fetch booking history');
      const data = await response.json();
      setBookingHistory(data);
    } catch (error) {
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: BookingHistory['status']) => {
    const styles = {
      PENDING: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
      WAITLISTED: 'bg-blue-50 text-blue-800 ring-blue-600/20',
      APPROVED: 'bg-green-50 text-green-700 ring-green-600/20',
      REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
      CANCELLED: 'bg-gray-50 text-gray-700 ring-gray-600/20',
    };
    return styles[status];
  };

  const getReasonStyle = (reason: BookingHistory['reason']) => {
    const styles = {
      CANCELLED: 'bg-gray-50 text-gray-700 ring-gray-600/20',
      PAST_DATE: 'bg-orange-50 text-orange-700 ring-orange-600/20',
      REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
    };
    return styles[reason];
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
        <CardDescription>
          View past bookings and their outcomes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Review Note</TableHead>
              <TableHead>Moved to History</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No booking history found
                </TableCell>
              </TableRow>
            ) : (
              bookingHistory.map((booking) => (
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
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getReasonStyle(booking.reason)}`}>
                      {booking.reason}
                    </span>
                  </TableCell>
                  <TableCell>
                    {booking.reviewNote || '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.movedToHistoryAt).toLocaleString()}
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