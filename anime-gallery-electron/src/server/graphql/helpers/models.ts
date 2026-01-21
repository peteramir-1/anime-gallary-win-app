import fs from 'fs';
import path from 'path';

const excludedFolderNames = [
  // Root Directory System Folders
  '$Recycle.bin', // Recyle bin data for the drive
  'System Volume Information', // System Restore points and indexing
  'ProgramData', // Shared application data for all users
  'Recovery', // Windows Recovery Environment (WinRE) data
  'MSOCache', // Microsoft Office local installation source
  '$WinREAgent', // Created during Windows updates for recovery

  // User Profile Hidden Folders
  'AppData', // User-specific app settings (Local, LocalLow, Roaming)

  // Hidden System Files (Root)
  'pagefile.sys', // Virtual memory paging file
  'hiberfil.sys', // Hibernation state data
  'swapfile.sys', // Virtual memory for universal apps
  'bootmgr', // Windows Boot Manager
  'BOOTNXT', // Boot loader component
];

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
      const isExcluded = excludedFolderNames.some(
        excluded =>
          excluded.toUpperCase() === item.name.toUpperCase() ||
          excluded.toUpperCase().endsWith('\\' + item.name.toUpperCase())
      );

      if (isExcluded) {
        continue;
      }

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
