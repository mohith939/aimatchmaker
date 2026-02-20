'use client';

import { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { explainRecommendation, RecommendationExplanationInput } from '@/ai/flows/ai-recommendation-explanation-flow';
import { Brief, Recommendation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AiExplanationProps {
  brief: Brief;
  recommendation: Recommendation & { matchScore: number };
  className?: string;
}

// Helper to transform brief and recommendation data into the format expected by the AI flow
function transformForAI(brief: Brief, recommendation: Recommendation): RecommendationExplanationInput {
    
    const asset = {
        type: recommendation.type,
        id: recommendation.id,
        name: recommendation.name,
        sport: 'sport' in recommendation ? recommendation.sport : undefined,
        sports_supported: 'sports_supported' in recommendation ? recommendation.sports_supported : undefined,
        city: recommendation.city,
        state: recommendation.state,
        tier: 'tier' in recommendation ? recommendation.tier : undefined,
        season: 'season' in recommendation ? recommendation.season : undefined,
        venue_type: 'venue_type' in recommendation ? recommendation.venue_type : undefined,
    }

    // This is a hack because discriminatedUnion is not working as expected with the schema.
    const recommendationPayload: any = asset
    if (asset.type === 'Athlete') {
        delete recommendationPayload.sports_supported;
        delete recommendationPayload.season;
        delete recommendationPayload.venue_type;
    } else if (asset.type === 'League') {
        delete recommendationPayload.sports_supported;
        delete recommendationPayload.tier;
        delete recommendationPayload.venue_type;
    } else if (asset.type === 'Venue') {
        delete recommendationPayload.sport;
        delete recommendationPayload.tier;
        delete recommendationPayload.season;
    }

    return {
        brief: {
            sport_preferences: brief.sport_preferences,
            primary_geography: brief.primary_geography,
            objective: brief.objective as any, // Cast as the enum is strict
        },
        recommendation: recommendationPayload,
    };
}


export default function AiExplanation({ brief, recommendation, className }: AiExplanationProps) {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateExplanation = async () => {
    if (explanation) return; // Don't re-generate
    setIsLoading(true);
    setError('');
    try {
        const aiInput = transformForAI(brief, recommendation);
        const result = await explainRecommendation(aiInput);
        setExplanation(result.explanation);
    } catch (err) {
      console.error('Error generating explanation:', err);
      setError('Could not generate explanation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover onOpenChange={(open) => open && generateExplanation()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-accent hover:bg-accent/10", className)}>
          <BrainCircuit className="h-5 w-5" />
          <span className="sr-only">Why this match?</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none font-headline">Why it's a match</h4>
            <p className="text-sm text-muted-foreground">
              AI-powered analysis based on your brief.
            </p>
          </div>
          <div className="text-sm">
            {isLoading && <Skeleton className="h-12 w-full" />}
            {error && <p className="text-destructive">{error}</p>}
            {explanation && <p>{explanation}</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
