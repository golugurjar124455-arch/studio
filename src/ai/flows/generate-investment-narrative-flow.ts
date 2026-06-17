'use server';
/**
 * @fileOverview A Genkit flow for generating an investment performance narrative.
 *
 * - generateInvestmentNarrative - A function that generates a natural language summary of a client's investment performance.
 * - GenerateInvestmentNarrativeInput - The input type for the generateInvestmentNarrative function.
 * - GenerateInvestmentNarrativeOutput - The return type for the generateInvestmentNarrative function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInvestmentNarrativeInputSchema = z.object({
  investedAmount: z.number().describe('The total amount of money invested by the client.'),
  currentValue: z.number().describe('The current market value of the client\'s investments.'),
  profitLoss: z.number().describe('The calculated profit or loss from the client\'s investments (currentValue - investedAmount).'),
});
export type GenerateInvestmentNarrativeInput = z.infer<typeof GenerateInvestmentNarrativeInputSchema>;

const GenerateInvestmentNarrativeOutputSchema = z.object({
  narrative: z.string().describe('A concise, natural language summary of the client\'s investment performance.'),
});
export type GenerateInvestmentNarrativeOutput = z.infer<typeof GenerateInvestmentNarrativeOutputSchema>;

export async function generateInvestmentNarrative(input: GenerateInvestmentNarrativeInput): Promise<GenerateInvestmentNarrativeOutput> {
  return generateInvestmentNarrativeFlow(input);
}

const generateInvestmentNarrativePrompt = ai.definePrompt({
  name: 'generateInvestmentNarrativePrompt',
  input: { schema: GenerateInvestmentNarrativeInputSchema },
  output: { schema: GenerateInvestmentNarrativeOutputSchema },
  prompt: `You are an expert investment advisor.

Analyze the following client investment data and generate a concise, natural language summary of their investment performance. Focus on explaining the profit/loss and what it means for the client.

Investment Data:
Invested Amount: {{{investedAmount}}}
Current Value: {{{currentValue}}}
Profit/Loss: {{{profitLoss}}}

Performance Summary:`,
});

const generateInvestmentNarrativeFlow = ai.defineFlow(
  {
    name: 'generateInvestmentNarrativeFlow',
    inputSchema: GenerateInvestmentNarrativeInputSchema,
    outputSchema: GenerateInvestmentNarrativeOutputSchema,
  },
  async (input) => {
    const { output } = await generateInvestmentNarrativePrompt(input);
    return output!;
  }
);
