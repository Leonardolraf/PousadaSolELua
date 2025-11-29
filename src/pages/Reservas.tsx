import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, AlertCircle, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Room {
  id: string;
  title: string;
  price: number;
  capacity: string;
  size: string;
  description: string;
  amenities: string[];
  image: string;
}

const rooms: Room[] = [
  {
    id: "standard",
    title: "Quarto Standard",
    price: 280,
    capacity: "2 pessoas",
    size: "25m²",
    description: "Ideal para casais, com vista parcial para o mar e todas as comodidades necessárias.",
    amenities: ["Wi-Fi", "Ar-condicionado", "TV", "Frigobar", "Banheiro privativo"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3KItMz9TTWeDb-HsFxSh2_su5inT7X6Y4A&s",
  },
  {
    id: "premium",
    title: "Suíte Premium",
    price: 420,
    capacity: "2 pessoas",
    size: "40m²",
    description: "Amplo espaço com varanda privativa, vista panorâmica para o mar e banheira de hidromassagem.",
    amenities: ["Wi-Fi", "Ar-condicionado", "TV", "Frigobar", "Varanda", "Hidromassagem"],
    image: "@\\assets\\gallery\\quarto-4.jpg",
  },
  {
    id: "chale",
    title: "Chalé Familiar",
    price: 550,
    capacity: "4 pessoas",
    size: "60m²",
    description: "Espaçoso chalé com dois quartos, ideal para famílias ou grupos pequenos.",
    amenities: ["Wi-Fi", "Ar-condicionado", "TV", "Cozinha equipada", "Sala de estar", "2 Quartos"],
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-40566347/original/b181d2b1-f6bd-45cb-b3f8-770e8eff2de7.jpeg",
  },
];

const Reservas = () => {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [guests, setGuests] = useState<string>("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);

  const { blockedDates, isDateBlocked, checkAvailability } = useRoomAvailability(
    selectedRoom || "standard"
  );

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para fazer uma reserva.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
    const total = calculateTotal();

    try {
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

      navigate("/profile");
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

  if (loading || isAdmin || !user) {
    return null;
  }

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);

  const canProceedToStep2 = selectedRoom && checkIn && checkOut && !availabilityError;
  const canProceedToStep3 = canProceedToStep2 && guests;

  return (
    <PageTransition>
      <div className="min-h-screen bg-muted/30">
        <Navigation />
        <Breadcrumbs />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="title-font text-4xl md:text-5xl font-bold text-foreground mb-4">
              Fazer Reserva Online
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reserve sua estadia em poucos passos simples
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              {[
                { num: 1, label: "Escolha o Quarto" },
                { num: 2, label: "Selecione as Datas" },
                { num: 3, label: "Dados Pessoais" },
              ].map((step, idx) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                        currentStep >= step.num
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {currentStep > step.num ? <Check className="h-5 w-5" /> : step.num}
                    </div>
                    <span className="text-xs mt-2 font-medium">{step.label}</span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={cn(
                        "w-20 h-1 mx-2 transition-all",
                        currentStep > step.num ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Room Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      Escolha seu Quarto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => {
                          setSelectedRoom(room.id);
                          setCurrentStep(Math.max(currentStep, 2));
                        }}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                          selectedRoom === room.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex gap-4">
                          <img
                            src={room.image}
                            alt={room.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{room.title}</h3>
                                <p className="text-sm text-muted-foreground">{room.description}</p>
                              </div>
                              {selectedRoom === room.id && (
                                <Badge className="bg-primary">Selecionado</Badge>
                              )}
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <i className="fas fa-user-friends"></i>
                                {room.capacity}
                              </span>
                              <span className="flex items-center gap-1">
                                <i className="fas fa-expand"></i>
                                {room.size}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {room.amenities.slice(0, 4).map((amenity) => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xl font-bold text-primary">
                              R$ {room.price}
                              <span className="text-sm font-normal text-muted-foreground">/noite</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Step 2: Date Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      Selecione as Datas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2 block">Data de Check-in</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkIn && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkIn ? format(checkIn, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkIn}
                              onSelect={(date) => {
                                setCheckIn(date);
                                setCurrentStep(Math.max(currentStep, 2));
                              }}
                              disabled={(date) => date < new Date() || isDateBlocked(date)}
                              initialFocus
                              className="pointer-events-auto"
                              modifiers={{ booked: blockedDates }}
                              modifiersClassNames={{
                                booked: "bg-destructive/20 text-destructive line-through",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="mb-2 block">Data de Check-out</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !checkOut && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkOut ? format(checkOut, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione a data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={checkOut}
                              onSelect={(date) => {
                                setCheckOut(date);
                                setCurrentStep(Math.max(currentStep, 2));
                              }}
                              disabled={(date) => !checkIn || date <= checkIn || isDateBlocked(date)}
                              initialFocus
                              className="pointer-events-auto"
                              modifiers={{ booked: blockedDates }}
                              modifiersClassNames={{
                                booked: "bg-destructive/20 text-destructive line-through",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {nights > 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Período selecionado</AlertTitle>
                        <AlertDescription>
                          {nights} {nights === 1 ? "noite" : "noites"} - de{" "}
                          {checkIn && format(checkIn, "dd/MM/yyyy")} até{" "}
                          {checkOut && format(checkOut, "dd/MM/yyyy")}
                        </AlertDescription>
                      </Alert>
                    )}

                    {availabilityError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{availabilityError}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <Label className="mb-2 block">Número de Hóspedes</Label>
                      <Select value={guests} onValueChange={(value) => {
                        setGuests(value);
                        setCurrentStep(Math.max(currentStep, 3));
                      }}>
                        <SelectTrigger>
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
                  </CardContent>
                </Card>

                {/* Step 3: Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      Suas Informações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Seu nome completo"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="seu@email.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="(00) 00000-0000"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Booking Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Resumo da Reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedRoomData ? (
                      <>
                        <div>
                          <img
                            src={selectedRoomData.image}
                            alt={selectedRoomData.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <h3 className="font-bold">{selectedRoomData.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedRoomData.capacity} • {selectedRoomData.size}
                          </p>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                          {checkIn && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Check-in:</span>
                              <span className="font-medium">
                                {format(checkIn, "dd/MM/yyyy")}
                              </span>
                            </div>
                          )}
                          {checkOut && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Check-out:</span>
                              <span className="font-medium">
                                {format(checkOut, "dd/MM/yyyy")}
                              </span>
                            </div>
                          )}
                          {nights > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Noites:</span>
                              <span className="font-medium">{nights}</span>
                            </div>
                          )}
                          {guests && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Hóspedes:</span>
                              <span className="font-medium">{guests}</span>
                            </div>
                          )}
                        </div>

                        {nights > 0 && (
                          <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                R$ {selectedRoomData.price} x {nights} noites
                              </span>
                              <span className="font-medium">
                                R$ {(selectedRoomData.price * nights).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2">
                              <span className="font-bold">Total:</span>
                              <span className="text-2xl font-bold text-primary">
                                R$ {calculateTotal().toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Selecione um quarto para ver o resumo
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-golden-dark text-primary-foreground"
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

                    <p className="text-xs text-muted-foreground text-center">
                      Ao confirmar, você concorda com nossos termos e políticas de cancelamento.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>

        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default Reservas;
