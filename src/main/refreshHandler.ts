import { BrowserWindow, ipcMain } from "electron";

interface CustomBrowserWindow extends BrowserWindow {
  isPrimary?: boolean;
}

export const registerRefreshHandler = () => {
  ipcMain.on('refresh-all', () => {
    BrowserWindow.getAllWindows().forEach(window => {
      if (window.webContents) {
        window.webContents.reload();
      }
    });
  });

  ipcMain.on('refresh-primary', () => {
    BrowserWindow.getAllWindows().forEach(window => {
      const win = window as CustomBrowserWindow;
      if (win.isPrimary && win.webContents) {
        win.webContents.reload();
      }
    });
  });
};

export const destroyRefreshHandler = () => {
  ipcMain.removeAllListeners('refresh-all');
  ipcMain.removeAllListeners('refresh-primary');
};
