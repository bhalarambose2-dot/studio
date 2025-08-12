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
  prompt: `You are an expert trip planner. A user has provided feedback on an existing itinerary.  Your job is to improve the itinerary based on the feedback.

Existing Itinerary:
{{existingItinerary}}

User Feedback:
{{userFeedback}}

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
