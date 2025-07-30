import { BrowserWindow, ipcMain } from "electron";

export const registerLogoutHandler = () => {
  ipcMain.on('logout', () => {
    BrowserWindow.getAllWindows().forEach(window => {
      if (window.webContents) {
        window.webContents.send('logout-event');
        // Option 1: Close all windows except the focused one
        if (window !== BrowserWindow.getFocusedWindow()) {
          window.close();
        }

        // Option 2 (better): Use a custom property
        // if (!(window as any).isPrimary) {
        //   window.close();
        // }
      }
    });
  });
};

export const destroyLogoutHandler = () => {
  ipcMain.removeAllListeners('logout');
};
