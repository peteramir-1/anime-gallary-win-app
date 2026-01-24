import fs from 'fs';
import path from 'path';
import { validatePathText } from '../../helpers/path-vallidation';

// /**
//  * Recursively reads the contents of a directory and all its subdirectories.
//  * @param {string} dirPath - The path of the directory to read.
//  * @returns {Promise<fs.Dirent[]>} A promise resolving to an array of all the directories in the given directory and its subdirectories, with { withFileTypes: true }.
//  */
// export const readDirectoriesRecursively = async (
//   dirPath: string
// ): Promise<fs.Dirent[]> => {
//   let directories: fs.Dirent[] = [];

//   try {
//     const sanitizedPath = await validatePathText(dirPath);

//     if (sanitizedPath.success === false) throw new Error(sanitizedPath.message);

//     // Read the current directory's content, with { withFileTypes: true }
//     const list = await fs.promises.readdir(sanitizedPath.data, {
//       withFileTypes: true,
//     });

//     // Loop through each item in the directory
//     for (const item of list) {
//       const fullPath = path.join(sanitizedPath.data, item.name);

//       const sanitizedSubPath = await validatePathText(fullPath);

//       if (sanitizedSubPath.success === false) {
//         continue;
//       }

//       if (item.isDirectory()) {
//         // If it's a directory, add it to the list
//         directories.push(item);

//         // Recursively read subdirectories
//         const subDirFiles = await readDirectoriesRecursively(fullPath);
//         directories = directories.concat(subDirFiles); // Merge subdirectories into the result
//       }
//     }
//   } catch (error) {
//     console.error('Error reading directories:', error);
//     throw new Error('Unable to read directories');
//   }

//   return directories;
// };

/**
 * Directory traversal helper that returns canonical directory paths and uses structured errors internally.
 */
export async function readDirectoriesRecursivelySafe(
  rootPath: string
): Promise<fs.Dirent[]> {
  const result: fs.Dirent[] = [];
  const visited = new Set<string>();
  const stack: string[] = [];

  const rootValidation = await validatePathText(rootPath);
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
      const childValidation = await validatePathText(childRaw);
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
