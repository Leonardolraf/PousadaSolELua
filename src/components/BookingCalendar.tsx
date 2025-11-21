import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

interface Room {
  id: string;
  title: string;
  price: number;
  capacity: string;
  available: boolean;
}

const rooms: Room[] = [
  { id: "standard", title: "Quarto Standard", price: 280, capacity: "2 pessoas", available: true },
  { id: "premium", title: "Suíte Premium", price: 420, capacity: "2 pessoas", available: true },
  { id: "chale", title: "Chalé Familiar", price: 550, capacity: "4 pessoas", available: true },
];

export const BookingCalendar = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [guests, setGuests] = useState<string>("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { blockedDates, isDateBlocked, checkAvailability } = useRoomAvailability(
    selectedRoom || "standard"
  );

  const handleOpenDialog = () => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para fazer uma reserva.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (checkIn && checkOut && selectedRoom) {
      checkDateAvailability();
    }
  }, [checkIn, checkOut, selectedRoom]);

  const checkDateAvailability = async () => {
    if (!checkIn || !checkOut || !selectedRoom) return;

    const isAvailable = await checkAvailability(checkIn, checkOut);
    if (!isAvailable) {
      setAvailabilityError(
        "As datas selecionadas não estão disponíveis. Por favor, escolha outras datas."
      );
    } else {
      setAvailabilityError("");
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;
    const room = rooms.find((r) => r.id === selectedRoom);
    if (!room) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    return nights * room.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!checkIn || !checkOut || !selectedRoom) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todas as informações de reserva.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Final availability check
    const isAvailable = await checkAvailability(checkIn, checkOut);
    if (!isAvailable) {
      toast({
        title: "Quarto Indisponível",
        description: "Desculpe, este quarto não está disponível para as datas selecionadas.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const room = rooms.find((r) => r.id === selectedRoom);
    const nights = differenceInDays(checkOut, checkIn);
    const total = calculateTotal();

    try {
      // Save booking to database
      const { error } = await supabase.from("bookings").insert({
        room_id: selectedRoom,
        room_title: room?.title || "",
        guest_name: name,
        guest_email: email,
        guest_phone: phone,
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        guests: parseInt(guests),
        total_price: total,
        status: "pending",
        user_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Reserva Confirmada!",
        description: "Sua reserva foi registrada com sucesso. Entraremos em contato em breve.",
      });

      // Reset form
      setCheckIn(undefined);
      setCheckOut(undefined);
      setName("");
      setEmail("");
      setPhone("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Erro ao criar reserva",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        onClick={handleOpenDialog}
        className="bg-primary hover:bg-golden-dark text-primary-foreground font-bold"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        Fazer Reserva Online
      </Button>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="title-font text-2xl">Faça sua Reserva</DialogTitle>
          <DialogDescription>
            Selecione as datas, escolha seu quarto e complete sua reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dates Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Selecione as Datas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) =>
                          date < new Date() || isDateBlocked(date)
                        }
                        initialFocus
                        className="pointer-events-auto"
                        modifiers={{
                          booked: blockedDates,
                        }}
                        modifiersClassNames={{
                          booked: "bg-destructive/20 text-destructive line-through",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) =>
                          !checkIn || date <= checkIn || isDateBlocked(date)
                        }
                        initialFocus
                        className="pointer-events-auto"
                        modifiers={{
                          booked: blockedDates,
                        }}
                        modifiersClassNames={{
                          booked: "bg-destructive/20 text-destructive line-through",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    {nights} {nights === 1 ? "noite" : "noites"} selecionadas
                  </p>
                </div>
              )}

              {availabilityError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{availabilityError}</AlertDescription>
                </Alert>
              )}
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Datas riscadas estão indisponíveis</p>
                <p>• As disponibilidades são atualizadas em tempo real</p>
              </div>
            </div>

            {/* Room Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Escolha seu Quarto</h3>
              
              <div>
                <Label>Tipo de Quarto</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um quarto" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{room.title}</span>
                          <span className="ml-4 text-primary font-semibold">
                            R$ {room.price}/noite
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Número de Hóspedes</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "hóspede" : "hóspedes"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRoom && nights > 0 && (
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Valor por noite:</span>
                    <span className="font-semibold">
                      R$ {rooms.find((r) => r.id === selectedRoom)?.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Número de noites:</span>
                    <span className="font-semibold">{nights}</span>
                  </div>
                  <div className="border-t border-primary/20 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        R$ {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Suas Informações</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="booking-name">Nome Completo *</Label>
                <Input
                  id="booking-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="booking-email">E-mail *</Label>
                <Input
                  id="booking-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="booking-phone">Telefone *</Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogTrigger>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-golden-dark text-primary-foreground"
              disabled={
                !checkIn || 
                !checkOut || 
                !selectedRoom || 
                !name || 
                !email || 
                !phone || 
                !!availabilityError ||
                isSubmitting
              }
            >
              {isSubmitting ? "Processando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
