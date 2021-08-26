const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
autoUpdater.setFeedURL('https://github.com/Nareneder/demo-app/releases')

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
	   contextIsolation: false,
    },
  });
  /* mainWindow.once('ready-to-show', () => {
	autoUpdater.checkForUpdates();
  }); */
  mainWindow.loadFile('src/gui/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}


app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
if (process.env.NODE_ENV !== 'development') {
    autoUpdater.setFeedURL({
      provider: 'github',
      repo: 'demo-app',
      owner: 'Nareneder',
      private: true,
      token: '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'
    });
    autoUpdater.checkForUpdates();
  }
 autoUpdater.on('update-downloaded', (updateInfo) => {
    log.info(`autoUpdater - Version ${updateInfo.version} downloaded, notify, quitting, installing, and relaunching`);

    const notification = new Notification({
      title: `Restarting Command E`,
      body: `Updating to version ${updateInfo.version}`,
    });
    notification.show();

    setTimeout(() => {
      log.info(`autoUpdater - Quitting and installing now`);
      autoUpdater.quitAndInstall();
    }, 3000);
  });