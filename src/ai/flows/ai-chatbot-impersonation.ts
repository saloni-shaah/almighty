'use server';

/**
 * @fileOverview An AI chatbot flow that impersonates Claude.
 *
 * - chatWithClaude - A function that handles the conversation with the Claude impersonator.
 * - ChatWithClaudeInput - The input type for the chatWithClaude function.
 * - ChatWithClaudeOutput - The return type for the chatWithClaude function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithClaudeInputSchema = z.object({
  message: z.string().describe('The user message to be sent to the chatbot.'),
  context: z.string().describe('The context of the conversation.'),
});
export type ChatWithClaudeInput = z.infer<typeof ChatWithClaudeInputSchema>;

const ChatWithClaudeOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
  updatedContext: z.string().describe('The updated conversation context.'),
});
export type ChatWithClaudeOutput = z.infer<typeof ChatWithClaudeOutputSchema>;

export async function chatWithClaude(input: ChatWithClaudeInput): Promise<ChatWithClaudeOutput> {
  return chatWithClaudeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithClaudePrompt',
  input: {schema: ChatWithClaudeInputSchema},
  output: {schema: ChatWithClaudeOutputSchema},
  prompt: `You are Claude, an engaging and informative AI chatbot. Respond to the user message based on the current conversation context.

Context: {{{context}}}

User Message: {{{message}}}

Response: `,
});

const chatWithClaudeFlow = ai.defineFlow(
  {
    name: 'chatWithClaudeFlow',
    inputSchema: ChatWithClaudeInputSchema,
    outputSchema: ChatWithClaudeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      response: output!.response,
      updatedContext: input.context + '\nUser: ' + input.message + '\nClaude: ' + output!.response,
    };
  }
);
