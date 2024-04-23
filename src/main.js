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

ipcMain.on("get-wave", async (event, vcdPath, divElement) => {
  try {
    const window = BrowserWindow.fromWebContents(event.sender);
    const divContent = mainWindow.webContents.executeJavaScript(
      `document.getElementById('${divElement}')`,
    );
    divContent.innerHTML = stringify(dropZone({ width: 2048, height: 2048 }));
    console.log("trying");
    //console.log(divContent);
    const mod = await createVCD();
    const inst = await webVcdParser(mod);
    const handler = getHandler(divContent, inst);
    await getReaders(handler, vcdPath);
  } catch (error) {
    console.error("Error getting wave:", error);
    event.reply("get-wave-error", error.message);
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
