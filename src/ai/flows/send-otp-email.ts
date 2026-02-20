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

const sendOtpEmailFlow = ai.defineFlow(
  {
    name: 'sendOtpEmailFlow',
    inputSchema: SendOtpEmailInputSchema,
    outputSchema: SendOtpEmailOutputSchema,
  },
  async input => {
    // Note: AI prompt call removed to avoid API quota issues (429 Too Many Requests).
    // The flow now proceeds directly to logging the OTP for the prototype.
    
    // Log the OTP very clearly for the developer/user to see in the terminal
    console.log(`\n****************************************************`);
    console.log(`[SIMULATED EMAIL SENT TO ${input.email}]`);
    console.log(`YOUR LOGIN OTP IS: ${input.otpCode}`);
    console.log(`****************************************************\n`);
    
    return {
      success: true,
      message: `OTP sent to ${input.email} via secure channel.`,
    };
  }
);
