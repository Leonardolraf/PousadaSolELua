import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, eachDayOfInterval, parseISO } from "date-fns";

interface Booking {
  room_id: string;
  check_in: string;
  check_out: string;
  status: string;
}

export const useRoomAvailability = (roomId: string) => {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedDates = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("check_in, check_out, status")
        .eq("room_id", roomId)
        .in("status", ["pending", "confirmed"]);

      if (error) throw error;

      const blocked: Date[] = [];
      data?.forEach((booking: Booking) => {
        const start = parseISO(booking.check_in);
        const end = parseISO(booking.check_out);
        const datesInRange = eachDayOfInterval({ start, end });
        blocked.push(...datesInRange);
      });

      setBlockedDates(blocked);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedDates();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`bookings-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          console.log("Booking changed, refreshing availability...");
          fetchBlockedDates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(
      (blocked) => format(blocked, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const checkAvailability = async (
    checkIn: Date,
    checkOut: Date
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("id")
        .eq("room_id", roomId)
        .in("status", ["pending", "confirmed"])
        .or(
          `and(check_in.lte.${format(checkOut, "yyyy-MM-dd")},check_out.gte.${format(checkIn, "yyyy-MM-dd")})`
        );

      if (error) throw error;

      return !data || data.length === 0;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  };

  return { blockedDates, loading, isDateBlocked, checkAvailability };
};
