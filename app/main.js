const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

console.log(__dirname);

const extReadable = ['.txt', '.md', '.js', '.json', '.html', '.css'];

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.setMenuBarVisibility(false);

  win.loadFile('./public/index.html');
}

app.whenReady().then(createWindow);


ipcMain.handle('getCurrentPath', async (event, arg) => {
  return __dirname;
});

ipcMain.handle('getDirectoryContents', async (event, dirPath) => {
  const fs = require('fs').promises;

  const entries = await fs.readdir(dirPath);

  const result = await Promise.all(
    entries.map(async (name) => {
      const fullPath = require('path').join(dirPath, name);
      const stats = await fs.stat(fullPath);

      const ext = path.extname(name).toLowerCase();
      let readable = false;

      if (extReadable.includes(ext)) {
        readable = true;
      }

      return {
        name,
        path: fullPath,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        size: stats.isFile() ? stats.size : "",
        readable
      };
    })
  );

  return result;
});

ipcMain.handle('openFile', async (event, filePath) => {
  const fs = require('fs').promises;

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    throw err;
  }
});