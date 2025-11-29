import fachada from "@/assets/gallery/fachada.jpg";
import palmeiras from "@/assets/gallery/quarto-4.jpg";
import quarto1 from "@/assets/gallery/quarto-1.avif";
import quarto2 from "@/assets/gallery/quarto-2.avif";
import quarto3 from "@/assets/gallery/quarto-3.avif";
import banheiro from "@/assets/gallery/cafe-da-manha.jpg";

const Gallery = () => {
  const images = [
    {
      src: fachada,
      alt: "Fachada da Pousada",
    },
    {
      src: palmeiras,
      alt: "Palmeiras",
    },
    {
      src: quarto1,
      alt: "Quarto 1",
    },
    {
      src: quarto2,
      alt: "Quarto 2",
    },
    {
      src: quarto3,
      alt: "Quarto 3",
    },
    {
      src: banheiro,
      alt: "Banheiro",
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="title-font text-4xl font-bold text-foreground mb-4">
            Galeria
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Conheça os encantos da Pousada Sol & Lua
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-golden cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
