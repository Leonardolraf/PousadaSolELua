const WhatsAppButton = () => {
  return (
    <a
      href="https://api.whatsapp.com/send/?phone=5561995592120&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
      aria-label="Contato via WhatsApp"
    >
      <i className="fab fa-whatsapp text-2xl"></i>
    </a>
  );
};

export default WhatsAppButton;
