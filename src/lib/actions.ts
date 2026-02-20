'use server';

import { Brief, Athlete, League, Venue } from '@/lib/types';
import { athletes, leagues, venues } from '@/lib/data';

export type RecommendationResult = {
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

export async function generateRecommendations(brief: Brief): Promise<RecommendationResult> {
    // In a real app, you would save the brief to a database and create a lead.
    const briefId = `brf_${Date.now()}`;
    console.log(`Lead created for brief ${briefId}:`, brief.primary_contact.email);

    const briefSports = new Set(brief.sport_preferences);
    const briefStates = new Set(brief.primary_geography.map((g) => g.state));
    const briefCities = new Set(
        brief.primary_geography.map((g) => g.city).filter(Boolean)
    );

    const scoreAsset = <
        T extends {
        sport?: string;
        sports_supported?: string[];
        state: string;
        city: string;
        featured: boolean;
        type: string;
        }
    >(
        asset: T
    ): T & { matchScore: number } => {
        let sportMatch = 0;
        const assetSports = asset.type === 'Venue' ? asset.sports_supported || [] : [asset.sport || ''];
        for (const sport of assetSports) {
            if (briefSports.has(sport)) {
                sportMatch = 1.0;
                break;
            }
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