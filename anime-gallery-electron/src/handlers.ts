import * as electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export const selectFolder = async (_: any, __: any) => {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  const dirPath = filePaths[0];

  return !canceled && dirPath;
};

export const selectFile = async (
  _: electron.IpcMainInvokeEvent,
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
  _: electron.IpcMainInvokeEvent,
  __: any
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
