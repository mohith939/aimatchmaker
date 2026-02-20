import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Brief, Recommendation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Shield, Building, Star } from 'lucide-react';
import AiExplanation from "./AiExplanation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  item: Recommendation & { matchScore: number };
  brief: Brief;
  isShortlisted: boolean;
  onShortlistToggle: (id: string) => void;
}

const getIcon = (type: Recommendation['type']) => {
    switch (type) {
        case 'Athlete': return <Trophy className="h-3 w-3" />;
        case 'League': return <Shield className="h-3 w-3" />;
        case 'Venue': return <Building className="h-3 w-3" />;
    }
}

export default function RecommendationCard({ item, brief, isShortlisted, onShortlistToggle }: RecommendationCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === item.image);

  return (
    <Card className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-primary border">
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
        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-bold border-2 border-background">
            {item.matchScore}% Match
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
            <h3 className="font-bold font-headline text-lg mb-1 leading-tight pr-2">{item.name}</h3>
            {'tier' in item && <Badge variant="secondary" className="shrink-0">{item.tier}</Badge>}
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
       <CardFooter className="bg-muted/40 p-2 flex justify-between items-center">
         <AiExplanation brief={brief} recommendation={item} />
         <Button
            variant={isShortlisted ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onShortlistToggle(item.id);
            }}
            className="h-8"
          >
            <Star className={cn("h-4 w-4 mr-2", isShortlisted && "fill-amber-400 text-amber-500")} />
            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
          </Button>
      </CardFooter>
    </Card>
  );
}
