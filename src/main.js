const { app, ipcMain, BrowserWindow } = require("electron");
const vcdModule = require("./vcd.wasm");
const path = require("path");
//var Terminal = require('xterm').Terminal;
const pty = require("node-pty");
const os = require("os");
const fs = require("fs");

const createVCD = require("vcd-stream/out/vcd.js");
const webVcdParser = require("vcd-stream/lib/web-vcd-parser.js");
const vcdPipeDeso = require("vcd-stream/lib/vcd-pipe-deso.js");
const getVcd = require("vcd-stream/lib/get-vcd.js");
const dropZone = require("./drop-zone.js");

const stringify = require("onml/stringify.js");

const { StyleModule } = require("style-mod");

const getReaders = require("./get-readers.js");

const {
  domContainer,
  pluginRenderValues,
  pluginRenderTimeGrid,
  keyBindo,
  mountTree,
  getElement,
  getListing,
  genKeyHandler,
  genOnWheel,
  themeAll,
  helpPanel,
} = require("@wavedrom/doppler");

const { createCodeMirrorState, mountCodeMirror6 } = require("waveql");
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

const getWaveql = async (readers) => {
  let waveql;
  const r = readers.find((reader) => reader.ext === "waveql");
  if (r && r.reader) {
    // console.log('WaveQL', r);
    const utf8Decoder = new TextDecoder("utf-8");
    waveql = "";
    for (let i = 0; i < 1e5; i++) {
      const { done, value } = await r.reader.read();
      waveql += value ? utf8Decoder.decode(value, { stream: true }) : "";
      if (done) {
        break;
      }
    }
  }
  return waveql;
};

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

const getHandler = (content, inst) => async (readers) => {
  console.log("the bookwrom is");
  console.log(readers);
  const waveql = await getWaveql(readers);
  const listing = await getListing(readers);
  const jsonls = await getJsonls(readers);
  const timeOpt = readers.find((row) => row.key === "time");

  vcdPipeDeso({ wires: { body: [] } }, inst, (deso) => {
    content.innerHTML = "";
    deso.waveql = waveql;
    deso.listing = listing;
    deso.timeOpt = timeOpt;
    deso.jsonls = jsonls;

    const container = domContainer({
      elemento: mountTree.defaultElemento,
      layers: mountTree.defaultLayers,
      renderPlugins: [
        pluginRenderTimeGrid,
        pluginRenderValues,
        pluginLocalStore,
      ],
      pluginRightPanel: (elo) => {
        elo.rightPanel.innerHTML = stringify(helpPanel.mlPanel(keyBindo));
      },
    });

    content.appendChild(container.pstate.container);
    container.start(deso);

    container.elo.menu.innerHTML = stringify(
      helpPanel.mlIcon("https://github.com/wavedrom/vcdrom/blob/trunk/help.md"),
    );
    container.elo.menu.addEventListener("click", () =>
      helpPanel.toggle(container.pstate),
    );

    deso.hasHistory = true;
    deso.isRO = true;
    deso.updater = (/* str */) => {
      console.log("updater");
    };

    const cmState = createCodeMirrorState(deso, container.pstate);

    const cm = mountCodeMirror6(
      cmState,
      container.elo.waveqlPanel,
      deso,
      container.pstate,
    );

    cm.view.dispatch({ changes: { from: 0, insert: " " } });
    cm.view.dispatch({ changes: { from: 0, to: 1, insert: "" } });

    container.elo.container.addEventListener(
      "keydown",
      genKeyHandler.genKeyHandler(
        content,
        container.pstate,
        deso,
        cm,
        keyBindo,
      ),
    );
    container.elo.container.addEventListener(
      "wheel",
      genOnWheel(content, container.pstate, deso, cm, keyBindo),
    );
    // console.log(cm);
    cm.view.focus();
  });

  await getVcd(readers, content, inst);
  console.log("getVcd");
};
const getJsonls = async (readers) => {
  const jsonls = [];
  const utf8Decoder = new TextDecoder("utf-8");
  for (const r of readers) {
    if (r.ext !== "jsonl" && r.ext !== "jsonl") {
      continue;
    }
    // console.log('JSONL', r);
    let tail = "";
    const data = (r.data = []);
    let lineNumber = 0;
    for (let i = 0; i < 1e5; i++) {
      const { done, value } = await r.reader.read();
      tail += value ? utf8Decoder.decode(value) : "";
      const lines = tail.split(/\n/);
      // console.log(i, lines.length);
      for (let j = 0; j < lines.length - 1; j++) {
        lineNumber++;
        try {
          data.push(JSON.parse(lines[j]));
        } catch (err) {
          console.log("line: " + lineNumber + " chunk:" + i, lines[j], err);
        }
        tail = lines[lines.length - 1];
      }
      if (done) {
        if (tail === "") {
          break;
        }
        try {
          data.push(JSON.parse(tail));
        } catch (err) {
          console.log(i, "tail", err);
        }
        break;
      }
    }
    jsonls.push(r);
  }
  // console.log(jsonls);
  return jsonls;
};
ipcMain.on("get-wave", async (event, vcdPath, divId) => {
  try {
    const webContents = event.sender;
    const mod = await createVCD();
    const inst = await webVcdParser(mod);
    const handler = getHandler(null, inst);

    await webContents.executeJavaScript(`
        console.log("Hello!");
        const iLoveMen = document.getElementById('${divId}');
        iLoveMen.innerHTML = '${stringify(dropZone({ width: 2048, height: 2048 }))}';

        (${getReaders.toString()})(${handler.toString()}, '${vcdPath}')
          .then(() => {
            console.log("getReaders completed");
          })
          .catch((error) => {
            console.error("Error in getReaders:", error);
          });
      `);
    console.log("trying");
  } catch (error) {
    console.error("Error getting wave:", error);
    return error.message;
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

//currently we compile the files a very specialized way
ipcMain.handle("get-vcd", async (event, filePath, folderPath) => {
  const shell = process.env[os.platform() === "win32" ? "COMSPEC" : "SHELL"];
  const pt = pty.spawn(shell, [], {
    name: "vcd-generator",
    cols: col,
    rows: row,
    cwd: folderPath,
    env: process.env,
  });

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

  //currently supports sv

  //pt.write("iverilog -g2012 -o example.out example_tb.sv example.sv \r");
  //pt.write("vvp example.out \r");
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

  var testbenchCode = fs
    .readFileSync(folderPath + "/" + testBenchFile)
    .toString();
  const dumpfileStatement = testbenchCode.match(/\$dumpfile\("(.+)"\)/);
  const dumpFileName = dumpfileStatement ? dumpfileStatement[1] : null;

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
