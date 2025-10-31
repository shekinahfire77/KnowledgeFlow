# KnowledgeFlow - Quick Start Guide

Welcome to KnowledgeFlow Stage 3! This guide will help you get the application running.

## Prerequisites

- Node.js 18+ installed
- pnpm 8+ installed (or npm/yarn)
- Git (optional)

## Installation Steps

### 1. Install Dependencies

```bash
cd "C:\Users\deadm\Desktop\Note Taking App\app"
pnpm install
```

This will install all required packages including:
- React and React Router
- better-sqlite3 for database
- compromise for NLP
- Vite for building
- Testing frameworks

### 2. Verify Installation

Check that TypeScript compiles without errors:

```bash
pnpm type-check
```

### 3. Run Development Server

Start the Vite development server:

```bash
pnpm dev
```

The application will be available at: http://localhost:5173

### 4. Seed the Database (Optional)

Populate the database with sample notes and tasks:

```bash
pnpm seed
```

This creates:
- 10 sample notes on various topics
- 5 sample tasks
- Semantic links between related notes

## Available Scripts

### Development
```bash
pnpm dev              # Start dev server (frontend only)
pnpm dev:tauri        # Start Tauri desktop app (Stage 4+)
```

### Building
```bash
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Testing
```bash
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
pnpm e2e              # Run end-to-end tests (Stage 4+)
```

### Code Quality
```bash
pnpm lint             # Check for linting errors
pnpm lint:fix         # Auto-fix linting errors
pnpm format           # Format code with Prettier
pnpm type-check       # Check TypeScript types
```

### Database
```bash
pnpm seed             # Seed database with sample data
```

## Project Structure

```
app/
├── src/
│   ├── main/         # Backend (Electron/Node)
│   ├── semantics/    # Semantic features (NLP, TF-IDF)
│   ├── ui/           # React frontend
│   └── tests/        # Test files
├── seed/             # Sample data
├── index.html        # Entry HTML
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite configuration
```

## Keyboard Shortcuts

(Once fully wired up in Stage 4)

- `Cmd/Ctrl + K` - Open command palette
- `Cmd/Ctrl + Shift + N` - Quick capture
- `Cmd/Ctrl + F` - Focus search
- `Cmd/Ctrl + N` - New note
- `Cmd/Ctrl + S` - Save note
- `Escape` - Close overlays

## Testing the Application

### Unit Tests

Run the extractor tests:

```bash
pnpm test
```

Expected output:
- ✅ Phrase extraction tests pass
- ✅ TODO extraction tests pass
- ⚠️ Repository tests are stubs (need database setup)

### Manual Testing

1. **Notes List**: Navigate to http://localhost:5173/
2. **Create Note**: Click "New Note" button
3. **Edit Note**: Enter title and body text
4. **Add Tags**: Type tag names and press Enter
5. **Quick Capture**: Press Cmd/Ctrl + Shift + N
6. **Command Palette**: Press Cmd/Ctrl + K

Note: Some features require backend connection (Stage 4)

## Common Issues

### Port Already in Use

If port 5173 is busy:

```bash
# Edit vite.config.ts and change port
server: {
  port: 5174,  // Change to different port
}
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
pnpm type-check
```

### Database Locked

```bash
# Close any SQLite connections and restart
# Database file is in: %APPDATA%/knowledgeflow.db
```

## Development Workflow

### Making Changes

1. Edit files in `src/`
2. Vite will hot-reload automatically
3. Check browser for updates
4. Run tests: `pnpm test`
5. Check types: `pnpm type-check`
6. Format code: `pnpm format`

### Adding New Features

1. Create component/module file
2. Add tests in `src/tests/`
3. Update exports if needed
4. Document in code comments
5. Run full test suite

### Debugging

#### Frontend
- Open browser DevTools (F12)
- Check Console for errors
- Use React DevTools extension

#### Backend (Stage 4+)
- Check Electron main process logs
- Use Node.js debugger
- Add console.log statements

## Next Steps

### Stage 3 (Current)
- [x] All source files created
- [x] Application scaffold complete
- [x] Test infrastructure ready
- [ ] Verify all features work

### Stage 4 (Next)
- [ ] Wire up IPC communication
- [ ] Connect frontend to backend
- [ ] Implement graph visualization
- [ ] Add real encryption
- [ ] Complete E2E tests

### Stage 5 (Polish)
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Documentation
- [ ] Packaging and distribution

## Getting Help

### Resources
- Source code documentation: `src/README.md`
- Implementation details: `STAGE3_IMPLEMENTATION.md`
- Architecture docs: `/docs/` directory

### Troubleshooting
1. Check console for error messages
2. Verify all dependencies installed
3. Ensure Node.js version is 18+
4. Try clearing node_modules and reinstalling

## Contributing

When adding new code:
1. Follow TypeScript strict mode
2. Add type annotations
3. Write tests for new features
4. Update documentation
5. Run linter and formatter
6. Check types compile

## License

MIT License - See LICENSE file for details

---

**Happy Coding!** 🚀

For questions or issues, check the documentation in `/docs/` or create an issue.
