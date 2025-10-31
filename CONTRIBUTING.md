# Contributing to KnowledgeFlow

Thank you for your interest in contributing to KnowledgeFlow! We're excited to have you help us build a smarter, more private way to take notes and manage knowledge. This guide will help you get started.

## How to Contribute

We welcome contributions in many forms:

- **Bug Reports**: Found an issue? Open a GitHub issue with a clear description and steps to reproduce
- **Feature Suggestions**: Have an idea? We'd love to hear it. Open a discussion or issue labeled as an enhancement
- **Code Contributions**: Submit pull requests with bug fixes, improvements, or new features
- **Documentation**: Help us improve our docs, guides, and code comments
- **Testing**: Run the app, report edge cases, and help us improve quality
- **Design**: Contribute UI/UX improvements and accessibility enhancements

## Development Setup

Getting KnowledgeFlow running locally is straightforward.

### Prerequisites

- **Node.js** 18 or higher
- **pnpm** 8+ (or npm/yarn)
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "Note Taking App"
   ```

2. **Install dependencies**
   ```bash
   cd app
   pnpm install
   ```

3. **Verify setup**
   ```bash
   pnpm type-check
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:5173`

5. **Seed sample data** (optional)
   ```bash
   pnpm seed
   ```

### Available Scripts

For detailed documentation on all available scripts, see `/app/QUICKSTART.md`.

**Most Common:**
```bash
pnpm dev              # Start development server
pnpm test             # Run tests
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Generate coverage report
pnpm lint            # Check for linting errors
pnpm lint:fix        # Auto-fix linting issues
pnpm format          # Format code with Prettier
pnpm type-check      # Verify TypeScript
pnpm build           # Build for production
```

## Code Style

We maintain consistent, readable code through automated tooling and clear conventions.

### TypeScript Standards

- **Strict Mode**: All TypeScript must compile with `tsconfig.json` strict settings enabled
- **Type Annotations**: Explicit types on function parameters and return values
- **No `any` types**: Use proper typing, generics, or `unknown` if necessary
- **Import Organization**: Group standard library → external packages → local imports

Example:
```typescript
// ✅ Good
function calculateSimilarity(vector1: number[], vector2: number[]): number {
  // Implementation
}

// ❌ Avoid
function calculateSimilarity(vector1: any, vector2: any) {
  // Implementation
}
```

### ESLint & Prettier

All code must pass linting and formatting checks before submission.

```bash
# Check for linting errors
pnpm lint

# Auto-fix fixable issues
pnpm lint:fix

# Format code to project standards
pnpm format
```

Configuration files are already set up:
- `.eslintrc.json` - Linting rules
- `.prettierrc` - Code formatting
- `tsconfig.json` - TypeScript compiler options

### Code Organization

- **Meaningful names**: Use clear, descriptive names for variables, functions, and classes
- **Small functions**: Keep functions focused on a single responsibility
- **Comments**: Explain *why*, not *what*. Self-documenting code is preferred
- **DRY principle**: Don't repeat yourself; extract common logic into helpers

## Testing Requirements

Testing is essential to maintaining quality and preventing regressions.

### Test Coverage Targets

- **Minimum coverage**: 70% for all new code
- **Critical paths**: 100% coverage for business logic and semantic algorithms
- **Unit tests**: Required for new functions and utilities
- **E2E tests**: Required for new user-facing features

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (recommended for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Writing Tests

Tests go in `/app/src/tests/` alongside the code they test.

- Use **Vitest** for unit tests
- Use **Playwright** for end-to-end tests
- Use descriptive test names: `should extract TODO items from markdown` not `test1`
- Test both happy paths and edge cases

Example:
```typescript
describe('extractTODOs', () => {
  it('should extract TODO items from markdown', () => {
    const text = '- TODO: Complete feature';
    const todos = extractTODOs(text);
    expect(todos).toContain('Complete feature');
  });

  it('should handle empty strings', () => {
    const todos = extractTODOs('');
    expect(todos).toEqual([]);
  });
});
```

### Before Submitting a PR

Run the full test suite and verify coverage:

```bash
pnpm test:coverage
pnpm type-check
pnpm lint
```

All checks must pass before opening a pull request.

## Pull Request Process

### Before You Start

1. **Check existing issues** - Avoid duplicate work
2. **Discuss major changes** - Open an issue first for significant features
3. **Create a feature branch** - Use a descriptive name: `fix/note-search-bug` or `feat/dark-mode`

### Submitting Your PR

1. **Commit messages** - Use clear, conventional format:
   - `fix: resolve search crash with special characters`
   - `feat: add bulk export functionality`
   - `docs: update setup instructions`
   - `test: improve semantic engine coverage`

2. **Keep PRs focused** - One feature or fix per PR, not multiple unrelated changes

3. **Write a clear description** that includes:
   - What problem does this solve?
   - How did you test it?
   - Any breaking changes?
   - Screenshots/videos if relevant

4. **Link related issues** - Use "Closes #123" in your PR description

### PR Checklist

Before marking your PR as ready for review, ensure:

- [ ] Tests added/updated with ≥70% coverage
- [ ] All tests passing (`pnpm test`)
- [ ] Code formatted (`pnpm lint:fix && pnpm format`)
- [ ] TypeScript compiles (`pnpm type-check`)
- [ ] Commit messages follow conventions
- [ ] Documentation updated if needed
- [ ] No unresolved conversations

### Review Process

- A maintainer will review your PR within 2-5 business days
- We may request changes or have questions
- Once approved, your PR will be merged and deployed
- Thank you for helping KnowledgeFlow improve!

## Issue Reporting Guidelines

Found a bug? Help us fix it by providing clear, actionable information.

### Creating a Bug Report

1. **Search existing issues** - Check if it's already been reported
2. **Use a clear title** - "Search crashes with empty query" not "It's broken"
3. **Provide reproduction steps**:
   - What did you do?
   - What happened?
   - What did you expect?
4. **Environment details**:
   - Windows version (10/11)
   - Node.js version
   - How did you start the app?
5. **Error logs** - Paste relevant console/error output
6. **Attachments** - Screenshots, screen recordings, or export files help

### Creating a Feature Request

1. **Clear title** - "Allow exporting notes as Markdown"
2. **Problem statement** - Why is this needed?
3. **Proposed solution** - How should it work?
4. **Alternatives considered** - Any other approaches?
5. **Additional context** - Links, examples, or references

## Code of Conduct

We're committed to fostering an inclusive, respectful community. We expect all contributors to:

- **Be respectful** - Treat others with kindness and professionalism
- **Be inclusive** - Welcome people of all backgrounds and experience levels
- **Be constructive** - Provide helpful feedback; assume good intent
- **Be honest** - Give credit where due; acknowledge mistakes
- **Respect privacy** - Don't share others' personal information

Unacceptable behavior includes harassment, discrimination, or abuse. Reports can be made in confidence to the project maintainers.

For our full Code of Conduct, see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) (if applicable).

## Questions or Need Help?

- **Setup issues** - Check `/app/QUICKSTART.md` for common solutions
- **Architecture questions** - See `/docs/` for detailed specifications
- **General questions** - Open a GitHub discussion

We're here to help! Don't hesitate to ask.

## Recognition

Contributors are recognized in:
- Pull request acknowledgments
- Release notes (for significant contributions)
- Contributors list in README.md

Thank you for making KnowledgeFlow better!

---

**Happy contributing!** We're excited to build this together.
