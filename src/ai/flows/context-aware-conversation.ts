'use server';

/**
 * @fileOverview Implements a context-aware conversation flow using Genkit.
 *
 * - contextAwareConversation - An async function that takes user input and returns the AI's response, maintaining conversation context.
 * - ContextAwareConversationInput - The input type for the contextAwareConversation function.
 * - ContextAwareConversationOutput - The return type for the contextAwareConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextAwareConversationInputSchema = z.object({
  userInput: z.string().describe('The user input message.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The previous turns of the conversation.'),
});
export type ContextAwareConversationInput = z.infer<typeof ContextAwareConversationInputSchema>;

const ContextAwareConversationOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response.'),
});
export type ContextAwareConversationOutput = z.infer<typeof ContextAwareConversationOutputSchema>;

export async function contextAwareConversation(input: ContextAwareConversationInput): Promise<ContextAwareConversationOutput> {
  return contextAwareConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextAwareConversationPrompt',
  input: {
    schema: ContextAwareConversationInputSchema,
  },
  output: {
    schema: ContextAwareConversationOutputSchema,
  },
  prompt: `You are Claude, an AI assistant. Respond to the user input, maintaining context from previous turns of the conversation.

{% if conversationHistory %}
Conversation History:
{% each conversationHistory %}
{{this.role}}: {{this.content}}
{% endeach %}
{% endif %}

User Input: {{{userInput}}}

Response: `,
});

const contextAwareConversationFlow = ai.defineFlow(
  {
    name: 'contextAwareConversationFlow',
    inputSchema: ContextAwareConversationInputSchema,
    outputSchema: ContextAwareConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
