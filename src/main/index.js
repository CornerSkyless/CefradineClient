import { app, BrowserWindow,ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
      height: 400,
      width:450,
      frame: false,
      titleBarStyle: 'hidden-inset',
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

ipcMain.on('set-window-of-login',()=>{
    mainWindow.setMinimumSize(450,400);

    mainWindow.setSize(450,400,true);
    mainWindow.setResizable(false);
});

ipcMain.on('set-window-of-app',()=>{
    mainWindow.setMinimumSize(750,500);
    mainWindow.setSize(800,500,true);
    mainWindow.setResizable(true);
});

ipcMain.on('window-min',()=>{
    mainWindow.minimize();
});

ipcMain.on('window-max',()=>{
    mainWindow.maximize();
});

ipcMain.on('window-close',()=>{
    app.quit();
});

ipcMain.on('open-url',(event,url)=>{
    let window = new BrowserWindow({
        height: 900,
        width:1200,
    });
    window.loadURL(url);

});




/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
