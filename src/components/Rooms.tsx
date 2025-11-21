import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCalendar } from "@/components/BookingCalendar";

const Rooms = () => {
  const rooms = [
    {
      image: "src\\assets\\gallery\\quarto-1.avif",
      badge: "MAIS POPULAR",
      title: "Quarto Standard",
      description:
        "Ideal para casais, com vista parcial para o mar e todas as comodidades necessárias para uma estadia confortável.",
      capacity: "2 pessoas",
      size: "25m²",
      oldPrice: "R$ 350",
      price: "R$ 280",
    },
    {
      image: "src\\assets\\gallery\\quarto-2.avif",
      title: "Suíte Premium",
      description:
        "Amplo espaço com varanda privativa, vista panorâmica para o mar e banheira de hidromassagem.",
      capacity: "2 pessoas",
      size: "40m²",
      price: "R$ 420",
    },
    {
      image: "src\\assets\\gallery\\geral 1.jpg",
      title: "Chalé Familiar",
      description:
        "Espaçoso chalé com dois quartos, ideal para famílias ou grupos pequenos, com cozinha equipada.",
      capacity: "4 pessoas",
      size: "60m²",
      price: "R$ 550",
    },
  ];

  return (
    <section id="rooms" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="title-font text-4xl font-bold text-foreground mb-4">
            Nossas Acomodações
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Conforto e charme em ambientes cuidadosamente decorados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-golden border-none"
            >
              <div className="relative">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-64 object-cover"
                />
                {room.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {room.badge}
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="title-font text-2xl font-bold text-foreground mb-2">
                  {room.title}
                </h3>
                <p className="text-muted-foreground mb-4">{room.description}</p>

                <div className="flex items-center mb-4 gap-4">
                  <div className="flex items-center text-primary">
                    <i className="fas fa-user-friends mr-1"></i>
                    <span className="text-sm">{room.capacity}</span>
                  </div>
                  <div className="flex items-center text-primary">
                    <i className="fas fa-expand mr-1"></i>
                    <span className="text-sm">{room.size}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex items-center justify-between">
                <div>
                  {room.oldPrice && (
                    <span className="text-muted-foreground line-through text-sm mr-2">
                      {room.oldPrice}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">
                    {room.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/noite</span>
                </div>
                <Button
                  asChild
                  className="bg-primary hover:bg-golden-dark text-primary-foreground rounded-full"
                >
                  <a href="#contact">Reservar</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <BookingCalendar />
          <p className="text-sm text-muted-foreground">ou</p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="font-bold rounded-full transform hover:scale-105 transition-all"
          >
            <a href="#contact" className="inline-flex items-center">
              Ver todas as opções
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Rooms;
