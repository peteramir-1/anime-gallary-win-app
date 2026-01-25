import fs from 'fs';
import path from 'path';
import { PathValidation } from '../../helpers/path-vallidation';

export class DirectoryDataHandler extends PathValidation {
  async readDirectoriesRecursively(rootPath: string): Promise<fs.Dirent[]> {
    const result: fs.Dirent[] = [];
    const visited = new Set<string>();
    const stack: string[] = [];

    const rootValidation = await this.validatePathText(rootPath);
    if (!rootValidation.success) throw new Error(rootValidation.message);

    stack.push(rootValidation.data);

    while (stack.length) {
      const current = stack.pop() as string;
      if (visited.has(current)) continue;
      visited.add(current);

      let entries: fs.Dirent[];
      try {
        // read directory entries with Dirent objects
        entries = await fs.promises.readdir(current, { withFileTypes: true });
      } catch {
        // unreadable directory, skip it
        continue;
      }

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const childRaw = path.join(current, entry.name);

        // Validate child path (ensures canonicalization and containment)
        const childValidation = await this.validatePathText(childRaw);
        if (!childValidation.success) {
          // skip invalid/disallowed child
          continue;
        }

        const canonicalChild = childValidation.data;
        if (visited.has(canonicalChild)) continue;

        // Push the Dirent object representing the directory into the result.
        // Note: Dirent does not include the full path; callers can combine entry.name with the parent path if needed.
        result.push(entry);

        // Continue traversal using the canonical child path
        stack.push(canonicalChild);
      }
    }

    return result;
  }
}
