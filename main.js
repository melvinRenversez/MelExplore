const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

console.log(__dirname);

function createWindow() {
  const win = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);


ipcMain.handle('getCurrentPath', async (event, arg) => {
  return __dirname ;
});

ipcMain.handle('getDirectoryContents', async (event, dirPath) => {
  const fs = require('fs').promises;

  const entries = await fs.readdir(dirPath);

  const result = await Promise.all(
    entries.map(async (name) => {
      const fullPath = require('path').join(dirPath, name);
      const stats = await fs.stat(fullPath);

      return {
        name,
        path: fullPath,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        size: stats.isFile() ? stats.size : "",
      };
    })
  );

  return result;
});