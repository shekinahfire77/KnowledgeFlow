/**
 * Cryptographic utilities for note encryption
 * Stub implementation for Stage 3 - will be fully implemented in later stages
 */

/**
 * Encrypt note content (stub)
 * Future: Will use AES-256-GCM with user-provided key
 */
export function encryptNote(content: string, key: string): Buffer {
  // TODO: Implement actual encryption in Stage 4
  console.warn('Encryption not yet implemented - storing in plaintext');
  return Buffer.from(content, 'utf-8');
}

/**
 * Decrypt note content (stub)
 * Future: Will decrypt AES-256-GCM encrypted content
 */
export function decryptNote(encrypted: Buffer, key: string): string {
  // TODO: Implement actual decryption in Stage 4
  return encrypted.toString('utf-8');
}

/**
 * Generate encryption key from password (stub)
 * Future: Will use PBKDF2 or Argon2
 */
export function deriveKey(password: string, salt: string): string {
  // TODO: Implement proper key derivation in Stage 4
  return password;
}

/**
 * Check if encryption is available
 */
export function isEncryptionAvailable(): boolean {
  // For Stage 3, encryption is not yet available
  return false;
}
