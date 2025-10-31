/**
 * TF-IDF (Term Frequency-Inverse Document Frequency) implementation
 * Used for calculating semantic similarity between notes
 */

export interface TfidfVector {
  [term: string]: number;
}

export interface DocumentCorpus {
  id: string;
  vector: TfidfVector;
}

/**
 * Calculate TF-IDF vectors for a corpus of documents
 */
export function calculateTfidf(documents: Array<{ id: string; text: string }>): DocumentCorpus[] {
  // Step 1: Tokenize all documents
  const tokenizedDocs = documents.map((doc) => ({
    id: doc.id,
    tokens: tokenize(doc.text),
  }));

  // Step 2: Calculate term frequencies (TF)
  const termFrequencies = tokenizedDocs.map((doc) => ({
    id: doc.id,
    tf: calculateTermFrequency(doc.tokens),
  }));

  // Step 3: Calculate inverse document frequency (IDF)
  const idf = calculateIdf(tokenizedDocs);

  // Step 4: Calculate TF-IDF vectors
  const corpus: DocumentCorpus[] = termFrequencies.map((doc) => ({
    id: doc.id,
    vector: calculateTfidfVector(doc.tf, idf),
  }));

  return corpus;
}

/**
 * Tokenize text into terms
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2) // Filter out short tokens
    .filter((token) => !isStopWord(token));
}

/**
 * Calculate term frequency for a document
 */
function calculateTermFrequency(tokens: string[]): { [term: string]: number } {
  const tf: { [term: string]: number } = {};
  const totalTerms = tokens.length;

  for (const term of tokens) {
    tf[term] = (tf[term] || 0) + 1;
  }

  // Normalize by document length
  for (const term in tf) {
    tf[term] = tf[term] / totalTerms;
  }

  return tf;
}

/**
 * Calculate inverse document frequency for all terms in corpus
 */
function calculateIdf(tokenizedDocs: Array<{ id: string; tokens: string[] }>): { [term: string]: number } {
  const idf: { [term: string]: number } = {};
  const totalDocs = tokenizedDocs.length;

  // Count documents containing each term
  const docCounts: { [term: string]: number } = {};

  for (const doc of tokenizedDocs) {
    const uniqueTerms = new Set(doc.tokens);
    for (const term of uniqueTerms) {
      docCounts[term] = (docCounts[term] || 0) + 1;
    }
  }

  // Calculate IDF
  for (const term in docCounts) {
    idf[term] = Math.log(totalDocs / docCounts[term]);
  }

  return idf;
}

/**
 * Calculate TF-IDF vector by combining TF and IDF
 */
function calculateTfidfVector(tf: { [term: string]: number }, idf: { [term: string]: number }): TfidfVector {
  const vector: TfidfVector = {};

  for (const term in tf) {
    vector[term] = tf[term] * (idf[term] || 0);
  }

  return vector;
}

/**
 * Calculate cosine similarity between two TF-IDF vectors
 */
export function cosineSimilarity(vec1: TfidfVector, vec2: TfidfVector): number {
  // Get all unique terms
  const allTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const term of allTerms) {
    const val1 = vec1[term] || 0;
    const val2 = vec2[term] || 0;

    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Find similar documents to a given document
 */
export function findSimilar(
  targetId: string,
  corpus: DocumentCorpus[],
  threshold: number = 0.3,
  limit: number = 10
): Array<{ id: string; similarity: number }> {
  const targetDoc = corpus.find((doc) => doc.id === targetId);

  if (!targetDoc) {
    return [];
  }

  const similarities: Array<{ id: string; similarity: number }> = [];

  for (const doc of corpus) {
    if (doc.id === targetId) {
      continue;
    }

    const similarity = cosineSimilarity(targetDoc.vector, doc.vector);

    if (similarity >= threshold) {
      similarities.push({ id: doc.id, similarity });
    }
  }

  // Sort by similarity (descending) and limit
  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, limit);
}

/**
 * Simple stop words list (common words to filter out)
 */
function isStopWord(word: string): boolean {
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
    'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
    'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they',
    'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
    'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
    'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  ]);

  return stopWords.has(word);
}
