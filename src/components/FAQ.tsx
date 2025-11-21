import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Qual o horário de check-in e check-out?",
      answer:
        "O check-in é realizado a partir das 14h e o check-out até às 12h. Caso necessite de horários diferenciados, entre em contato conosco para verificarmos a disponibilidade.",
    },
    {
      question: "A pousada aceita animais de estimação?",
      answer:
        "Sim! Aceitamos pets de pequeno e médio porte. É necessário informar na reserva e há uma taxa adicional de limpeza. Os pets devem estar com vacinas em dia e ter comportamento tranquilo.",
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer:
        "Aceitamos pagamento em dinheiro, cartões de crédito (Visa, Mastercard, Elo) e débito. Para reservas antecipadas, também aceitamos transferência bancária e PIX.",
    },
    {
      question: "O café da manhã está incluso na diária?",
      answer:
        "Sim! Todas as nossas diárias incluem café da manhã completo com frutas frescas, pães, bolos, sucos naturais, café e chá, além de opções regionais.",
    },
    {
      question: "Qual a política de cancelamento?",
      answer:
        "Cancelamentos gratuitos podem ser feitos até 48 horas antes da data de check-in. Para cancelamentos com menos de 48 horas de antecedência, será cobrada uma diária. Em feriados e alta temporada, a política pode ser diferente.",
    },
    {
      question: "A pousada oferece estacionamento?",
      answer:
        "Sim, oferecemos estacionamento gratuito e coberto para todos os hóspedes. O espaço é limitado, portanto recomendamos informar na reserva caso vá de carro.",
    },
    {
      question: "Há cobertura de Wi-Fi em todo o estabelecimento?",
      answer:
        "Sim, disponibilizamos Wi-Fi gratuito de alta velocidade em todas as áreas da pousada, incluindo quartos, áreas comuns e espaços externos.",
    },
    {
      question: "Quais as principais atrações próximas à pousada?",
      answer:
        "Estamos próximos às praias mais bonitas de Ilhéus, do centro histórico, da Casa de Jorge Amado e do Bataclan. A distância até o aeroporto é de aproximadamente 5km.",
    },
    {
      question: "É possível fazer reserva apenas para o café da manhã sem hospedagem?",
      answer:
        "Não, o café da manhã é exclusivo para hóspedes. No entanto, temos parcerias com restaurantes locais que podemos recomendar.",
    },
    {
      question: "As acomodações têm ar-condicionado?",
      answer:
        "Sim, todos os nossos quartos são equipados com ar-condicionado, além de ventilador de teto para maior conforto dos hóspedes.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="title-font text-4xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre hospedagem, reservas e serviços
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className="font-semibold text-foreground">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
