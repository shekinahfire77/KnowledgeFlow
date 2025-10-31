/**
 * TODO pattern extraction
 * Extracts actionable tasks from note text using pattern matching
 */

export interface ExtractedTodo {
  text: string;
  completed: boolean;
  lineNumber: number;
  raw: string;
}

// Common TODO patterns
const TODO_PATTERNS = [
  // Markdown checkboxes
  /^[\s-]*\[([x\s])\]\s+(.+)$/im,
  // TODO: prefix
  /^[\s-]*TODO:\s*(.+)$/im,
  // [ ] checkbox style
  /^[\s-]*\[\s\]\s*(.+)$/im,
  // [x] completed style
  /^[\s-]*\[x\]\s*(.+)$/im,
];

/**
 * Extract TODO items from text
 */
export function extractTodos(text: string): ExtractedTodo[] {
  const todos: ExtractedTodo[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check markdown checkbox pattern: - [ ] or - [x]
    const checkboxMatch = line.match(/^[\s-]*\[([x\s])\]\s+(.+)$/i);
    if (checkboxMatch) {
      const completed = checkboxMatch[1].toLowerCase() === 'x';
      const text = checkboxMatch[2].trim();

      if (text) {
        todos.push({
          text,
          completed,
          lineNumber: i + 1,
          raw: line,
        });
      }
      continue;
    }

    // Check TODO: prefix pattern
    const todoMatch = line.match(/^[\s-]*TODO:\s*(.+)$/i);
    if (todoMatch) {
      const text = todoMatch[1].trim();

      if (text) {
        todos.push({
          text,
          completed: false,
          lineNumber: i + 1,
          raw: line,
        });
      }
      continue;
    }

    // Check for lines starting with action verbs (basic detection)
    const actionMatch = line.match(/^[\s-]*(?:•|\*|-)\s*((?:call|email|write|finish|complete|review|update|fix|implement|test|deploy)\s+.+)$/i);
    if (actionMatch) {
      const text = actionMatch[1].trim();

      if (text) {
        todos.push({
          text,
          completed: false,
          lineNumber: i + 1,
          raw: line,
        });
      }
    }
  }

  return todos;
}

/**
 * Check if a line contains a TODO pattern
 */
export function isTodoLine(line: string): boolean {
  return TODO_PATTERNS.some((pattern) => pattern.test(line));
}

/**
 * Convert TODO back to markdown format
 */
export function formatTodo(todo: ExtractedTodo): string {
  const checkbox = todo.completed ? '[x]' : '[ ]';
  return `- ${checkbox} ${todo.text}`;
}

/**
 * Extract action items (imperative sentences)
 * Simple heuristic: sentences starting with action verbs
 */
export function extractActionItems(text: string): string[] {
  const actionVerbs = [
    'call', 'email', 'write', 'send', 'create', 'update', 'fix',
    'implement', 'test', 'deploy', 'review', 'check', 'verify',
    'finish', 'complete', 'start', 'begin', 'schedule', 'plan',
  ];

  const sentences = text.split(/[.!?\n]+/);
  const actions: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase();

    if (firstWord && actionVerbs.includes(firstWord)) {
      actions.push(trimmed);
    }
  }

  return actions;
}
