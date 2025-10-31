/**
 * Main entry point for Tauri backend
 * Exports all IPC handlers for frontend communication
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { initDatabase, closeDatabase } from './storage/db';
import * as notesRepo from './storage/repo/notesRepo';
import * as tasksRepo from './storage/repo/tasksRepo';
import * as linksRepo from './storage/repo/linksRepo';
import * as settingsRepo from './storage/repo/settingsRepo';
import { registerHotkeys, unregisterHotkeys } from './system/hotkeys';
import { buildDailyDigest, formatDigest } from './system/digest';
import { buildSemanticLinks } from '../semantics/graph/linkEngine';
import { extractTodos } from '../semantics/extractors/todos';

let mainWindow: BrowserWindow | null = null;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Register global hotkeys
  registerHotkeys(mainWindow);
}

/**
 * Initialize the application
 */
app.whenReady().then(() => {
  // Initialize database
  initDatabase();

  // Create window
  createWindow();

  // Register IPC handlers
  registerIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * Cleanup on quit
 */
app.on('window-all-closed', () => {
  unregisterHotkeys();
  closeDatabase();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Register all IPC handlers for frontend communication
 */
function registerIpcHandlers() {
  // Notes handlers
  ipcMain.handle('notes:create', async (_, input) => {
    const note = notesRepo.createNote(input);

    // Auto-extract tasks if enabled
    const settings = settingsRepo.getSemanticSettings();
    if (settings.autoExtract) {
      const todos = extractTodos(note.body);
      for (const todo of todos) {
        tasksRepo.createTask({
          note_id: note.id,
          title: todo.text,
          status: todo.completed ? 'completed' : 'pending',
        });
      }
    }

    return note;
  });

  ipcMain.handle('notes:get', async (_, id) => {
    return notesRepo.getNote(id);
  });

  ipcMain.handle('notes:list', async (_, options) => {
    return notesRepo.listNotes(options);
  });

  ipcMain.handle('notes:update', async (_, id, updates) => {
    return notesRepo.updateNote(id, updates);
  });

  ipcMain.handle('notes:delete', async (_, id) => {
    return notesRepo.deleteNote(id);
  });

  ipcMain.handle('notes:search', async (_, query) => {
    return notesRepo.searchNotes(query);
  });

  // Tasks handlers
  ipcMain.handle('tasks:create', async (_, input) => {
    return tasksRepo.createTask(input);
  });

  ipcMain.handle('tasks:get', async (_, id) => {
    return tasksRepo.getTask(id);
  });

  ipcMain.handle('tasks:list', async (_, options) => {
    return tasksRepo.listTasks(options);
  });

  ipcMain.handle('tasks:update', async (_, id, updates) => {
    return tasksRepo.updateTask(id, updates);
  });

  ipcMain.handle('tasks:delete', async (_, id) => {
    return tasksRepo.deleteTask(id);
  });

  ipcMain.handle('tasks:complete', async (_, id) => {
    return tasksRepo.completeTask(id);
  });

  // Links handlers
  ipcMain.handle('links:get', async (_, noteId) => {
    return linksRepo.getLinksForNote(noteId);
  });

  ipcMain.handle('links:create', async (_, input) => {
    return linksRepo.upsertLink(input);
  });

  ipcMain.handle('links:delete', async (_, srcId, dstId) => {
    return linksRepo.deleteLink(srcId, dstId);
  });

  // Semantic links handlers
  ipcMain.handle('semantics:buildLinks', async (_, noteId) => {
    return buildSemanticLinks(noteId);
  });

  ipcMain.handle('semantics:extractTodos', async (_, text) => {
    return extractTodos(text);
  });

  // Settings handlers
  ipcMain.handle('settings:get', async (_, key) => {
    return settingsRepo.getSetting(key);
  });

  ipcMain.handle('settings:set', async (_, key, value) => {
    settingsRepo.setSetting(key, value);
    return true;
  });

  ipcMain.handle('settings:getAll', async () => {
    return settingsRepo.getAllSettings();
  });

  // Digest handler
  ipcMain.handle('digest:build', async () => {
    const digest = buildDailyDigest();
    return {
      data: digest,
      formatted: formatDigest(digest),
    };
  });
}

export { mainWindow };
