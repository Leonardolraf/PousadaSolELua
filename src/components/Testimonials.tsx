import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Star, Loader2, PenSquare } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import { useAuth } from "@/hooks/useAuth";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  bookings: {
    guest_name: string;
    room_title: string;
  };
}

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock reviews
  const mockReviews = [
    {
      id: 'mock-1',
      rating: 5,
      comment: 'Lugar perfeito para relaxar! A vista para o mar é deslumbrante e o atendimento foi excepcional. Voltaremos com certeza!',
      bookings: {
        guest_name: 'Maria Silva',
        room_title: 'Suíte Premium'
      },
      created_at: '2024-01-15T10:00:00'
    },
    {
      id: 'mock-2',
      rating: 5,
      comment: 'Experiência maravilhosa! O café da manhã estava delicioso e os quartos muito limpos e confortáveis.',
      bookings: {
        guest_name: 'João Santos',
        room_title: 'Quarto Standard'
      },
      created_at: '2024-01-20T14:30:00'
    },
    {
      id: 'mock-3',
      rating: 4,
      comment: 'Ótima localização e ambiente acolhedor. Perfeito para famílias!',
      bookings: {
        guest_name: 'Ana Costa',
        room_title: 'Chalé Familiar'
      },
      created_at: '2024-02-05T16:45:00'
    },
    {
      id: 'mock-4',
      rating: 5,
      comment: 'Superou todas as expectativas! A pousada é linda e a equipe muito atenciosa.',
      bookings: {
        guest_name: 'Pedro Oliveira',
        room_title: 'Suíte Premium'
      },
      created_at: '2024-02-10T09:20:00'
    },
    {
      id: 'mock-5',
      rating: 5,
      comment: 'Lugar tranquilo e romântico, ideal para casais. Adoramos cada momento!',
      bookings: {
        guest_name: 'Carla Mendes',
        room_title: 'Quarto Standard'
      },
      created_at: '2024-02-18T11:15:00'
    },
    {
      id: 'mock-6',
      rating: 4,
      comment: 'Muito bem localizado e com excelente estrutura. Recomendo!',
      bookings: {
        guest_name: 'Roberto Almeida',
        room_title: 'Chalé Familiar'
      },
      created_at: '2024-02-25T15:00:00'
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          bookings (
            guest_name,
            room_title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/profile?scrollTo=bookings');
    }
  };

  const allReviews = [...reviews, ...mockReviews];
  const displayedReviews = showAll ? allReviews : allReviews.slice(0, 6);

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="title-font text-4xl font-bold mb-4">
            O que dizem nossos hóspedes
          </h2>
          <p className="text-lg opacity-90">
            Confira as experiências de quem já se hospedou conosco
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedReviews.map((review) => (
                <div key={review.id} className="bg-background rounded-lg">
                  <ReviewCard
                    rating={review.rating}
                    comment={review.comment}
                    guestName={review.bookings.guest_name}
                    roomTitle={review.bookings.room_title}
                    createdAt={review.created_at}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-4 mt-12">
              {allReviews.length > 6 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(!showAll)}
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  {showAll ? 'Ver Menos' : 'Ver Mais Avaliações'}
                </Button>
              )}
              
              <Button
                size="lg"
                onClick={handleReviewClick}
                className="bg-background text-foreground hover:bg-background/90 gap-2"
              >
                <PenSquare className="w-5 h-5" />
                Faça sua Avaliação
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
