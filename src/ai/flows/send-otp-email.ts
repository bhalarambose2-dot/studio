'use server';

/**
 * @fileOverview A flow to simulate sending an OTP email to a user.
 * 
 * This flow is now purely functional to avoid Gemini AI quota issues (429).
 * It logs the OTP very clearly to the server terminal as a "Customer Care" dispatch.
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
 * Simulated OTP Email Sender (Customer Care Dispatch)
 * Logs the OTP very clearly in the terminal for the developer/user to see.
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
    // Simulated Dispatch Log - This bypasses Gemini 429 errors
    console.log(`\n\n====================================================`);
    console.log(`[BR TRIP - CUSTOMER CARE EMAIL DISPATCH]`);
    console.log(`STATUS: OUTGOING`);
    console.log(`TO: ${input.email}`);
    console.log(`SUBJECT: Your Sahi Safar Login OTP`);
    console.log(`----------------------------------------------------`);
    console.log(`YOUR 6-DIGIT OTP CODE IS: ${input.otpCode}`);
    console.log(`----------------------------------------------------`);
    console.log(`TIMESTAMP: ${new Date().toLocaleString()}`);
    console.log(`====================================================\n\n`);
    
    return {
      success: true,
      message: `OTP dispatched to ${input.email} via Customer Care.`,
    };
  }
);
