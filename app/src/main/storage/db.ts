/**
 * Database initialization and connection management
 * Uses better-sqlite3 for synchronous SQLite operations
 */

import Database from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let db: Database.Database | null = null;

/**
 * Get the database file path
 * Stores in user data directory
 */
function getDbPath(): string {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'knowledgeflow.db');
}

/**
 * Initialize the database connection and run migrations
 */
export function initDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = getDbPath();
  console.log(`Initializing database at: ${dbPath}`);

  // Ensure directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Create database connection
  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  // Run migrations
  runMigrations(db);

  return db;
}

/**
 * Run database migrations
 */
function runMigrations(database: Database.Database): void {
  // Check if migrations table exists
  const tableExists = database
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'")
    .get();

  if (!tableExists) {
    // Create migrations tracking table
    database.exec(`
      CREATE TABLE migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  // Get applied migrations
  const appliedMigrations = database
    .prepare('SELECT name FROM migrations')
    .all()
    .map((row: any) => row.name);

  // Migration files to apply
  const migrations = [
    {
      name: '0001_init',
      sql: fs.readFileSync(
        path.join(__dirname, 'migrations', '0001_init.sql'),
        'utf-8'
      ),
    },
  ];

  // Apply pending migrations
  for (const migration of migrations) {
    if (!appliedMigrations.includes(migration.name)) {
      console.log(`Applying migration: ${migration.name}`);

      database.transaction(() => {
        database.exec(migration.sql);
        database
          .prepare('INSERT INTO migrations (name) VALUES (?)')
          .run(migration.name);
      })();

      console.log(`Migration ${migration.name} applied successfully`);
    }
  }
}

/**
 * Get the database instance
 * Initializes if not already initialized
 */
export function getDatabase(): Database.Database {
  if (!db) {
    return initDatabase();
  }
  return db;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Execute a query with error handling
 */
export function executeQuery<T>(
  query: string,
  params: any[] = []
): T[] {
  try {
    const database = getDatabase();
    return database.prepare(query).all(...params) as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a single-row query
 */
export function executeQueryOne<T>(
  query: string,
  params: any[] = []
): T | undefined {
  try {
    const database = getDatabase();
    return database.prepare(query).get(...params) as T | undefined;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute an insert/update/delete query
 */
export function executeRun(
  query: string,
  params: any[] = []
): Database.RunResult {
  try {
    const database = getDatabase();
    return database.prepare(query).run(...params);
  } catch (error) {
    console.error('Database run error:', error);
    throw error;
  }
}
