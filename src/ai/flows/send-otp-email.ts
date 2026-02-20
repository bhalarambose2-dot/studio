'use server';

/**
 * @fileOverview A flow to simulate sending an OTP email to a user.
 * 
 * This flow is now purely functional to avoid Gemini AI quota issues (429).
 * It logs the OTP to the server console for the prototype.
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

/**
 * Simulated OTP Email Sender
 * Logs the OTP very clearly in the terminal for the developer/user.
 */
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
    // Log the OTP very clearly for the developer/user to see in the terminal
    console.log(`\n\n====================================================`);
    console.log(`[SIMULATED EMAIL DISPATCH]`);
    console.log(`TO: ${input.email}`);
    console.log(`YOUR OTP CODE IS: ${input.otpCode}`);
    console.log(`====================================================\n\n`);
    
    return {
      success: true,
      message: `OTP sent to ${input.email} (Check Server Console).`,
    };
  }
);
