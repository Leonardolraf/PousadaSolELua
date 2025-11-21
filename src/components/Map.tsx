const Map = () => {
  return (
    <div className="h-96 w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.925401643345!2d-39.04606802401017!3d-14.546258485933706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x73915b339988b7f%3A0x6bd20012d9abc997!2sRESIDENCIAL%20NOSSA%20CABANA!5e0!3m2!1spt-BR!2sbr!4v1757027125230!5m2!1spt-BR!2sbr"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização da Pousada Sol & Lua"
      ></iframe>
    </div>
  );
};

export default Map;
