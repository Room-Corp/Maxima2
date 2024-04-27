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

const VCDrom = require("./vcdrom.js");

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

ipcMain.handle("initVCDrom", async (event, divId, vcdPath) => {
  const webContents = event.sender;
  const mod = await createVCD();
  const inst = await webVcdParser(mod);
  console.log(inst);
  // i think these methods need to go in execute havascruot

  //console.log(inst);
  try {
    await webContents.executeJavaScript(`



      const { StyleModule } = require('style-mod');
      const fs = require("fs");
      const {
        domContainer,
        pluginRenderValues,
        pluginRenderTimeGrid,
        keyBindo,
        mountTree,
        getElement,
        getListing,
        // renderMenu,
        // mountCodeMirror5,
        genKeyHandler,
        genOnWheel,
        themeAll,
        helpPanel
      } = require('@wavedrom/doppler');

      const readFileAsync = async (filePath) => {
         try {
           const buffer = await fs.readFileSync(filePath);
           return buffer.toString();
         } catch (error) {
           console.error("Error reading file:", error);
           throw error;
         }
       };



       const getPathBaseName = (path) => {
         const p1 = path.split("/");
         const res = p1.pop();
         return res;
       };

       function handleDragOver(event) {
         event.preventDefault();
         event.dataTransfer.dropEffect = "copy";
       }

       function handleDragEnter(event) {
         event.preventDefault();
         event.dataTransfer.dropEffect = "copy";
       }
       let filePath;
       function handleDrop(event) {
         event.preventDefault();
         const files = Array.from(event.dataTransfer.files);
         // Handle the dropped files here
         console.log("Dropped files:", files);
         filePath = files[0].path + "/" + files[0].name;
       }

     const handleFiles = (el, handler) => async () => {
       const items = el.files;
       if (items.length === 0) {
         return;
       }
       const readers = [];
       for (const item of items) {
         const file = item.getAsFile ? item.getAsFile() : item;
         const value = file.name;
         const ext = getExt(value);
         const s = file.stream();
         const reader = s.getReader();
         const baseName = getPathBaseName(value);
         readers.push({ ext, value, baseName, reader, file });
       }
       await handler(readers);
     };
     const getWaveql = async (readers) => {
       let waveql;
       const r = readers.find(reader => reader.ext === 'waveql');
       if (r && (r.reader)) {
         // console.log('WaveQL', r);
         const utf8Decoder = new TextDecoder('utf-8');
         waveql = '';
         for (let i = 0; i < 1e5; i++) {
           const { done, value } = await r.reader.read();
           waveql += value ? utf8Decoder.decode(value, {stream: true}) : '';
           if (done) {
             break;
           }
         }
       }
       return waveql;
     };

     const getJsonls = async (readers) => {
       const jsonls = [];
       const utf8Decoder = new TextDecoder('utf-8');

       for (const r of readers) {
         if ((r.ext !== 'jsonl') && (r.ext !== 'jsonl')) {
           continue;
         }

         // console.log('JSONL', r);
         let tail = '';
         const data = r.data = [];
         let lineNumber = 0;

         for (let i = 0; i < 1e5; i++) {
           const { done, value } = await r.reader.read();
           tail += value ? utf8Decoder.decode(value) : '';
          const lines = tail.split(/\\n/); // this line might become a problem in the future

           // console.log(i, lines.length);
           for (let j = 0; j < (lines.length - 1); j++) {
             lineNumber++;
             try {
               data.push(JSON.parse(lines[j]));
             } catch (err) {
               console.log('line: ' + lineNumber + ' chunk:' + i, lines[j], err);
             }
             tail = lines[lines.length - 1];
           }

           if (done) {
             if (tail === '') {
               break;
             }
             try {
               data.push(JSON.parse(tail));
             } catch (err) {
               console.log(i, 'tail', err);
             }
             break;
           }
         }

         jsonls.push(r);
       }

       // console.log(jsonls);
       return jsonls;
     };

     const vcdPipeDeso = () => {

       const parseTimescale = str => {
         if (typeof str !== 'string') {
           return;
         }
         const str1 = str.trim();
         const m = str1.match(/^(\d+)\s*(\w+)$/);
         const res1 = ({ 1: 0, 10: 1, 100: 2 })[m[1]];
         const res2 = ({ s: 0, ms: -3, us: -6, ns: -9, ps: -12, fs: -15 })[m[2]];
         return res1 + res2;
       };


       const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

       const numberOrString = val => {
         if (val < MAX_SAFE_INTEGER) {
           return Number(val);
         }
         return '0x' + val.toString(16);
       };

       const gcd = (a, b) => {
         if (a === undefined) {
           return b;
         }
         let r;
         while (b !== 0) {
           r = a % b;
           a = b;
           b = r;
         }
         return (a < 0) ? -a : a;
       };

       const tNorm = o => {
         const { tgcd, chango } = o;

         o.t0 /= tgcd;
         o.time /= tgcd;
         Object.keys(chango).map(key => {
           const { wave } = chango[key];
           wave.map(e => {
             e[0] /= tgcd;
           });
         });

         const exp = Math.log10(tgcd) | 0;
         if (exp > 0) {
           const scale = Math.pow(10, exp);
           const tgcd1 = tgcd / scale;
           if (tgcd1 === (tgcd1 | 0)) {
             o.tgcd = tgcd1;
             o.timescale += exp;
           }
         }
         return o;
       };


       module.exports = async (deso, inst, done) => {
         const chango = {};
         let tgcd;
         deso.chango = chango;
         deso.view = [];

         const onAnyChange = (id, time, cmd, value, mask) => {
           // console.log(id, time, cmd, value, mask);
           const time53 = Number(time);
           tgcd = gcd(tgcd, time53);
           chango[id] = chango[id] || { wave: [] };
           if (cmd >= 14 && cmd <= 28) {
             chango[id].kind = 'bit';
             chango[id].wave.push([time53, cmd - 14]);
           } else {
             chango[id].kind = 'vec';
             const point = [time53, numberOrString(value)];
             if (mask !== 0n) {
               point.push(numberOrString(mask));
             }
             chango[id].wave.push(point);
           }
         };

         const t0 = Date.now();

         inst.on('$enddefinitions', () => {
           // console.log('$enddefinitions');
           Object.assign(deso.wires, inst.info.wires);
           deso.timescale = parseTimescale(inst.info.timescale);
         });

         inst.change.any(onAnyChange);

         inst.on('finish', () => {
           console.log((Date.now() - t0) / 1000);
           deso.tgcd = tgcd;
           deso.t0 = (inst.info.t0 || 0);
           // console.log(inst.getTime());
           deso.time = Number(inst.getTime());
           tNorm(deso);
           done(deso);
         });
       };
     };
     const getHandler = (content, inst) => async (readers) => {
     console.log(content);
     console.log(inst);
     console.log("was passed");
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

     const getVcd = async (readers, content, inst) => {
     console.log(inst);
     console.log("inst is above");

       const maxChunkLength = 1 << 17; // Number.MAX_SAFE_INTEGER; // 5e6; // 300000; // 1 << 23;
       console.log(readers);
       console.log(readers.find(reader => reader.ext === 'vcd'));

       const r = readers.find(reader => reader.ext === 'vcd');
       if (r) {
         document.title = r.baseName;
         content.innerHTML = '<div class="wd-progress">LOADING...</div>';
         let total = 0;
         outerLoop:
         for (let i = 0; i < 1e5; i++) {
           const { done, value } = await r.reader.read();

           if (done && (value === undefined)) {
             // console.log('the end');
             inst.end();
             break outerLoop;
           }
           const len = value.length;
           for (let j = 0; j < len; j += maxChunkLength) {
             const value1 = value.slice(j, j + maxChunkLength);
             const len1 = value1.length;
             total += len1;

             // const vh = u8toStr(value1.slice(0, 100));
             // const vt = u8toStr(value1.slice(-100));
             // console.log({len1, done, total, vh, vt});

             content.innerHTML = '<div class="wd-progress">' + total.toLocaleString() + '</div>';
             if (done && ((j + maxChunkLength) >= len)) {
               // console.log('last chunk');
               inst.end(value1);
               break outerLoop;
             }
            inst.write(value1);
            console.log("wrote");
           }
         }
       }
     };
     const getExt = (value) => {
       const parts = value.split(".");
       return parts[parts.length - 1];
     };


     const urlRaw = {
       github: "https://raw.githubusercontent.com",
       gist: "https://gist.githubusercontent.com",
       bitbucket: "https://bitbucket.org",
       gitlab: "https://gl.githack.com",
       makerchip: "https://makerchip.com",
       local: ".",
     };

     const urlZip = {
       zgithub: "https://raw.githubusercontent.com",
       zgist: "https://gist.githubusercontent.com",
       zbitbucket: "https://bitbucket.org",
       zgitlab: "https://gl.githack.com",
       zmakerchip: "https://makerchip.com",
       zlocal: ".",
     };

     const getReaders = async (handler, vcdPath) => {
     console.log(vcdPath);
     console.log("was passed 2");
       const res = [];
       if (typeof vcdPath === "string") {
         const fileContent = await readFileAsync(vcdPath);
         let reader = {
           data: fileContent,
           position: 0,
           read: () => {
             const chunk = reader.data.slice(reader.position, reader.position + 1024);
             reader.position += chunk.length;
             return { value: chunk, done: reader.position >= reader.data.length };
           }
         };
         console.log("this one");
         const ext = getExt(vcdPath);
         res.push({
           key: "local",
           ext: ext,
           value: vcdPath,
           format: "raw",
           baseName: getPathBaseName(vcdPath),
           url: vcdPath,
           reader,
         });
       } else if (typeof vcdPath === "function") {
         console.log("vcdPath is function");
         const context = vcdPath(handler);
         console.log(context);
       } else {
         const urlSearchParams = new URLSearchParams(window.location.search);
         for (const [key, value] of urlSearchParams) {
           let format, ext, url, reader;
           if (urlRaw[key]) {
             format = "raw";
             ext = getExt(value);
             url = urlRaw[key] + "/" + value;
             const resp = await readFileAsync(url);
             reader = resp;
           } else if (urlZip[key]) {
             format = "zip";
             ext = getExt(value);
             url = urlZip[key] + "/" + value;
             const resp = await readFileAsync(url);
             reader = resp;
           } else {
             format = "arg";
           }
           const baseName = getPathBaseName(value);
           res.push({ key, value, baseName, format, ext, url, reader });
         }
       }

       if (res.length > 0) {
         await handler(res);
         return;
       }

       const dropZoneEl = document.getElementById("drop-zone");
       const inputEl = document.getElementById("inputfile");

       if (inputEl && dropZoneEl) {
         await handleFiles(inputEl, handler)();
         inputEl.addEventListener("change", handleFiles(inputEl, handler), false);
         document.addEventListener("keydown", (event) => {
           if (event.ctrlKey && (event.key === "o" || event.key === "O")) {
             event.preventDefault();
             inputEl.click();
           }
         });

         dropZoneEl.addEventListener(
           "click",
           () => {
             inputEl.click();
           },
           false,
         );

         window.addEventListener(
           "drop",
           async (ev) => {
             ev.preventDefault();
             ev.stopPropagation();
             if (ev.dataTransfer.items) {
               await handleFiles({ files: ev.dataTransfer.items }, handler)();
             } else {
               await handleFiles(ev.dataTransfer, handler)();
             }
           },
           false,
         );

         window.addEventListener(
           "dragover",
           (ev) => {
             console.log("this code is working");
             ev.preventDefault();
             ev.stopPropagation();
           },
           false,
         );

         window.addEventListener(
           "dragenter",
           (ev) => {
             ev.preventDefault();
             ev.stopPropagation();
           },
           false,
         );
       }
     };

      async function initHandler() {
      console.log("the path is" + '${vcdPath}');
      await getReaders(handler, '${vcdPath}');
    }

      const content = document.getElementById('${divId}');
      const themeAllMod = new StyleModule(${JSON.stringify(themeAll)});
      StyleModule.mount(document, themeAllMod);
      content.innerHTML = ${JSON.stringify(stringify(dropZone({ width: 2048, height: 2048 })))};
      const dropZoneElement = document.getElementById("drop-zone");
      dropZoneElement.addEventListener("dragover", handleDragOver);
      dropZoneElement.addEventListener("dragenter", handleDragEnter);
      dropZoneElement.addEventListener("drop", handleDrop);


      const handler = getHandler(content, '${inst}');
      console.log("pan-handler");
      console.log(handler);
      initHandler();



    `);
    //      const handler = (${getHandler.toString()})(content, ${JSON.stringify(inst)});
    // (${getReaders.toString()})(handler, filePath);
    //  (${getReaders.toString()})(handler, filePath);
  } catch (error) {
    console.error("Error initializing VCDrom:", error);
    return error.message;
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
