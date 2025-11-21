import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewCardProps {
  rating: number;
  comment: string;
  guestName: string;
  roomTitle: string;
  createdAt: string;
}

export const ReviewCard = ({ rating, comment, guestName, roomTitle, createdAt }: ReviewCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-foreground">{guestName}</p>
            <p className="text-sm text-muted-foreground">{roomTitle}</p>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-muted-foreground mb-2">{comment}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </CardContent>
    </Card>
  );
};
