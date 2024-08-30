// @ts-nocheck

const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
//var Terminal = require('xterm').Terminal;
const pty = require("node-pty");
const os = require("os");
const fs = require("fs");

const { useEffect } = require("react");

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
      vibrancy: "ultra-dark",
      //nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.maximize();
};
// mainWindow.webContents.openDevTools();

app.on("ready", createWindow);

let count = 0;
let row = 0;
let col = 0;
let ptyProcess;

// race condition --> what is loading terminal needs to be connected
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
  console.log("creating new instance");
});

ipcMain.handle("prepare-input", (event, terminalInfo) => {
  ptyProcess.onData((data) => {
    mainWindow.webContents.send("pty-data", data);
  });
});

ipcMain.handle("user-input", (event, input) => {
  ptyProcess.write(input);
});

ipcMain.handle("save-file", (event, fileToSave, code) => {
  console.log(fileToSave);
  console.log(code);
  fs.writeFileSync(fileToSave, code);
});

ipcMain.handle("get-directory", async (event, path) => {
  try {
    const files = await readdirS(path);
    return files;
  } catch (error) {
    return error.message;
  }
});

async function readdirS(path) {
  console.log("reading");
  return await fs.promises.readdir(path, {
    encoding: "utf-8",
    withFileTypes: true,
  });
}

function isDirectory(path) {
  return fs.lstatSync(path).isDirectory();
}

ipcMain.handle("get-code", async (event, filePath) => {
  if (isDirectory(filePath)) {
    console.log("directory");
    try {
      const files = await readdirS(filePath);
      console.log(files);
      //event.reply("directory-contentsInside", files);
      return files;
    } catch (error) {
      console.log("error here");
      //event.reply("directory-error", + error.message);
      return error.message;
    }
  } else {
    var buffer = fs.readFileSync(filePath);
    return buffer.toString();
    //event.reply("extracted-code", buffer.toString());
  }
});

const waitForFile = (filePath, timeout = 10000, interval = 100) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkFileExists = () => {
      if (fs.existsSync(filePath)) {
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for file to be created"));
      } else {
        setTimeout(checkFileExists, interval);
      }
    };

    checkFileExists();
  });
};

ipcMain.handle("get-vcd", async (event, filePath, folderPath) => {
  console.log(filePath);
  const shell = process.env[os.platform() === "win32" ? "COMSPEC" : "SHELL"];
  const pt = pty.spawn(shell, [], {
    name: "vcd-generator",
    cols: col,
    rows: row,
    cwd: folderPath,
    env: process.env,
  });

  // this will allow us to run different scripts, build different waveforms
  const extension = filePath.split(".").pop();
  const slashIdx = filePath.lastIndexOf("/") + 1;

  // Find the index of the dot to get the end index
  const dotIdx = filePath.lastIndexOf(".");

  // Extract the name
  let fileName = filePath.substring(slashIdx);
  let name = filePath.substring(slashIdx, dotIdx);
  console.log("file name is:" + name);
  // const files = await readdirS(folderPath);

  pt.onData((data) => {
    console.log("data is " + data);
  });

  /* Example commands:
  iverilog -g2012 -o simple.out simple.sv
  pt.write("iverilog -g2012 -o example.out example_tb.sv example.sv \r");
  pt.write("iverilog -g2012 -o example.out example_tb.sv example.sv \r");
  */

  pt.write("iverilog -g2012 -o " + name + ".out " + fileName + " \r");
  pt.write("vvp " + name + ".out \r");

  try {
    // Use app.getAppPath() to get the root of your application
    const projectRoot = app.getAppPath();
    const vcdPath = path.join(projectRoot, "src", "test", name + ".vcd");
    console.log(vcdPath);

    console.log("Attempting to read file at:", vcdPath);

    await waitForFile(vcdPath, 10000, 500);

    if (fs.existsSync(vcdPath)) {
      console.log("File exists");
      const vcdContent = await fs.promises.readFile(vcdPath, "utf8");
      return vcdContent;
    } else {
      console.log("File does not exist");
      throw new Error("VCD file not found");
    }
  } catch (error) {
    console.error("Error reading VCD file:", error);
    throw error;
  }
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
