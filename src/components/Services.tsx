const Services = () => {
  const services = [
    {
      icon: "fa-concierge-bell",
      title: "Recepção 24h",
      description:
        "Nossa equipe está disponível a qualquer momento para atender suas necessidades.",
    },
    {
      icon: "fa-car",
      title: "Estacionamento",
      description: "Área privativa e segura para seu veículo durante toda a estadia.",
    },
    {
      icon: "fa-utensils",
      title: "Café da Manhã",
      description:
        "Delicioso buffet com frutas tropicais, pães frescos e especialidades baianas.",
    },
    {
      icon: "fa-bicycle",
      title: "Passeios",
      description:
        "Organizamos excursões para os principais pontos turísticos de Ilhéus.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="title-font text-4xl font-bold text-foreground mb-4">
            Nossos Serviços
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para uma estadia perfeita
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-xl p-8 text-center hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className={`fas ${service.icon} text-primary text-2xl`}></i>
              </div>
              <h3 className="title-font text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
