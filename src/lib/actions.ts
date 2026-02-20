'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Brief, Athlete, League, Venue } from '@/lib/types';
import { athletes, leagues, venues } from '@/lib/data';

export async function submitBrief(brief: Brief) {
  const briefId = `brf_${Date.now()}`;

  // In a real app, you would save the brief to a database and create a lead.
  console.log(`Lead created for brief ${briefId}:`, brief.primary_contact.email);

  // Create a smaller object with only the data needed for recommendations
  // to avoid exceeding cookie size limits.
  const relevantBriefData = {
    brand_name: brief.brand_name,
    objective: brief.objective,
    sport_preferences: brief.sport_preferences,
    primary_geography: brief.primary_geography,
    primary_contact: {
      email: brief.primary_contact.email,
    },
  };

  cookies().set('brief-data', JSON.stringify(relevantBriefData), {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 5, // 5 minutes validity
  });

  redirect(`/recommendations/${briefId}`);
}

type RecommendationResult = {
  brief: Brief;
  athletes: (Athlete & { matchScore: number })[];
  leagues: (League & { matchScore: number })[];
  venues: (Venue & { matchScore: number })[];
};

const WEIGHTS = {
  sport: 0.4,
  geo: 0.3,
  objective: 0.2,
  featured: 0.1,
};

// Heuristic mapping of objectives to asset types
const OBJECTIVE_FIT_MAP: Record<string, Record<string, number>> = {
  Awareness: { Athlete: 0.8, League: 1.0, Venue: 0.9 },
  Consideration: { Athlete: 1.0, League: 0.8, Venue: 0.7 },
  Conversions: { Athlete: 1.0, League: 0.6, Venue: 0.5 },
  'App Installs': { Athlete: 1.0, League: 0.7, Venue: 0.4 },
  Footfall: { Athlete: 0.7, League: 0.9, Venue: 1.0 },
  Trials: { Athlete: 1.0, League: 0.6, Venue: 0.8 },
};

export async function getRecommendations(
  briefId: string
): Promise<RecommendationResult> {
  const cookieStore = cookies();
  const briefCookie = cookieStore.get('brief-data');

  if (!briefCookie?.value) {
    // This would be a DB lookup in a real app
    throw new Error('Brief not found. Please submit a new brief.');
  }
  
  const partialBrief = JSON.parse(briefCookie.value);

  // Reconstruct a full brief object to satisfy the downstream types.
  // The missing fields are not used in the recommendations page.
  const brief: Brief = {
    ...partialBrief,
    industry_category: '',
    target_audience: [],
    budget_range: '',
    timeline: { from: new Date(), to: undefined },
    deliverable_types: [],
    primary_contact: {
      name: '',
      email: partialBrief.primary_contact.email,
      phone: '',
    }
  };

  const briefSports = new Set(brief.sport_preferences);
  const briefStates = new Set(brief.primary_geography.map((g) => g.state));
  const briefCities = new Set(
    brief.primary_geography.map((g) => g.city).filter(Boolean)
  );

  const scoreAsset = <
    T extends {
      sport: string;
      state: string;
      city: string;
      featured: boolean;
      type: string;
    }
  >(
    asset: T
  ): T & { matchScore: number } => {
    let sportMatch = 0;
    if (briefSports.has(asset.sport)) {
      sportMatch = 1.0;
    }

    let geoMatch = 0;
    if (asset.city && briefCities.has(asset.city)) {
      geoMatch = 1.0;
    } else if (briefStates.has(asset.state)) {
      geoMatch = 0.7;
    }

    const objectiveFit = OBJECTIVE_FIT_MAP[brief.objective]?.[asset.type] ?? 0.5;

    const featuredBoost = asset.featured ? 1.0 : 0;

    const score =
      100 *
      (WEIGHTS.sport * sportMatch +
        WEIGHTS.geo * geoMatch +
        WEIGHTS.objective * objectiveFit +
        WEIGHTS.featured * featuredBoost);

    return { ...asset, matchScore: parseFloat(score.toFixed(1)) };
  };

  const scoredAthletes = athletes
    .map(scoreAsset)
    .filter((a) => a.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 20);

  const scoredLeagues = leagues
    .map(scoreAsset)
    .filter((l) => l.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  const scoredVenues = venues
    .map((v) => ({ ...v, sport: v.sports_supported[0] || '' })) // simplification for scoring
    .map(scoreAsset)
    .filter((v) => v.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  return {
    brief,
    athletes: scoredAthletes,
    leagues: scoredLeagues,
    venues: scoredVenues,
  };
}
