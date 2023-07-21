"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
const customElectronTitlebar = require("custom-electron-titlebar");
window.addEventListener('DOMContentLoaded', () => {
    new customElectronTitlebar.Titlebar({
        containerOverflow: 'auto',
        backgroundColor: customElectronTitlebar.TitlebarColor.fromHex('#171717'),
        tooltips: {
            minimize: 'Minimize',
            maximize: 'Maximize',
            restoreDown: 'Restore',
            close: 'Close',
        },
    });
});
const WINDOW_API = {
    selectFolder() {
        return electron.ipcRenderer.invoke('selectFolder');
    },
    selectFile(extensions) {
        return electron.ipcRenderer.invoke('selectFile', extensions);
    },
    selectFilesFromFolder() {
        return electron.ipcRenderer.invoke('selectFilesFromFolder');
    },
};
electron.contextBridge.exposeInMainWorld('api', WINDOW_API);
//# sourceMappingURL=preload.js.map