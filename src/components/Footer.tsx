import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const quickLinks = [
    { href: "/", label: "Início" },
    { href: "/#about", label: "Sobre" },
    { href: "/acomodacoes", label: "Acomodações" },
    { href: "/galeria", label: "Galeria" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="title-font text-xl font-bold mb-4">Pousada Sol & Lua</h3>
            <p className="text-gray-400">
              Um refúgio encantador entre o sol e o mar em Ilhéus, Bahia. Hospedagem
              aconchegante com o calor da hospitalidade baiana.
            </p>
          </div>

          <div>
            <h4 className="title-font text-lg font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="title-font text-lg font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-primary"></i>
                <span>RESIDENCIAL NOSSA CABANA, Rodovia Ilhéus/Itacaré, Ilhéus - BA, 46000-000</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2 text-primary"></i>
                <span>(61) 9 9559-2120</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Pousada Sol & Lua. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm mr-2">Siga-nos:</span>
            <a
              href="https://www.instagram.com/soleluapousada/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-primary hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=5561995592120&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-primary hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all"
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
