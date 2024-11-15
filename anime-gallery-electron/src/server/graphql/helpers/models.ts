import fs from 'fs';
import path from 'path';

/**
 * Recursively reads the contents of a directory and all its subdirectories.
 * @param {string} dirPath - The path of the directory to read.
 * @returns {Promise<fs.Dirent[]>} A promise resolving to an array of all the directories in the given directory and its subdirectories, with { withFileTypes: true }.
 */
export const readDirectoriesRecursively = async (
  dirPath: string
): Promise<fs.Dirent[]> => {
  let directories: fs.Dirent[] = [];

  try {
    // Read the current directory's content, with { withFileTypes: true }
    const list = await fs.promises.readdir(dirPath, { withFileTypes: true });

    // Loop through each item in the directory
    for (const item of list) {
      const fullPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        // If it's a directory, add it to the list
        directories.push(item);

        // Recursively read subdirectories
        const subDirFiles = await readDirectoriesRecursively(fullPath);
        directories = directories.concat(subDirFiles); // Merge subdirectories into the result
      }
    }
  } catch (error) {
    console.error('Error reading directories:', error);
    throw new Error('Unable to read directories');
  }

  return directories;
};
