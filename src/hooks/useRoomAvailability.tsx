import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isWithinInterval } from "date-fns";

interface Booking {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: string;
}

export const useRoomAvailability = (roomId: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings and subscribe to real-time updates
  useEffect(() => {
    fetchBookings();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_availability'
        },
        (payload) => {
          console.log('Booking change detected:', payload);
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    // Use the booking_availability view to only access non-sensitive data
    const { data, error } = await supabase
      .from('booking_availability')
      .select('id, room_id, check_in, check_out, status');

    if (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  // Check if a specific date is blocked for this room
  const isDateBlocked = (date: Date, specificRoomId?: string) => {
    const checkRoomId = specificRoomId || roomId;
    if (!checkRoomId) return false;

    return bookings.some((booking) => {
      if (booking.room_id !== checkRoomId) return false;
      
      const bookingStart = parseISO(booking.check_in);
      const bookingEnd = parseISO(booking.check_out);
      
      return isWithinInterval(date, { start: bookingStart, end: bookingEnd });
    });
  };

  // Get all blocked dates for a specific room
  const getBlockedDates = (specificRoomId?: string) => {
    const checkRoomId = specificRoomId || roomId;
    if (!checkRoomId) return [];
    
    const blocked: Date[] = [];
    bookings.forEach((booking) => {
      if (booking.room_id === checkRoomId) {
        const start = parseISO(booking.check_in);
        const end = parseISO(booking.check_out);
        
        let currentDate = new Date(start);
        while (currentDate <= end) {
          blocked.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    
    return blocked;
  };

  // Check if a date range is available
  const checkAvailability = async (checkIn: Date, checkOut: Date, specificRoomId?: string) => {
    const checkRoomId = specificRoomId || roomId;
    if (!checkRoomId || !checkIn || !checkOut) return true;

    // Check locally first (faster)
    const localBookings = bookings.filter(
      (booking) => booking.room_id === checkRoomId
    );

    for (const booking of localBookings) {
      const bookingStart = parseISO(booking.check_in);
      const bookingEnd = parseISO(booking.check_out);

      // Check if there's any overlap
      if (checkIn < bookingEnd && checkOut > bookingStart) {
        return false;
      }
    }

    return true;
  };

  return {
    bookings,
    loading,
    blockedDates: getBlockedDates(),
    isDateBlocked,
    checkAvailability,
    getBlockedDates,
  };
};
