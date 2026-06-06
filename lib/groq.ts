import "server-only";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY environment variable");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Gets a conversational chat completion from the Groq API
 * @param messages - Array of role/content message objects
 * @param maxTokens - Maximum tokens in the response (default 500)
 * @returns The model's response string
 */
export async function getChatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens: number = 500
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return content;
}

/**
 * Gets a structured JSON completion from the Groq API using json_object response format
 * @param messages - Array of role/content message objects
 * @param maxTokens - Maximum tokens in the response (default 800)
 * @returns The model's response string (expected to be valid JSON)
 */
export async function getStructuredCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens: number = 800
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: maxTokens,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return content;
}
