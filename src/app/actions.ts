"use server";

import { chatWithClaude } from "@/ai/flows/ai-chatbot-impersonation";
import type { ChatWithClaudeInput } from "@/ai/flows/ai-chatbot-impersonation";
import { z } from "zod";

const actionSchema = z.object({
  message: z.string(),
  context: z.string(),
  file: z.object({
    dataUrl: z.string(),
    name: z.string(),
  }).optional(),
});

export async function getClaudeResponse(input: ChatWithClaudeInput) {
  const parsedInput = actionSchema.safeParse(input);
  if (!parsedInput.success) {
    return { failure: "Invalid input" };
  }

  try {
    const output = await chatWithClaude(parsedInput.data);
    return { success: output };
  } catch (error) {
    console.error(error);
    return { failure: "An error occurred while communicating with the AI." };
  }
}
