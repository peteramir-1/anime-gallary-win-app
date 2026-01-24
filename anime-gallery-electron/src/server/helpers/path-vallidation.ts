// secure-path-validation.ts
import fs from 'fs';
import path from 'path';
import si from 'systeminformation';
import { Request, Response } from 'express';

export enum ErrorCode {
  SAFE_ROOTS_NOT_INITIALIZED = 'SAFE_ROOTS_NOT_INITIALIZED',
  INVALID_INPUT = 'INVALID_INPUT',
  PATH_TOO_LONG = 'PATH_TOO_LONG',
  INVALID_PATH = 'INVALID_PATH',
  NETWORK_PATH_NOT_ALLOWED = 'NETWORK_PATH_NOT_ALLOWED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  UNABLE_TO_OPEN = 'UNABLE_TO_OPEN',
  RACE_DETECTED = 'RACE_DETECTED',
  UNREADABLE_DIRECTORY = 'UNREADABLE_DIRECTORY',
  UNKNOWN = 'UNKNOWN',
}

export type Result<T> =
  | { success: true; data: T }
  | { success: false; code: ErrorCode; message: string };

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

/**
 * Initialize safe roots once on app startup.
 * - Uses async APIs
 * - Canonicalizes, dedupes, normalizes trailing separators
 * - Excludes the system drive
 */
export async function initSafeRoots(): Promise<void> {
  const disks = await si.fsSize();
  const systemDrive = (process.env.SystemDrive || 'C:').toUpperCase();

  const roots = new Set<string>();

  for (const d of disks) {
    if (!d.mount) continue;
    try {
      const candidate = d.mount.endsWith(path.sep)
        ? d.mount
        : d.mount + path.sep;
      if (candidate.toUpperCase().startsWith(systemDrive)) continue;
      const real = await fs.promises.realpath(candidate);
      const normalized = real.endsWith(path.sep) ? real : real + path.sep;
      roots.add(normalized);
    } catch {
      continue;
    }
  }

  SAFE_ROOTS.length = 0;
  SAFE_ROOTS.push(...Array.from(roots));
}

/**
 * Split a canonical path into segments (lowercased) for blocked-segment checks.
 */
function pathSegmentsLower(canonicalPath: string): string[] {
  const normalized = path.normalize(canonicalPath);
  return normalized
    .split(path.sep)
    .filter(Boolean)
    .map(s => s.toLowerCase());
}

/**
 * Check whether canonicalPath contains any blocked segment.
 */
function containsBlockedSegment(canonicalPath: string): boolean {
  const parts = pathSegmentsLower(canonicalPath);
  for (const blocked of BLOCKED) {
    const b = blocked.toLowerCase();
    if (parts.includes(b)) return true;
  }
  return false;
}

/**
 * Ensure canonicalPath is contained inside at least one SAFE_ROOT.
 */
function isInsideSafeRoots(canonicalPath: string): boolean {
  if (!SAFE_ROOTS.length) return false;

  const normalizedPath = canonicalPath.endsWith(path.sep)
    ? canonicalPath.slice(0, -1)
    : canonicalPath;

  for (const root of SAFE_ROOTS) {
    try {
      const canonicalRoot = root.endsWith(path.sep) ? root.slice(0, -1) : root;
      const rel = path.relative(canonicalRoot, normalizedPath);
      if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * Validate a path string and return canonical absolute path or structured error.
 */
export async function validatePathText(
  requestPath: unknown
): Promise<Result<string>> {
  if (!Array.isArray(SAFE_ROOTS) || SAFE_ROOTS.length === 0) {
    return {
      success: false,
      code: ErrorCode.SAFE_ROOTS_NOT_INITIALIZED,
      message: 'Safe roots not initialized',
    };
  }

  if (typeof requestPath !== 'string') {
    return {
      success: false,
      code: ErrorCode.INVALID_INPUT,
      message: 'File path is required',
    };
  }

  const raw = requestPath.trim();
  if (!raw) {
    return {
      success: false,
      code: ErrorCode.INVALID_INPUT,
      message: 'File path is required',
    };
  }
  if (raw.length > 4096) {
    return {
      success: false,
      code: ErrorCode.PATH_TOO_LONG,
      message: 'Path too long',
    };
  }
  if (raw.indexOf('\0') !== -1 || /[\x00-\x1F]/.test(raw)) {
    return {
      success: false,
      code: ErrorCode.INVALID_PATH,
      message: 'Invalid path',
    };
  }

  if (raw.startsWith('\\\\')) {
    return {
      success: false,
      code: ErrorCode.NETWORK_PATH_NOT_ALLOWED,
      message: 'Network paths not allowed',
    };
  }

  let canonical: string | null = null;

  // Resolve the requested path only within the configured SAFE_ROOTS.
  // This avoids interpreting user input relative to process.cwd() and
  // ensures that canonicalization and containment checks are tied to the
  // allowed root directories.
  for (const root of SAFE_ROOTS) {
    try {
      const candidate = await fs.promises.realpath(path.resolve(root, raw));
      const normalizedCandidate = candidate.endsWith(path.sep)
        ? candidate.slice(0, -1)
        : candidate;

      if (containsBlockedSegment(normalizedCandidate)) {
        continue;
      }

      if (!isInsideSafeRoots(normalizedCandidate)) {
        continue;
      }

      // Found a canonical, allowed path within one of the SAFE_ROOTS.
      canonical = normalizedCandidate;
      break;
    } catch {
      // Ignore candidates that do not exist under this root.
      continue;
    }
  }

  if (!canonical) {
    return {
      success: false,
      code: ErrorCode.ACCESS_DENIED,
      message: 'Access denied',
    };
  }

  try {
    await fs.promises.access(canonical, fs.constants.F_OK);
  } catch {
    return {
      success: false,
      code: ErrorCode.FILE_NOT_FOUND,
      message: 'File not found',
    };
  }

  return { success: true, data: canonical };
}

/**
 * Validate and open a file atomically to mitigate TOCTOU.
 */
export async function validateAndOpenFile(
  requestPath: unknown
): Promise<Result<{ path: string; fd: fs.promises.FileHandle }>> {
  const v = await validatePathText(requestPath);
  if (!v.success) return { success: false, code: v.code, message: v.message };

  const canonical = v.data;
  let fh: fs.promises.FileHandle | null = null;
  try {
    fh = await fs.promises.open(canonical, 'r');

    const [fstat, statPath] = await Promise.all([
      fh.stat(),
      fs.promises.stat(canonical),
    ]);

    const devMatch =
      typeof fstat.dev !== 'undefined' && typeof statPath.dev !== 'undefined'
        ? fstat.dev === statPath.dev
        : true;
    const inoMatch =
      typeof fstat.ino !== 'undefined' && typeof statPath.ino !== 'undefined'
        ? fstat.ino === statPath.ino
        : true;

    if (!(devMatch && inoMatch)) {
      await fh.close();
      return {
        success: false,
        code: ErrorCode.RACE_DETECTED,
        message: 'Race detected or file changed during validation',
      };
    }

    return { success: true, data: { path: canonical, fd: fh } };
  } catch {
    if (fh) {
      try {
        await fh.close();
      } catch {
        /* ignore */
      }
    }
    return {
      success: false,
      code: ErrorCode.UNABLE_TO_OPEN,
      message: 'Unable to open file',
    };
  }
}

/**
 * Express wrapper that uses validatePathText and maps structured errors to HTTP responses.
 */
export const validatePathForExpress = async (
  req: Request,
  res: Response
): Promise<string | Response> => {
  if (!SAFE_ROOTS.length) {
    return res.status(500).send('Safe roots not initialized');
  }

  const requestPath = req.query.path;
  const result = await validatePathText(requestPath);

  if (!result.success) {
    switch (result.code) {
      case ErrorCode.ACCESS_DENIED:
        return res.status(403).send(result.message);
      case ErrorCode.INVALID_INPUT:
      case ErrorCode.PATH_TOO_LONG:
      case ErrorCode.INVALID_PATH:
      case ErrorCode.NETWORK_PATH_NOT_ALLOWED:
        return res.status(400).send(result.message);
      case ErrorCode.FILE_NOT_FOUND:
        return res.status(404).send(result.message);
      case ErrorCode.SAFE_ROOTS_NOT_INITIALIZED:
        return res.status(500).send(result.message);
      default:
        return res.status(400).send(result.message);
    }
  }

  return result.data;
};
