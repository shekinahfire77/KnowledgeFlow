/**
 * Bullet summarization
 * Extracts key points from text and formats as bullet points
 */

import nlp from 'compromise';

export interface BulletPoint {
  text: string;
  importance: number;
}

/**
 * Summarize text as bullet points
 * Extracts most important sentences and formats as bullets
 */
export function summarizeToBullets(
  text: string,
  options?: {
    maxBullets?: number;
    minSentenceLength?: number;
  }
): BulletPoint[] {
  const maxBullets = options?.maxBullets || 5;
  const minSentenceLength = options?.minSentenceLength || 20;

  // Parse text with compromise
  const doc = nlp(text);

  // Extract sentences
  const sentences = doc.sentences().out('array') as string[];

  // Score sentences based on various factors
  const scoredSentences: Array<{ text: string; score: number }> = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();

    // Skip short sentences
    if (sentence.length < minSentenceLength) {
      continue;
    }

    // Calculate importance score
    const score = calculateSentenceImportance(sentence, i, sentences.length, text);

    scoredSentences.push({ text: sentence, score });
  }

  // Sort by score and take top N
  scoredSentences.sort((a, b) => b.score - a.score);
  const topSentences = scoredSentences.slice(0, maxBullets);

  // Convert to bullet points
  return topSentences.map((s) => ({
    text: s.text,
    importance: s.score,
  }));
}

/**
 * Calculate importance score for a sentence
 */
function calculateSentenceImportance(
  sentence: string,
  position: number,
  totalSentences: number,
  fullText: string
): number {
  let score = 0;

  // Position score (first and last sentences often important)
  if (position === 0) {
    score += 0.3; // First sentence bonus
  } else if (position === totalSentences - 1) {
    score += 0.2; // Last sentence bonus
  }

  // Length score (prefer medium-length sentences)
  const words = sentence.split(/\s+/).length;
  if (words >= 8 && words <= 25) {
    score += 0.2;
  }

  // Keyword score (contains important words)
  const importantWords = [
    'important', 'critical', 'key', 'main', 'primary', 'significant',
    'note', 'remember', 'must', 'should', 'need', 'essential',
  ];

  const lowerSentence = sentence.toLowerCase();
  for (const word of importantWords) {
    if (lowerSentence.includes(word)) {
      score += 0.15;
    }
  }

  // Named entity bonus (contains proper nouns)
  const doc = nlp(sentence);
  const properNouns = doc.nouns().filter((n: any) => n.has('#ProperNoun')).out('array');
  if (properNouns.length > 0) {
    score += 0.1 * Math.min(properNouns.length, 3);
  }

  // Number/date bonus (contains specific data)
  if (/\d+/.test(sentence)) {
    score += 0.1;
  }

  return score;
}

/**
 * Format bullet points as markdown
 */
export function formatBullets(bullets: BulletPoint[]): string {
  return bullets.map((bullet) => `- ${bullet.text}`).join('\n');
}

/**
 * Extract action items from text (commands/imperatives)
 */
export function extractActionBullets(text: string, maxBullets: number = 5): BulletPoint[] {
  const doc = nlp(text);

  // Look for imperative sentences (commands)
  const sentences = doc.sentences().out('array') as string[];
  const actionSentences: BulletPoint[] = [];

  const actionVerbs = [
    'call', 'email', 'write', 'send', 'create', 'update', 'fix',
    'implement', 'test', 'deploy', 'review', 'check', 'verify',
    'finish', 'complete', 'start', 'begin', 'schedule', 'plan',
    'remember', 'note', 'ensure', 'make', 'add', 'remove',
  ];

  for (const sentence of sentences) {
    const firstWord = sentence.trim().split(/\s+/)[0]?.toLowerCase();

    if (firstWord && actionVerbs.includes(firstWord)) {
      actionSentences.push({
        text: sentence.trim(),
        importance: 1.0,
      });
    }
  }

  return actionSentences.slice(0, maxBullets);
}

/**
 * Create a quick summary with title and bullets
 */
export function createQuickSummary(
  text: string,
  options?: {
    maxBullets?: number;
  }
): {
  title: string;
  bullets: string[];
} {
  const doc = nlp(text);

  // Extract title (first sentence or first meaningful phrase)
  const sentences = doc.sentences().out('array') as string[];
  const title = sentences[0]?.slice(0, 100) || 'Summary';

  // Generate bullets
  const bulletPoints = summarizeToBullets(text, options);
  const bullets = bulletPoints.map((b) => b.text);

  return {
    title,
    bullets,
  };
}
