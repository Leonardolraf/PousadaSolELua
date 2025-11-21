import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Parallax from "@/components/Parallax";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Map from "@/components/Map";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
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
        <Hero />
        <About />
        <Parallax />
        <Services />
        <Testimonials />
        <FAQ />
        <Map />
        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default Index;
