// secure-path-validation.ts
import fs from 'fs';
import path from 'path';
import si from 'systeminformation';
import { Request, Response } from 'express';

export const SAFE_ROOTS: string[] = [];

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

export type Result<T> =
  | { success: true; data: T }
  | { success: false; code: ErrorCode; message: string };

enum ErrorCode {
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

export abstract class PathValidation {
  private readonly BLOCKED_FOLDERS = [
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
   * Split a canonical path into segments (lowercased) for blocked-segment checks.
   */
  private pathSegmentsLower(canonicalPath: string): string[] {
    const normalized = path.normalize(canonicalPath);
    return normalized
      .split(path.sep)
      .filter(Boolean)
      .map(s => s.toLowerCase());
  }

  /**
   * Check whether canonicalPath contains any blocked segment.
   */
  private containsBlockedSegment(canonicalPath: string): boolean {
    const parts = this.pathSegmentsLower(canonicalPath);
    for (const blocked of this.BLOCKED_FOLDERS) {
      const b = blocked.toLowerCase();
      if (parts.includes(b)) return true;
    }
    return false;
  }

  /**
   * Ensure canonicalPath is contained inside at least one SAFE_ROOT.
   */
  private isInsideSafeRoots(canonicalPath: string): boolean {
    if (!SAFE_ROOTS.length) return false;

    const normalizedPath = canonicalPath.endsWith(path.sep)
      ? canonicalPath.slice(0, -1)
      : canonicalPath;

    for (const root of SAFE_ROOTS) {
      try {
        const canonicalRoot = root.endsWith(path.sep)
          ? root.slice(0, -1)
          : root;
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
  protected async validatePathText(
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

    let canonical: string;
    try {
      canonical = await fs.promises.realpath(path.resolve(raw));
    } catch {
      return {
        success: false,
        code: ErrorCode.FILE_NOT_FOUND,
        message: 'File not found',
      };
    }

    canonical = canonical.endsWith(path.sep)
      ? canonical.slice(0, -1)
      : canonical;

    if (this.containsBlockedSegment(canonical)) {
      return {
        success: false,
        code: ErrorCode.ACCESS_DENIED,
        message: 'Access Denied',
      };
    }

    if (!this.isInsideSafeRoots(canonical)) {
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

  protected async validatePath(
    request: Request,
    response: Response
  ): Promise<string | Response> {
    if (!SAFE_ROOTS.length) {
      return response.status(500).send('Safe roots not initialized');
    }

    const requestPath = request.query.path;
    const result = await this.validatePathText(requestPath);

    if (!result.success) {
      switch (result.code) {
        case ErrorCode.ACCESS_DENIED:
          return response.status(403).send(result.message);
        case ErrorCode.INVALID_INPUT:
        case ErrorCode.PATH_TOO_LONG:
        case ErrorCode.INVALID_PATH:
        case ErrorCode.NETWORK_PATH_NOT_ALLOWED:
          return response.status(400).send(result.message);
        case ErrorCode.FILE_NOT_FOUND:
          return response.status(404).send(result.message);
        case ErrorCode.SAFE_ROOTS_NOT_INITIALIZED:
          return response.status(500).send(result.message);
        default:
          return response.status(400).send(result.message);
      }
    }

    return result.data;
  }
}
