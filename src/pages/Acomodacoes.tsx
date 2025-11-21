import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Rooms from "@/components/Rooms";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/hooks/useAuth";

const Acomodacoes = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, loading, navigate]);

  if (loading || isAdmin) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navigation />
        <Breadcrumbs />
        <div className="pt-8">
          <Rooms />
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default Acomodacoes;
