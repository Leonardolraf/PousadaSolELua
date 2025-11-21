import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, DollarSign, Check, X, Mail, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  room_title: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  created_at: string;
}

export const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingBookings();
    }
  }, [isAdmin]);

  const fetchPendingBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Erro ao carregar reservas');
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  const handleApproveBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);

    if (error) {
      console.error('Error approving booking:', error);
      toast.error('Erro ao aprovar reserva');
      return;
    }

    toast.success('Reserva aprovada com sucesso!');
    fetchPendingBookings();
  };

  const handleRejectBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Erro ao rejeitar reserva');
      return;
    }

    toast.success('Reserva rejeitada');
    fetchPendingBookings();
  };

  const setupInitialUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('setup-initial-users');
      
      if (error) {
        toast.error('Erro ao criar usuários: ' + error.message);
      } else {
        toast.success('Usuários iniciais criados com sucesso!');
      }
    } catch (error) {
      toast.error('Erro inesperado');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reservas Pendentes</CardTitle>
          <CardDescription>
            {loading ? 'Carregando...' : `${bookings.length} reserva(s) aguardando aprovação`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookings.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground">Nenhuma reserva pendente</p>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{booking.room_title}</CardTitle>
                      <CardDescription className="mt-1">
                        Solicitado em {format(new Date(booking.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Pendente</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
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
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Informações do Hóspede:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.guest_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.guest_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.guest_phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleApproveBooking(booking.id)}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectBooking(booking.id)}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ferramentas Administrativas</CardTitle>
          <CardDescription>
            Utilitários para gerenciar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={setupInitialUsers}>
            Criar Usuários Iniciais
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Cria usuários de teste para desenvolvimento. Use com cautela em produção.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
