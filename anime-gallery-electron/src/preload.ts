import * as electron from 'electron';
import * as customElectronTitlebar from 'custom-electron-titlebar';

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation
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
  selectFolder<T>(): Promise<T> {
    return electron.ipcRenderer.invoke('selectFolder');
  },
  selectFile<T>(extensions: string[]): Promise<T> {
    return electron.ipcRenderer.invoke('selectFile', extensions);
  },
  selectFilesFromFolder<T>(): Promise<T> {
    return electron.ipcRenderer.invoke('selectFilesFromFolder');
  },
};

// window.api
electron.contextBridge.exposeInMainWorld('api', WINDOW_API);
