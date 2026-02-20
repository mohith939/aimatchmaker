import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Brief, Recommendation } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Shield, Building } from 'lucide-react';
import AiExplanation from "./AiExplanation";

interface RecommendationCardProps {
  item: Recommendation & { matchScore: number };
  brief: Brief;
}

const getIcon = (type: Recommendation['type']) => {
    switch (type) {
        case 'Athlete': return <Trophy className="h-3 w-3" />;
        case 'League': return <Shield className="h-3 w-3" />;
        case 'Venue': return <Building className="h-3 w-3" />;
    }
}

export default function RecommendationCard({ item, brief }: RecommendationCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === item.image);

  return (
    <Card className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        {placeholder ? (
          <Image
            src={placeholder.imageUrl}
            alt={item.name}
            width={600}
            height={400}
            className="w-full h-40 object-cover"
            data-ai-hint={placeholder.imageHint}
          />
        ) : (
          <div className="h-40 w-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
        <Badge variant="destructive" className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm">
            {item.matchScore}% Match
        </Badge>
         <AiExplanation brief={brief} recommendation={item} className="absolute top-1 left-1" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
            <h3 className="font-bold font-headline text-lg mb-1 leading-tight">{item.name}</h3>
            {'tier' in item && <Badge variant="outline">{item.tier}</Badge>}
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <span>{'sport' in item ? item.sport : item.venue_type}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{item.city}, {item.state}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
