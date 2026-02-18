'use server';

/**
 * @fileOverview Flow to improve a trip itinerary based on user feedback.
 *
 * - improveItinerary - A function that takes an existing itinerary and user feedback, and returns an improved itinerary.
 * - ImproveItineraryInput - The input type for the improveItinerary function.
 * - ImproveItineraryOutput - The return type for the improveItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveItineraryInputSchema = z.object({
  existingItinerary: z.string().describe('The existing trip itinerary to improve.'),
  userFeedback: z.string().describe('The user feedback to incorporate into the itinerary.'),
});
export type ImproveItineraryInput = z.infer<typeof ImproveItineraryInputSchema>;

const ImproveItineraryOutputSchema = z.object({
  improvedItinerary: z.string().describe('The improved trip itinerary.'),
});
export type ImproveItineraryOutput = z.infer<typeof ImproveItineraryOutputSchema>;

export async function improveItinerary(input: ImproveItineraryInput): Promise<ImproveItineraryOutput> {
  return improveItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveItineraryPrompt',
  input: {schema: ImproveItineraryInputSchema},
  output: {schema: ImproveItineraryOutputSchema},
  prompt: `You are a meticulous senior trip curator. A traveler wants to refine their current plan to make it perfect. 
Review the existing itinerary and the user's specific feedback to create a Version 2.0 that is even more aligned with their desires.

Existing Itinerary:
{{existingItinerary}}

User Feedback:
{{userFeedback}}

Instructions:
- Maintain the professional and day-by-day structure of the original.
- Swap out activities or adjust pacing based specifically on the feedback provided.
- Ensure the logical flow of travel (e.g., proximity of locations) remains sound.
- If the feedback is about food, suggest specific new local restaurants.

Improved Itinerary:`, 
});

const improveItineraryFlow = ai.defineFlow(
  {
    name: 'improveItineraryFlow',
    inputSchema: ImproveItineraryInputSchema,
    outputSchema: ImproveItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
