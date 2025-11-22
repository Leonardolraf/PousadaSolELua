import aboutImage from "@/assets/about-pousada.jpg";

const About = () => {
  const features = [
    {
      icon: "fa-umbrella-beach",
      title: "Acesso à Praia",
      description: "Apenas 50 metros da areia",
    },
    {
      icon: "fa-swimming-pool",
      title: "Piscina",
      description: "Área de lazer com vista para o mar",
    },
    {
      icon: "fa-utensils",
      title: "Café da Manhã",
      description: "Delícias da culinária baiana",
    },
    {
      icon: "fa-wifi",
      title: "Wi-Fi Grátis",
      description: "Em todas as áreas da pousada",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="title-font text-4xl font-bold text-foreground mb-4">
            Sobre a Pousada Sol & Lua
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Um oásis de tranquilidade à beira-mar na encantadora cidade de Ilhéus
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative rounded-xl overflow-hidden shadow-soft">
              <img
                src={aboutImage}
                alt="Pousada Sol & Lua"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="title-font text-2xl font-bold">Desde 1995</h3>
                <p>Recebendo hóspedes com carinho baiano</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="title-font text-3xl font-bold text-foreground mb-6">
              Bem-vindo ao paraíso
            </h3>
            <p className="text-muted-foreground mb-6">
              Localizada em uma das praias mais belas de Ilhéus, a Pousada Sol & Lua
              combina o charme da arquitetura colonial com o conforto moderno,
              oferecendo uma experiência única de hospedagem na Bahia.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-accent p-3 rounded-full mr-4 flex-shrink-0">
                    <i className={`fas ${feature.icon} text-primary text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/galeria"
              className="inline-flex items-center text-primary font-medium hover:text-golden-dark transition-colors"
            >
              Ver nossa galeria
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
