'use server';

import { redirect } from 'next/navigation';
import { Brief, Athlete, League, Venue } from '@/lib/types';
import { athletes, leagues, venues } from '@/lib/data';

// In a real app, this would be stored in a database.
// For this example, we'll just use it to pass data between server actions.
let submittedBrief: Brief | null = null;

export async function submitBrief(brief: Brief) {
  const briefId = `brf_${Date.now()}`;
  submittedBrief = brief;

  // In a real app, you would save the brief to a database and create a lead.
  console.log(`Lead created for brief ${briefId}:`, brief.primary_contact.email);
  
  // We are not passing the brief in the URL anymore to keep it clean,
  // since we have a temporary server-side "store" (submittedBrief).
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
    'Awareness': { 'Athlete': 0.8, 'League': 1.0, 'Venue': 0.9 },
    'Consideration': { 'Athlete': 1.0, 'League': 0.8, 'Venue': 0.7 },
    'Conversions': { 'Athlete': 1.0, 'League': 0.6, 'Venue': 0.5 },
    'App Installs': { 'Athlete': 1.0, 'League': 0.7, 'Venue': 0.4 },
    'Footfall': { 'Athlete': 0.7, 'League': 0.9, 'Venue': 1.0 },
    'Trials': { 'Athlete': 1.0, 'League': 0.6, 'Venue': 0.8 },
};

export async function getRecommendations(
  briefId: string
): Promise<RecommendationResult> {
  if (!submittedBrief) {
    // This would be a DB lookup in a real app
    throw new Error('Brief not found. Please submit a new brief.');
  }

  const brief = submittedBrief;
  const briefSports = new Set(brief.sport_preferences);
  const briefStates = new Set(brief.primary_geography.map(g => g.state));
  const briefCities = new Set(brief.primary_geography.map(g => g.city).filter(Boolean));

  const scoreAsset = <T extends { sport: string; state: string; city: string; featured: boolean; type: string }>(asset: T): T & { matchScore: number } => {
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

    const score = 100 * (
      WEIGHTS.sport * sportMatch +
      WEIGHTS.geo * geoMatch +
      WEIGHTS.objective * objectiveFit +
      WEIGHTS.featured * featuredBoost
    );
    
    return { ...asset, matchScore: parseFloat(score.toFixed(1)) };
  };

  const scoredAthletes = athletes
    .map(scoreAsset)
    .filter(a => a.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 20);

  const scoredLeagues = leagues
    .map(scoreAsset)
    .filter(l => l.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
    
  const scoredVenues = venues
    .map(v => ({...v, sport: v.sports_supported[0] || ''})) // simplification for scoring
    .map(scoreAsset)
    .filter(v => v.matchScore > 10)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  return {
    brief,
    athletes: scoredAthletes,
    leagues: scoredLeagues,
    venues: scoredVenues,
  };
}
