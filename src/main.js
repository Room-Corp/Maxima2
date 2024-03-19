const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
//var Terminal = require('xterm').Terminal;
const pty = require("node-pty");
const os = require("os");
const fs = require('fs');


// Initialize node-pty with an appropriate shell
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      //nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

// xtermTerminal.onData(data => ptyProcess.write(data));
// ptyProcess.on('data', function (data) {
// xtermTerminal.write(data);
// });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
let count = 0;
let row = 0;
let col = 0;
let ptyProcess;
ipcMain.on("asynchronous-message", (event, terminalInfo) => {
  row = terminalInfo.rows;
  col = terminalInfo.cols;
  const shell = process.env[os.platform() === "win32" ? "COMSPEC" : "SHELL"];
 ptyProcess = pty.spawn(shell, [], {
  name: "xterm-color",
  cols: col,
  rows: row,
  cwd: process.env.HOME,
  env: process.env,
});

});
ipcMain.on("prepare-input", (event, terminalInfo) => {

  ptyProcess.onData((data) => {
    mainWindow.webContents.send("pty-data", data);
    console.log("data is " + data)
  });
  

});

ipcMain.on("user-input", (event, input) => {
  ptyProcess.write(input);
});




ipcMain.on("save-file", (event, fileToSave, code) => {
  console.log(fileToSave);
  console.log(code);
  fs.writeFileSync(fileToSave, code);

});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
