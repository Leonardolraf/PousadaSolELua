import { Button } from "@/components/ui/button";

const Parallax = () => {
  return (
    <section
      className="parallax-fixed py-32 text-white bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://pousada-sol-e-lua-45930-000.bahiatophotels.com/data/Images/OriginalPhoto/10832/1083239/1083239026/image-mucuri-pousada-e-restaurante-sol-e-lua-3.JPEG')",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="title-font text-4xl font-bold mb-6 drop-shadow-lg">
          Descubra a Magia de Ilhéus
        </h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md">
          Entre praias paradisíacas, cultura rica e gastronomia inesquecível, sua
          estadia na Pousada Sol & Lua será memorável
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-golden-dark text-primary-foreground font-bold rounded-full transform hover:scale-105 transition-all shadow-golden"
        >
          <a href="/reservas">Reserve Agora</a>
        </Button>
      </div>
    </section>
  );
};

export default Parallax;
