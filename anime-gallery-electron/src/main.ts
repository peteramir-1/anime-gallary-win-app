import electron from 'electron';
import { setupTitlebar} from 'custom-electron-titlebar/main';
import path from 'path';
import * as handlers from './handlers';

import { ApplicationServer } from './server/app';
import { serverPort } from './server/config/env';

const applicationServer = new ApplicationServer();

// Electron titlebar
setupTitlebar();
electron.Menu?.setApplicationMenu(null);

const createWindow = () => {
  const mainWindow = new electron.BrowserWindow({
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    movable: false,
    fullscreen: false,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.maximize();
  mainWindow.setResizable(false);
  mainWindow.setMovable(false);
  mainWindow.addListener('will-move', event => {
    event.preventDefault();
  });
  mainWindow.addListener('move', () => {
    mainWindow.maximize();
  });
  mainWindow.addListener('moved', () => {
    mainWindow.maximize();
  });
  setTimeout(() => {
    mainWindow.focus();
  }, 1000);
  mainWindow.loadURL(`http://localhost:${serverPort}/`);
  return mainWindow;
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) electron.app.quit();
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.on('ready', () => {
  electron.ipcMain.handle('selectFolder', handlers.selectFolder);
  electron.ipcMain.handle('selectFile', handlers.selectFile);
  electron.ipcMain.handle(
    'selectFilesFromFolder',
    handlers.selectFilesFromFolder
  );
  applicationServer.start().then(() => {
    const mainWindow = createWindow();
    electron.globalShortcut.register('Control+R', () => {
      mainWindow.reload();
    });
    electron.globalShortcut.register('Control+Shift+I', () => {
      mainWindow.webContents.openDevTools();
    });
    electron.globalShortcut.register('Alt+F4', () => {
      applicationServer.close().then(() => {
        electron.app.quit();
      });
    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    applicationServer.close().then(() => {
      electron.app.quit();
    });
  }
});

electron.app.on('activate', () => {
  electron.ipcMain.handle('selectFolder', handlers.selectFolder);
  electron.ipcMain.handle('selectFile', handlers.selectFile);
  electron.ipcMain.handle(
    'selectFilesFromFolder',
    handlers.selectFilesFromFolder
  );
  createWindow();
});
