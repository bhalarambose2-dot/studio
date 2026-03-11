'use server';

/**
 * @fileOverview A flow to simulate sending an OTP email to a user.
 * 
 * This flow is purely functional to avoid Gemini AI quota issues (429).
 * It logs the OTP ONLY to the server terminal as a "Customer Care Dispatch".
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
 * Logs the OTP ONLY in the server terminal for professional security simulation.
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
    // Simulated Dispatch Log - This is the "Email Server"
    // No code is logged to the browser or console.
    console.log(`\n\n====================================================`);
    console.log(`[HALORA - PRIVATE CUSTOMER CARE EMAIL DISPATCH]`);
    console.log(`STATUS: DISPATCHED TO INBOX`);
    console.log(`TO: ${input.email}`);
    console.log(`SUBJECT: HALORA Security Code`);
    console.log(`----------------------------------------------------`);
    console.log(`CONFIDENTIAL OTP CODE: ${input.otpCode}`);
    console.log(`----------------------------------------------------`);
    console.log(`DISPATCH_TIME: ${new Date().toISOString()}`);
    console.log(`====================================================\n\n`);
    
    return {
      success: true,
      message: `OTP dispatched to ${input.email} via Private Dispatch.`,
    };
  }
);
