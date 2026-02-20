
'use server';

/**
 * @fileOverview A flow to simulate sending an OTP email to a user.
 *
 * - sendOtpEmail - A function that "sends" an OTP to the specified email.
 * - SendOtpEmailInput - The input type for the sendOtpEmail function.
 * - SendOtpEmailOutput - The return type for the sendOtpEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendOtpEmailInputSchema = z.object({
  email: z.string().email().describe('The recipient email address.'),
  otpCode: z.string().describe('The 6-digit OTP code to send.'),
});
export type SendOtpEmailInput = z.infer<typeof SendOtpEmailInputSchema>;

const SendOtpEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  message: z.string().describe('A status message.'),
});
export type SendOtpEmailOutput = z.infer<typeof SendOtpEmailOutputSchema>;

export async function sendOtpEmail(input: SendOtpEmailInput): Promise<SendOtpEmailOutput> {
  return sendOtpEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendOtpEmailPrompt',
  input: {schema: SendOtpEmailInputSchema},
  prompt: `You are the automated notification system for BR TRIP. 
Send a professional and secure login notification to the user at {{email}}.

OTP Code: {{otpCode}}

The email should be in a mix of Hindi and English (Hinglish) to maintain the brand voice: "Sahi Nivesh • Sahi Safar".
Include a warning that they should not share this code with anyone.`,
});

const sendOtpEmailFlow = ai.defineFlow(
  {
    name: 'sendOtpEmailFlow',
    inputSchema: SendOtpEmailInputSchema,
    outputSchema: SendOtpEmailOutputSchema,
  },
  async input => {
    // In a production app, you would integrate with an email provider like Resend or SendGrid here.
    // For this prototype, we simulate the AI composing the secure message.
    await prompt(input);
    
    console.log(`[SIMULATED EMAIL SENT TO ${input.email}]: Your OTP is ${input.otpCode}`);
    
    return {
      success: true,
      message: `OTP sent to ${input.email} via secure channel.`,
    };
  }
);
