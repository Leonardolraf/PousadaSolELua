import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1, "Selecione uma avaliação").max(5),
  comment: z.string()
    .trim()
    .min(10, "O comentário deve ter pelo menos 10 caracteres")
    .max(500, "O comentário deve ter no máximo 500 caracteres")
});

interface ReviewFormProps {
  bookingId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ReviewForm = ({ bookingId, onSuccess, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const validation = reviewSchema.safeParse({ rating, comment });
    
    if (!validation.success) {
      const fieldErrors: { rating?: string; comment?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === 'rating') fieldErrors.rating = err.message;
        if (err.path[0] === 'comment') fieldErrors.comment = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para avaliar");
        return;
      }

      const { error } = await supabase.from("reviews").insert({
        booking_id: bookingId,
        user_id: user.id,
        rating: validation.data.rating,
        comment: validation.data.comment,
      });

      if (error) throw error;

      toast.success("Avaliação enviada com sucesso!");
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      if (error.message.includes("duplicate")) {
        toast.error("Você já avaliou esta reserva");
      } else if (error.message.includes("violates")) {
        toast.error("Você só pode avaliar reservas confirmadas após o check-out");
      } else {
        toast.error("Erro ao enviar avaliação");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Avaliação *</Label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  (hoveredRating || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-sm text-destructive mt-1">{errors.rating}</p>
        )}
      </div>

      <div>
        <Label htmlFor="comment">Comentário *</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte-nos sobre sua experiência..."
          className="mt-2 min-h-[120px]"
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.comment && (
            <p className="text-sm text-destructive">{errors.comment}</p>
          )}
          <p className="text-xs text-muted-foreground ml-auto">
            {comment.length}/500
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </div>
    </form>
  );
};
