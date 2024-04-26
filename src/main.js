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

    await webContents.executeJavaScript(`
      const content = document.getElementById('${divId}');
      const themeAllMod = new StyleModule(${JSON.stringify(themeAll)});
      StyleModule.mount(document, themeAllMod);
      content.innerHTML = ${JSON.stringify(stringify(dropZone({ width: 2048, height: 2048 })))};
      const handler = (${getHandler.toString()})(content, ${JSON.stringify(inst)});
      (${getReaders.toString()})(handler, '${vcdPath}');
    `);
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

ipcMain.handle("initVCDrom", async (event, divId, vcdPath) => {
  const webContents = event.sender;
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

       const getExt = (value) => {
         const parts = value.split(".");
         return parts[parts.length - 1];
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

     const getVcd = async (readers, content, inst) => {
       const maxChunkLength = 1 << 17; // Number.MAX_SAFE_INTEGER; // 5e6; // 300000; // 1 << 23;


       const r = readers.find(reader => reader.ext === 'vcd');
       if (r) {
         // console.log('VCD', r);
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
           }
         }
       }
     };

     const stream = require('stream');
     const EventEmitter = require('events').EventEmitter;

     const dotProp = require('dot-prop');

     const commandHandler = require('./command-handler.js');
     const webVcdParser = (mod) => {
     // function _waitForStart(mod) {
     //   return new Promise((resolve)=>{
     //     mod.addOnPostRun(resolve);
     //   });
     // }

     // function u8ToBn(u8) {
     //   let str = '';
     //   for (let i = 0; i < u8.length; i++) {
     //     const val = u8[i];
     //     str = val.toString(16) + str;
     //     if (val < 16) {
     //       str = '0' + str;
     //     }
     //   }
     //   return BigInt('0x' + str);
     // }

     function h8ToBn(HEAPU8, start, len) {
       if (len === 0) {
         return 0n;
       }
       let str = '';
       const fin = start + len * 8;
       for (let i = start; i < fin; i++) {
         const val = HEAPU8[i];
         str = val.toString(16) + str;
         if (val < 16) {
           str = '0' + str;
         }
       }
       return BigInt('0x' + str);
     }

     // let startCalled = 0;

     const bindCWrap = (c, wasm) => {
       const w = wasm.cwrap;
       c.execute    = w('execute',    'number', ['number', 'number', 'number', 'number', 'number', 'array', 'number']);
       c.init       = w('init',       'number', ['number', 'number', 'number', 'number']);
       c.getTime    = w('getTime',    'number', ['number']);
       c.setTrigger = w('setTrigger', 'number', ['number', 'string']);
     };

     const getWrapper = wasm => {
       // console.log(wasm);

       const c = {};

       let bindCallback;


       const start = async() => {
         // if( !startCalled ) {
         //   await _waitForStart(wasm);
         //   startCalled++;
         // }
         // console.log('s1');
         bindCWrap(c, wasm);
         // console.log('s2');
         bindCallback();
         // console.log('s3');
       };

       // gets a string from a c heap pointer and length
       const getString = (name, len) => {

         // const view = wasm.HEAPU8.subarray(name, name+len);
         // let string = '';
         // for (let i = 0; i < len; i++) {
         //   string += String.fromCharCode(view[i]);
         // }
         // return string;

         let string = '';
         const end = name + len;
         for (let i = name; i < end; i++) {
           string += String.fromCharCode(wasm.HEAPU8[i]);
         }
         return string;

       };

       let boundInfo;

       let boundSet;
       let boundGet;

       let ee = [];

       let boundEE0;
       let boundEE1;

       let context = -1;


       const onEE1 = (
         /* const char* */   eventName,
         /* const size_t */  eventNameLength, // strlen(name)
         /* const int64_t */ time,
         /* const int */     cmd,
         /* const int */     valueWords,
         /* uint64_t* */     value,
         /* const int */     maskWords,
         /* uint64_t* */     mask
       ) => {
         const name = getString(eventName, eventNameLength);

         // console.log({name, time, command, valueWords});



         // const view0 = wasm.HEAPU8.subarray(value, value+(valueWords*8));
         // const view1 = wasm.HEAPU8.subarray(mask,  mask+(valueWords*8));

         // let bigValue = u8ToBn(view0);
         // let bigMask = u8ToBn(view1);
         // let bigValue = 0n;

         // console.log(bigValue.toString(16));

         if (cmd >= 14 && cmd <= 28) {
           ee[1](name, time, cmd);
         } else {
           const bigValue = h8ToBn(wasm.HEAPU8, value, valueWords);
           const bigMask = h8ToBn(wasm.HEAPU8, mask, maskWords);
           ee[1](name, time, cmd, bigValue, bigMask);
         }
       };

       // wasm.addFunction can't be called until after
       // start finishes
       bindCallback = () => {
         boundSet = wasm.addFunction(function(name, len, type, v0, v1) {

           let prop = getString(name, len);
           let tmp;

           switch(type) {
           // set number
           case 0:
             boundInfo[prop] = v0;

             break;
           // set string
           case 1:
             boundInfo[prop] = getString(v0, v1);

             break;
           // set string to path
           case 2:
             dotProp.set(boundInfo, prop, getString(v0, v1));

             break;
           // path to path (any type)
           case 3:
             tmp = getString(v0, v1)
               .split(',')
               .map(e => dotProp.get(boundInfo, e));
             if (tmp.length === 1) {
               dotProp.set(boundInfo, prop, tmp[0]);
               break;
             }
             dotProp.set(boundInfo, prop, tmp);
             break;
           // create empty object at path
           case 4:

             dotProp.set(boundInfo, prop, {});
             break;
           case 5:
             commandHandler(boundInfo, v0, prop);
             break;
           default: throw new Error();
           }


           // viiiii means returns void, accepts int int int int int
         }, 'viiiii');

         boundGet = wasm.addFunction(function(name, len) {
           let prop = getString(name, len);
           return prop;
         }, 'iii');


         boundEE0 = wasm.addFunction(function(name, len) {
           ee[0](getString(name, len));
         }, 'vii');

         boundEE1 = wasm.addFunction(onEE1, 'viijiiiii');

       };

       return {
         start,
         c,
         init: (cb0, cb1, info) => {
           boundInfo = info;
           ee[0] = cb0;
           ee[1] = cb1;
           context = c.init(boundEE0, boundEE1, boundSet, boundGet);
           return context;
         },
         execute: (ctx, cb0, cb1, info, chunk) => {
           boundInfo = info;
           ee[0] = cb0;
           ee[1] = cb1;
           return c.execute(ctx, boundEE0, boundEE1, boundSet, boundGet, chunk, chunk.length);
         },
         setTrigger: (ctx, triggerString) => {
           return c.setTrigger(ctx, triggerString);
         },
         getTime: (ctx) => {
           return BigInt(c.getTime(ctx));
         }
       };

     };

     module.exports = async wasm => {
       const lib = getWrapper(wasm);
       // console.log('getWrapper', lib);
       await lib.start();
       // console.log('vcd wasm srarted');
       const wires = {kind: 'scope', type: '.', name: '.', body: []};
       const info = {stack: [wires], wires};

       const s = new stream.Writable();

       // gets called by c with 1 argument, a string
       const lifemit = s.emit.bind(s);

       const triee = new EventEmitter();

       // gets called by c with 5 arguments
       // string        eventName
       // number        state->time
       // int           command
       // int           state->value
       // int           state->mask

       const triemit = triee.emit.bind(triee);
       let triemit2 = triemit;

       const cxt = lib.init(lifemit, triemit, info);

       s._write = function (chunk, encoding, callback) {
         // console.log('chunk:', chunk.length);
         const err = lib.execute(cxt, lifemit, triemit2, info, chunk);
         if (err) {
           console.log(err);
         }
         // console.log(util.inspect(info, {showHidden: true, depth : null, colorize: true}));
         // console.log(info.stack[0].top);
         // console.log(info.stack[1]);
         // console.log(info.stack[0].top == info.stack[1]);
         callback();
       };

       s.change = {
         on: (id, fn) => {
           triemit2 = triemit;
           triee.on(id, fn);
           const triggerString = triee.eventNames().join(' ') + '  ';
           // console.log(id, Buffer.from(triggerString));
           lib.setTrigger(cxt, triggerString);
         },
         any: fn => {
           triemit2 = fn;
           lib.setTrigger(cxt, '\0');
         }
       };

       s.info = info;

       s.getTime = () => lib.getTime(cxt);

       s.start = lib.start;

       return s;
     };
     };


     function createVCD() {
       var Module = typeof createVCD != "undefined" ? createVCD : {};
       var readyPromiseResolve, readyPromiseReject;
       Module["ready"] = new Promise(function(resolve, reject) {
         readyPromiseResolve = resolve;
         readyPromiseReject = reject;
       });
       var moduleOverrides = Object.assign({}, Module);
       var arguments_ = [];
       var thisProgram = "./this.program";
       var quit_ = (status, toThrow) => {
         throw toThrow;
       };
       var ENVIRONMENT_IS_WEB = typeof window == "object";
       var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
       var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
       var scriptDirectory = "";
       function locateFile(path) {
         if (Module["locateFile"]) {
           return Module["locateFile"](path, scriptDirectory);
         }
         return scriptDirectory + path;
       }
       // ... rest of the code ...

       var calledRun;
       dependenciesFulfilled = function runCaller() {
         if (!calledRun) run();
         if (!calledRun) dependenciesFulfilled = runCaller;
       };
       function callMain() {
         var entryFunction = _main;
         var argc = 0;
         var argv = 0;
         try {
           var ret = entryFunction(argc, argv);
           exitJS(ret, true);
           return ret;
         } catch (e) {
           return handleException(e);
         }
       }
       function run() {
         if (runDependencies > 0) {
           return;
         }
         preRun();
         if (runDependencies > 0) {
           return;
         }
         function doRun() {
           if (calledRun) return;
           calledRun = true;
           Module["calledRun"] = true;
           if (ABORT) return;
           initRuntime();
           preMain();
           readyPromiseResolve(Module);
           if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
           if (shouldRunNow) callMain();
           postRun();
         }
         if (Module["setStatus"]) {
           Module["setStatus"]("Running...");
           setTimeout(function() {
             setTimeout(function() {
               Module["setStatus"]("");
             }, 1);
             doRun();
           }, 1);
         } else {
           doRun();
         }
       }
       if (Module["preInit"]) {
         if (typeof Module["preInit"] == "function")
           Module["preInit"] = [Module["preInit"]];
         while (Module["preInit"].length > 0) {
           Module["preInit"].pop()();
         }
       }
       var shouldRunNow = true;
       if (Module["noInitialRun"]) shouldRunNow = false;

       if (shouldRunNow) {
         run();
         Module["ready"];
       }

       return Module;
     }

      const Module = createVCD();
     // Use the exported functions and properties from the Module object
      Module._init();
      Module._execute();
       console.log(Module);
       //const inst = await webVcdParser(mod);

      const content = document.getElementById('${divId}');
      const themeAllMod = new StyleModule(${JSON.stringify(themeAll)});
      StyleModule.mount(document, themeAllMod);
      content.innerHTML = ${JSON.stringify(stringify(dropZone({ width: 2048, height: 2048 })))};
      const dropZoneElement = document.getElementById("drop-zone");
      dropZoneElement.addEventListener("dragover", handleDragOver);
      dropZoneElement.addEventListener("dragenter", handleDragEnter);
      dropZoneElement.addEventListener("drop", handleDrop);
    `);
    //      const handler = (${getHandler.toString()})(content, ${JSON.stringify(inst)});
    // (${getReaders.toString()})(handler, filePath);
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
