import * as electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export const selectFolder = async (events: any, args: any) => {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  const dirPath = filePaths[0];

  return !canceled && dirPath;
};

export const selectFile = async (
  events: electron.IpcMainInvokeEvent,
  extensions: any
) => {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'set of Dynamic extensions',
        extensions: extensions,
      },
    ],
  });
  return !canceled && filePaths[0];
};

export const selectFilesFromFolder = async (
  events: electron.IpcMainInvokeEvent,
  args: any
) => {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  const dirPath = filePaths[0];

  if (!!canceled) {
    return false;
  } else {
    const dirents: fs.Dirent[] = await fs.promises.readdir(dirPath, {
      withFileTypes: true,
    });
    return {
      folderPath: dirPath,
      data: dirents.map(dirent => path.join(dirPath, dirent.name)),
    };
  }
};
