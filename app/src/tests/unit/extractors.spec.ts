/**
 * Unit tests for semantic extractors
 */

import { describe, it, expect } from 'vitest';
import { extractPhrases, extractKeyTerms } from '../../semantics/extractors/phrases';
import { extractTodos, isTodoLine, formatTodo } from '../../semantics/extractors/todos';

describe('Phrase Extractor', () => {
  it('should extract noun phrases from text', () => {
    const text = 'The quick brown fox jumps over the lazy dog in the garden.';
    const phrases = extractPhrases(text);

    expect(phrases).toBeDefined();
    expect(phrases.length).toBeGreaterThan(0);
    expect(phrases[0]).toHaveProperty('text');
    expect(phrases[0]).toHaveProperty('normalized');
    expect(phrases[0]).toHaveProperty('score');
  });

  it('should filter short phrases', () => {
    const text = 'AI ML NLP are acronyms for artificial intelligence machine learning natural language processing';
    const phrases = extractPhrases(text, { minLength: 5 });

    phrases.forEach(phrase => {
      expect(phrase.normalized.length).toBeGreaterThanOrEqual(5);
    });
  });

  it('should extract key terms', () => {
    const text = 'Machine learning and artificial intelligence are transforming technology.';
    const terms = extractKeyTerms(text, 5);

    expect(terms).toBeDefined();
    expect(Array.isArray(terms)).toBe(true);
    expect(terms.length).toBeLessThanOrEqual(5);
  });
});

describe('TODO Extractor', () => {
  it('should extract markdown checkbox todos', () => {
    const text = `
- [ ] Buy groceries
- [x] Complete report
- [ ] Call dentist
Regular text here
    `;

    const todos = extractTodos(text);

    expect(todos).toHaveLength(3);
    expect(todos[0].text).toBe('Buy groceries');
    expect(todos[0].completed).toBe(false);
    expect(todos[1].text).toBe('Complete report');
    expect(todos[1].completed).toBe(true);
  });

  it('should extract TODO: prefix patterns', () => {
    const text = `
Some notes here
TODO: Review the code
TODO: Update documentation
More notes
    `;

    const todos = extractTodos(text);

    expect(todos).toHaveLength(2);
    expect(todos[0].text).toBe('Review the code');
    expect(todos[0].completed).toBe(false);
  });

  it('should detect todo lines', () => {
    expect(isTodoLine('- [ ] Task item')).toBe(true);
    expect(isTodoLine('- [x] Completed task')).toBe(true);
    expect(isTodoLine('TODO: Do something')).toBe(true);
    expect(isTodoLine('Regular text')).toBe(false);
  });

  it('should format todos to markdown', () => {
    const todo = {
      text: 'Complete task',
      completed: false,
      lineNumber: 1,
      raw: '- [ ] Complete task',
    };

    const formatted = formatTodo(todo);
    expect(formatted).toBe('- [ ] Complete task');

    todo.completed = true;
    const formattedCompleted = formatTodo(todo);
    expect(formattedCompleted).toBe('- [x] Complete task');
  });

  it('should handle empty text', () => {
    const todos = extractTodos('');
    expect(todos).toHaveLength(0);
  });

  it('should track line numbers', () => {
    const text = `Line 1
Line 2
- [ ] Task on line 3
Line 4
- [ ] Task on line 5`;

    const todos = extractTodos(text);

    expect(todos[0].lineNumber).toBe(3);
    expect(todos[1].lineNumber).toBe(5);
  });
});
