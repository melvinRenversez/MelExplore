const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getCurrentPath: () => ipcRenderer.invoke('getCurrentPath'),
  getDirectoryContents: (dirPath) => ipcRenderer.invoke('getDirectoryContents', dirPath)
});