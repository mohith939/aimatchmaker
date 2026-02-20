import { z } from 'zod';
import { RecommendationResult } from './actions';

export const briefSchema = z.object({
  brand_name: z.string().min(2, 'Brand name must be at least 2 characters').max(80),
  industry_category: z.string({ required_error: 'Please select an industry.' }),
  objective: z.string({ required_error: 'Please select an objective.' }),
  primary_geography: z.array(z.object({
    state: z.string().min(1, 'State is required.'),
    city: z.string().optional(),
  })).min(1, 'Please select at least one geography.'),
  sport_preferences: z.array(z.string()).min(1, 'Please select at least one sport.'),
  target_audience: z.array(z.string()).min(1, 'Please select at least one audience.'),
  budget_range: z.string({ required_error: 'Please select a budget range.' }),
  timeline: z.object({
    from: z.date({ required_error: 'A start date is required.' }),
    to: z.date().optional(),
  }),
  deliverable_types: z.array(z.string()).min(1, 'Please select at least one deliverable.'),
  primary_contact: z.object({
    name: z.string().min(2, 'Name is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits.').max(15),
  }),
});

export type Brief = z.infer<typeof briefSchema>;

export type Asset = {
    type: 'Athlete' | 'League' | 'Venue';
    id: string;
    name: string;
    sport?: string;
    sports_supported?: string[];
    city: string;
    state: string;
    featured: boolean;
    image: string;
}

export type Athlete = Asset & {
  type: 'Athlete';
  sport: string;
  tier: string;
};

export type League = Asset & {
  type: 'League';
  sport: string;
  season: string;
};

export type Venue = Asset & {
  type: 'Venue';
  sports_supported: string[];
  venue_type: string;
};

export type Recommendation = Athlete | League | Venue;
