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

ipcMain.on("modify-div", (event, divId) => {
  // console.log("print working");
  // const webContents = event.sender;
  // webContents.executeJavaScript(`
  //   const divElement = document.getElementById('${divId}');
  //   console.log("Hello!");
  //   divElement.style.backgroundColor = "red";
  // `);
});
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
  mainWindow.maximize();
};

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
  console.log("creating new instance");
});

// invoke handle? -- definitley
ipcMain.handle("prepare-input", (event, terminalInfo) => {
  ptyProcess.onData((data) => {
    mainWindow.webContents.send("pty-data", data);
    // console.log("data is " + data);
  });
});

// switch to invoke handle
ipcMain.handle("user-input", (event, input) => {
  ptyProcess.write(input);
});

// invoke handle
ipcMain.handle("save-file", (event, fileToSave, code) => {
  console.log(fileToSave);
  console.log(code);
  fs.writeFileSync(fileToSave, code);
});

// switch to invoke handle
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

function getTestbenchFilename(files, currentFileName) {
  // Regular expression to match "testbench", "tb", and the current file name
  const regex = new RegExp(`^${currentFileName}.*(testbench|tb)`, "i"); // "i" flag for case-insensitive matching

  // Iterate over each file name
  for (let i = 0; i < files.length; i++) {
    console.log(files[i].name);
    // Check if the current file name matches the regular expression
    if (regex.test(files[i].name)) {
      return files[i].name; // Return the matching file name
    }
  }

  // Return null if none of the file names contain "testbench", "tb", or the current file name
  return "not found";
}
ipcMain.handle("get-vcd-content", async () => {
  try {
    // Use app.getAppPath() to get the root of your application
    const projectRoot = app.getAppPath();
    const vcdPath = path.join(projectRoot, "src", "test", "simple.vcd");

    console.log("Attempting to read file at:", vcdPath);

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
//currently we compile the files a very specialized way
ipcMain.handle("get-vcd", async (event, filePath, folderPath) => {
  // const shell = process.env[os.platform() === "win32" ? "COMSPEC" : "SHELL"];
  // const pt = pty.spawn(shell, [], {
  //   name: "vcd-generator",
  //   cols: col,
  //   rows: row,
  //   cwd: folderPath,
  //   env: process.env,
  // });

  console.log(filePath);

  // this will allow us to run different scripts, build different waveforms
  const extension = filePath.split(".").pop();
  const slashIdx = filePath.lastIndexOf("/") + 1;

  // Find the index of the dot to get the end index
  const dotIdx = filePath.lastIndexOf(".");

  // Extract the name
  let name = filePath.substring(slashIdx, dotIdx);
  console.log("file name is:" + name);
  const files = await readdirS(folderPath);

  let testBenchFile = getTestbenchFilename(files, name);
  pt.onData((data) => {
    console.log("data is " + data);
  });
  console.log(extension);

  // iverilog -g2012 -o simple.out simple.sv
  // pt.write("iverilog -g2012 -o example.out example_tb.sv example.sv \r");
  // pt.write("vvp example.out \r");
  // console.log(
  //   "iverilog -g2012 -o " +
  //     name +
  //     ".out " +
  //     testBenchFile +
  //     " " +
  //     name +
  //     "." +
  //     extension +
  //     " \r",
  // );
  // pt.write(
  //   "iverilog -g2012 -o " +
  //     name +
  //     ".out " +
  //     testBenchFile +
  //     " " +
  //     name +
  //     "." +
  //     extension +
  //     " \r",
  // );
  // pt.write("vvp " + name + ".out" + " \r");

  // var testbenchCode = fs
  //   .readFileSync(folderPath + "/" + testBenchFile)
  //   .toString();
  // const dumpfileStatement = testbenchCode.match(/\$dumpfile\("(.+)"\)/);
  // const dumpFileName = dumpfileStatement ? dumpfileStatement[1] : null;

  //return;
  // get directory, then check for test bench

  //

  //});

  return folderPath + "/" + dumpFileName;
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
