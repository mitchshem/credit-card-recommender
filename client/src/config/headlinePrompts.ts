/**
 * Headline Prompts Configuration
 * 
 * This file contains a curated list of headline-style questions that use "we" language.
 * These prompts are randomly selected on the home page to create a personalized, 
 * conversational experience.
 * 
 * To customize:
 * - Add or remove prompts from the array below
 * - Keep the "we" language style for consistency
 * - Keep questions focused on the core action (finding the best card for spending)
 */

export const HEADLINE_PROMPTS = [
  "Where are we shopping today?",
  "Where are we spending today?",
  "Where are we earning today?",
  "Where are we swiping today?",
  "Which merchant are we visiting today?",
  "What store are we visiting today?",
];

/**
 * Get a random prompt from the list
 * Useful for testing or if you want to manually select one
 */
export function getRandomPrompt(): string {
  const randomIndex = Math.floor(Math.random() * HEADLINE_PROMPTS.length);
  return HEADLINE_PROMPTS[randomIndex];
}

