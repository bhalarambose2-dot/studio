'use server';

/**
 * @fileOverview Generates a personalized trip itinerary based on user preferences.
 *
 * - generateItinerary - A function that generates a trip itinerary.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  destination: z.string().describe('The destination of the trip.'),
  dates: z.string().describe('The dates of the trip (e.g., MM/DD/YYYY-MM/DD/YYYY).'),
  interests: z.string().describe('The interests of the traveler (e.g., history, food, adventure).'),
  budget: z.string().describe('The budget for the trip (e.g., low, medium, high).'),
});

export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed trip itinerary based on the user preferences.'),
});

export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are an elite Indian travel designer known for crafting "Experience of a Lifetime" trips. 
Create a comprehensive, day-by-day itinerary for the following destination. 

For each day, include:
- Morning, Afternoon, and Evening activities.
- A "Must-Try Local Dish" or "Recommended Restaurant" (focus on authentic Indian cuisine if applicable).
- A "Pro Tip" for navigating the local area, cultural etiquette, or saving money.
- If the budget is "low", prioritize free attractions, walking tours, and street food gems. If "high", suggest luxury heritage stays, private guides, and fine dining.

Destination: {{destination}}
Dates: {{dates}}
Interests: {{interests}}
Budget: {{budget}}

Ensure the output is formatted clearly with headings, bullet points, and an inviting tone.`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
