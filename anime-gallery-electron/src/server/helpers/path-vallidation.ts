import path from 'path';
import fs from 'fs';
import si from 'systeminformation';
import isPathInside from 'is-path-inside';
import { Request, Response } from 'express';

const SAFE_ROOTS: string[] = [];
const BLOCKED = [
  '$Recycle.bin',
  'System Volume Information',
  'ProgramData',
  'Windows',
  'Program Files',
  'Recovery',
  'MSOCache',
  '$WinREAgent',
  'AppData',
  'pagefile.sys',
  'hiberfil.sys',
  'swapfile.sys',
  'bootmgr',
  'BOOTNXT',
];

type Result<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Initialize safe roots once on app startup.
 * Canonicalizes, dedupes, and excludes the system drive.
 */
export async function initSafeRoots(): Promise<void> {
  const disks = await si.fsSize();
  const systemDrive = (process.env.SystemDrive || 'C:').toUpperCase();

  const roots = new Set<string>();
  for (const d of disks) {
    if (!d.mount) continue;
    try {
      // Ensure trailing separator for consistent comparisons
      const candidate = d.mount.endsWith(path.sep)
        ? d.mount
        : d.mount + path.sep;
      if (candidate.toUpperCase().startsWith(systemDrive)) continue;
      const real = fs.realpathSync(candidate);
      // Normalize to platform-specific form and ensure trailing sep
      const normalized = real.endsWith(path.sep) ? real : real + path.sep;
      roots.add(normalized);
    } catch {
      // ignore mounts we cannot resolve
      continue;
    }
  }

  // Replace SAFE_ROOTS contents atomically
  SAFE_ROOTS.length = 0;
  SAFE_ROOTS.push(...Array.from(roots));
}

/**
 * Helper to check if a path contains any blocked segment.
 * Uses path segment comparison to avoid substring false positives.
 */
function containsBlockedSegment(canonicalPath: string): boolean {
  const parts = canonicalPath
    .split(path.sep)
    .filter(Boolean)
    .map(p => p.toLowerCase());
  for (const blocked of BLOCKED) {
    const b = blocked.toLowerCase();
    if (parts.includes(b)) return true;
  }
  return false;
}

/**
 * Validate a path string and return canonical absolute path or error.
 * - Rejects null bytes, control chars, overly long input
 * - Resolves symlinks and canonicalizes
 * - Ensures containment inside SAFE_ROOTS
 * - Checks blocked segments and existence
 */
export function validatePathText(requestPath: unknown): Result<string> {
  // Basic checks
  if (!Array.isArray(SAFE_ROOTS) || SAFE_ROOTS.length === 0) {
    return { success: false, error: 'Safe roots not initialized' };
  }
  if (typeof requestPath !== 'string') {
    return { success: false, error: 'File path is required' };
  }

  const raw = requestPath.trim();
  if (!raw) return { success: false, error: 'File path is required' };
  if (raw.length > 4096) return { success: false, error: 'Path too long' };
  if (raw.indexOf('\0') !== -1)
    return { success: false, error: 'Invalid path' };
  if (/[\x00-\x1F]/.test(raw)) return { success: false, error: 'Invalid path' };

  // Disallow UNC network paths on Windows explicitly
  if (raw.startsWith('\\\\'))
    return { success: false, error: 'Network paths not allowed' };

  // Resolve and canonicalize
  let canonical: string;
  try {
    canonical = fs.realpathSync(path.resolve(raw));
  } catch {
    return { success: false, error: 'File not found' };
  }

  // Normalize trailing separators off for file checks, but keep canonical form
  canonical = canonical.endsWith(path.sep) ? canonical.slice(0, -1) : canonical;

  // Blocked segments check
  if (containsBlockedSegment(canonical)) {
    return { success: false, error: 'Access Denied!' };
  }

  // Containment check: ensure canonical is inside at least one SAFE_ROOT
  let allowed = false;
  for (const root of SAFE_ROOTS) {
    try {
      // root is expected canonical and with trailing sep from initSafeRoots
      const canonicalRoot = fs.realpathSync(root);
      // Use path.relative to avoid substring pitfalls
      const rel = path.relative(canonicalRoot, canonical);
      if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
        allowed = true;
        break;
      }
      // fallback to isPathInside if you prefer
      if (isPathInside(canonical, canonicalRoot)) {
        allowed = true;
        break;
      }
    } catch {
      continue;
    }
  }
  if (!allowed) return { success: false, error: 'Access denied!' };

  // Existence check
  try {
    if (!fs.existsSync(canonical))
      return { success: false, error: 'File not found' };
  } catch {
    return { success: false, error: 'File not found' };
  }

  return { success: true, data: canonical };
}

/**
 * Express wrapper that uses validatePathText and returns HTTP responses.
 */
export const validatePathForExpress = (
  req: Request,
  res: Response
): string | Response => {
  if (!SAFE_ROOTS.length) {
    return res.status(500).send('Safe roots not initialized');
  }

  const requestPath = req.query.path;
  const result = validatePathText(requestPath as unknown);

  if (!result.success) {
    // Map some errors to appropriate HTTP codes
    const err = result.error.toLowerCase();
    if (err.includes('access')) return res.status(403).send(result.error);
    if (err.includes('required')) return res.status(400).send(result.error);
    return res.status(404).send(result.error);
  }

  return result.data;
};
