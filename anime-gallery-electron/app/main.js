"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const customElectronTitleBar = require("custom-electron-titlebar/main");
const path = require("path");
const handlers = require("./handlers");
const app = require("./servers/frontend/app");
customElectronTitleBar.setupTitlebar();
(_a = electron.Menu) === null || _a === void 0 ? void 0 : _a.setApplicationMenu(null);
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
    mainWindow.addListener('will-move', (event) => {
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
    mainWindow.loadURL(`http://localhost:${app.PORT}/`);
    return mainWindow;
};
if (require('electron-squirrel-startup'))
    electron.app.quit();
electron.app.on('ready', () => {
    electron.ipcMain.handle('selectFolder', handlers.selectFolder);
    electron.ipcMain.handle('selectFile', handlers.selectFile);
    electron.ipcMain.handle('selectFilesFromFolder', handlers.selectFilesFromFolder);
    app.startFrontendServer(() => {
        const mainWindow = createWindow();
        electron.globalShortcut.register('Control+R', () => {
            mainWindow.reload();
        });
        electron.globalShortcut.register('Control+Shift+I', () => {
            mainWindow.webContents.openDevTools();
        });
        electron.globalShortcut.register('Alt+F4', () => {
            (0, app.closeFrontendServer)();
            electron.app.quit();
        });
    });
});
electron.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.closeFrontendServer();
        electron.app.quit();
    }
});
electron.app.on('activate', () => {
    electron.ipcMain.handle('selectFolder', handlers.selectFolder);
    electron.ipcMain.handle('selectFile', handlers.selectFile);
    electron.ipcMain.handle('selectFilesFromFolder', handlers.selectFilesFromFolder);
    createWindow();
});
//# sourceMappingURL=main.js.map