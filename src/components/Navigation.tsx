import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navLinks = [
    { href: "/", label: "Início", isRoute: true },
    { href: "/#about", label: "Sobre", isRoute: false },
    { href: "/acomodacoes", label: "Acomodações", isRoute: true },
    { href: "/galeria", label: "Galeria", isRoute: true },
    { href: "/#services", label: "Serviços", isRoute: false },
    { href: "/reservas", label: "Reservas", isRoute: true },
    { href: "/contato", label: "Contato", isRoute: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.substring(2); // Remove /# from href
    
    // If not on home page, navigate to home first
    if (location.pathname !== "/") {
      window.location.href = href;
      return;
    }
    
    // If on home page, smooth scroll to section
    e.preventDefault();
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  // Don't show navigation for admin users
  if (isAdmin) {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled ? "bg-background shadow-md" : "bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold title-font text-primary group-hover:text-golden transition-colors">
                Sol & Lua
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300",
                    "hover:text-primary hover:after:w-full",
                    isActive(link.href)
                      ? "text-primary after:w-full"
                      : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.href)}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300",
                    "hover:text-primary hover:after:w-full",
                    "text-foreground"
                  )}
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          <AuthButton />

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden bg-background shadow-lg transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-accent"
                    : "text-foreground hover:text-primary hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors text-foreground hover:text-primary hover:bg-secondary"
                )}
              >
                {link.label}
              </a>
            )
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
