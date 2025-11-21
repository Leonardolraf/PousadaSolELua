import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pousada.jpg";

const Hero = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${heroImage}')`,
      }}
    >
      <div className="text-center px-4 animate-fadeIn text-white">
        <h1 className="title-font text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          Pousada Sol & Lua
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
          Um refúgio encantador entre o sol e o mar em Ilhéus, Bahia
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-golden-dark text-primary-foreground font-bold rounded-full transform hover:scale-105 transition-all shadow-golden"
          >
            <a href="/acomodacoes">
              Nossas Acomodações
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent hover:bg-background hover:text-foreground text-white border-2 border-white rounded-full transform hover:scale-105 transition-all"
          >
            <a href="/contato">
              Faça sua Reserva
            </a>
          </Button>
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => handleScroll(e, "about")}
        className="absolute bottom-10 left-0 right-0 flex justify-center text-white animate-bounce cursor-pointer"
        aria-label="Scroll to about section"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </a>
    </section>
  );
};

export default Hero;
