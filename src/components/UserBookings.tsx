import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, DollarSign, X, Star } from "lucide-react";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ReviewForm } from "@/components/ReviewForm";

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  room_title: string;
  created_at: string;
  hasReview?: boolean;
}

export const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Erro ao carregar reservas");
      return;
    }

    // Check which bookings have reviews
    const bookingIds = data?.map(b => b.id) || [];
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("booking_id")
      .in("booking_id", bookingIds);

    const reviewedBookingIds = new Set(reviewsData?.map(r => r.booking_id) || []);
    
    const bookingsWithReviewStatus = data?.map(booking => ({
      ...booking,
      hasReview: reviewedBookingIds.has(booking.id)
    })) || [];

    setBookings(bookingsWithReviewStatus);
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Erro ao cancelar reserva");
      return;
    }

    toast.success("Reserva cancelada com sucesso");
    fetchBookings();
  };

  const canReview = (booking: Booking) => {
    return (
      booking.status === "confirmed" &&
      isPast(new Date(booking.check_out)) &&
      !booking.hasReview
    );
  };

  const handleOpenReviewDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    setReviewDialogOpen(false);
    setSelectedBookingId(null);
    fetchBookings();
    toast.success("Avaliação enviada com sucesso!");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      pending: { label: "Pendente", variant: "secondary" },
      confirmed: { label: "Confirmada", variant: "default" },
      cancelled: { label: "Cancelada", variant: "destructive" },
    };
    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return <div>Carregando reservas...</div>;
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Reservas</CardTitle>
          <CardDescription>Você ainda não fez nenhuma reserva</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Reservas</CardTitle>
        <CardDescription>Acompanhe suas solicitações de reserva</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{booking.room_title}</CardTitle>
                  <CardDescription className="mt-1">
                    Solicitado em {format(new Date(booking.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </CardDescription>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(booking.check_in), "dd/MM/yyyy", { locale: ptBR })} até{" "}
                  {format(new Date(booking.check_out), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{booking.guests} {booking.guests === 1 ? "hóspede" : "hóspedes"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>R$ {booking.total_price.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2 mt-2">
                {booking.status === "pending" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar Reserva
                  </Button>
                )}
                
                {canReview(booking) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReviewDialog(booking.id)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Avaliar Estadia
                  </Button>
                )}
                
                {booking.hasReview && (
                  <Badge variant="outline" className="ml-auto">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    Avaliada
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar sua Estadia</DialogTitle>
          </DialogHeader>
          {selectedBookingId && (
            <ReviewForm
              bookingId={selectedBookingId}
              onSuccess={handleReviewSuccess}
              onCancel={() => setReviewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
