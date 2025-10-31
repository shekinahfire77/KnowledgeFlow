/**
 * Noun phrase extraction using compromise NLP library
 * Extracts meaningful phrases from text for semantic analysis
 */

import nlp from 'compromise';

export interface ExtractedPhrase {
  text: string;
  normalized: string;
  score: number;
}

/**
 * Extract noun phrases from text
 * Returns phrases with normalized forms and relevance scores
 */
export function extractPhrases(text: string, options?: {
  minLength?: number;
  maxPhrases?: number;
}): ExtractedPhrase[] {
  const minLength = options?.minLength || 3;
  const maxPhrases = options?.maxPhrases || 50;

  // Parse text with compromise
  const doc = nlp(text);

  // Extract noun phrases
  const nounPhrases = doc.nouns().out('array') as string[];

  // Extract important terms
  const terms = doc.terms().out('array') as string[];

  // Combine and deduplicate
  const allPhrases = [...new Set([...nounPhrases, ...terms])];

  // Filter and score phrases
  const phrases: ExtractedPhrase[] = [];

  for (const phrase of allPhrases) {
    const normalized = normalizePhrase(phrase);

    // Skip short or invalid phrases
    if (normalized.length < minLength) {
      continue;
    }

    // Calculate relevance score based on:
    // - Length (longer phrases often more specific)
    // - Position (earlier phrases often more important)
    // - Frequency
    const frequency = countOccurrences(text.toLowerCase(), normalized.toLowerCase());
    const lengthScore = Math.min(normalized.length / 20, 1);
    const frequencyScore = Math.min(frequency / 5, 1);

    const score = (lengthScore * 0.3) + (frequencyScore * 0.7);

    phrases.push({
      text: phrase,
      normalized,
      score,
    });
  }

  // Sort by score and limit
  phrases.sort((a, b) => b.score - a.score);

  return phrases.slice(0, maxPhrases);
}

/**
 * Normalize a phrase for comparison
 */
function normalizePhrase(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Count occurrences of a substring in text
 */
function countOccurrences(text: string, substring: string): number {
  let count = 0;
  let pos = 0;

  while ((pos = text.indexOf(substring, pos)) !== -1) {
    count++;
    pos += substring.length;
  }

  return count;
}

/**
 * Extract key terms from text (simplified version)
 */
export function extractKeyTerms(text: string, limit: number = 20): string[] {
  const phrases = extractPhrases(text, { maxPhrases: limit });
  return phrases.map((p) => p.normalized);
}
