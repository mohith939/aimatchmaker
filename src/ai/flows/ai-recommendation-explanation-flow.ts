'use server';
/**
 * @fileOverview This file provides a Genkit flow to generate AI-driven explanations for recommended
 * athletes, leagues, or venues, detailing their relevance to a brand's campaign brief.
 *
 * - explainRecommendation - A function that handles the generation of the explanation.
 * - RecommendationExplanationInput - The input type for the explainRecommendation function.
 * - RecommendationExplanationOutput - The return type for the explainRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BriefDetailsSchema = z.object({
  sport_preferences: z.array(z.string()).describe('The sport preferences from the brand brief.'),
  primary_geography: z.array(z.object({
    state: z.string(),
    city: z.string().optional(),
  })).describe('The primary geographies from the brand brief.'),
  objective: z.enum(['Awareness', 'Consideration', 'Conversions', 'App Installs', 'Footfall', 'Trials']).describe('The objective from the brand brief.'),
}).describe('The original brand brief details.');

const RecommendedAthleteSchema = z.object({
  type: z.literal('Athlete'),
  id: z.string().describe('Unique ID of the recommended athlete.'),
  name: z.string().describe('Name of the recommended athlete.'),
  sport: z.string().describe('Primary sport of the athlete.'),
  city: z.string().optional().describe('City of the athlete.'),
  state: z.string().describe('State of the athlete.'),
  tier: z.string().optional().describe('Tier of the athlete (e.g., MICRO, CELEBRITY).'),
}).describe('Details of a recommended athlete.');

const RecommendedLeagueSchema = z.object({
  type: z.literal('League'),
  id: z.string().describe('Unique ID of the recommended league.'),
  name: z.string().describe('Name of the recommended league.'),
  sport: z.string().describe('Primary sport of the league.'),
  city: z.string().optional().describe('City of the league.'),
  state: z.string().describe('State of the league.'),
  season: z.string().optional().describe('Season or month of the league.'),
}).describe('Details of a recommended league.');

const RecommendedVenueSchema = z.object({
  type: z.literal('Venue'),
  id: z.string().describe('Unique ID of the recommended venue.'),
  name: z.string().describe('Name of the recommended venue.'),
  venue_type: z.string().describe('Type of the venue (e.g., INDOOR_COURT, STADIUM).'),
  sports_supported: z.array(z.string()).describe('List of sports supported by the venue.'),
  city: z.string().optional().describe('City of the venue.'),
  state: z.string().describe('State of the venue.'),
}).describe('Details of a recommended venue.');

const RecommendedAssetSchema = z.discriminatedUnion('type', [
  RecommendedAthleteSchema,
  RecommendedLeagueSchema,
  RecommendedVenueSchema,
]);

const RecommendationExplanationInputSchema = z.object({
  brief: BriefDetailsSchema,
  recommendation: RecommendedAssetSchema,
});
export type RecommendationExplanationInput = z.infer<typeof RecommendationExplanationInputSchema>;

const RecommendationExplanationOutputSchema = z.object({
  explanation: z.string().describe('A concise AI-generated explanation detailing why the recommendation is relevant.'),
});
export type RecommendationExplanationOutput = z.infer<typeof RecommendationExplanationOutputSchema>;

export async function explainRecommendation(input: RecommendationExplanationInput): Promise<RecommendationExplanationOutput> {
  return recommendationExplanationFlow(input);
}

const recommendationExplanationPrompt = ai.definePrompt({
  name: 'recommendationExplanationPrompt',
  input: { schema: RecommendationExplanationInputSchema },
  output: { schema: RecommendationExplanationOutputSchema },
  prompt: `You are an expert sports marketing strategist. Your task is to provide a concise explanation for why a specific recommended {{recommendation.type}} is relevant to a brand's campaign brief. Focus on connections related to sport, geography, and campaign objective.

Brand Brief Details:
- Desired Sports: {{#each brief.sport_preferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Target Geographies: {{#each brief.primary_geography}}{{#if this.city}}{{{this.city}}}, {{{this.state}}}{{else}}{{{this.state}}}{{/if}}{{#unless @last}}; {{/unless}}{{/each}}
- Campaign Objective: {{{brief.objective}}}

Recommended {{recommendation.type}} Details:
- Name: {{{recommendation.name}}}
- Type: {{{recommendation.type}}}
{{#if (eq recommendation.type "Athlete")}}- Sport: {{{recommendation.sport}}}{{/if}}
{{#if (eq recommendation.type "League")}}- Sport: {{{recommendation.sport}}}{{/if}}
{{#if (eq recommendation.type "Venue")}}- Supported Sports: {{#each recommendation.sports_supported}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
- Location: {{#if recommendation.city}}{{{recommendation.city}}}, {{/if}}{{{recommendation.state}}}
{{#if (eq recommendation.type "Athlete")}}{{#if recommendation.tier}}- Tier: {{{recommendation.tier}}}{{/if}}{{/if}}
{{#if (eq recommendation.type "Venue")}}{{#if recommendation.venue_type}}- Venue Type: {{{recommendation.venue_type}}}{{/if}}{{/if}}

Explain in 1-2 sentences how this recommended {{recommendation.type}} aligns with the brief's sports, geography, and objective.`,
});

const recommendationExplanationFlow = ai.defineFlow(
  {
    name: 'recommendationExplanationFlow',
    inputSchema: RecommendationExplanationInputSchema,
    outputSchema: RecommendationExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await recommendationExplanationPrompt(input);
    return output!;
  },
);
