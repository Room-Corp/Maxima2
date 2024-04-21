// const createVCD = require("vcd-stream/out/vcd.js");
// const webVcdParser = require("vcd-stream/lib/web-vcd-parser.js");
// const vcdPipeDeso = require("vcd-stream/lib/vcd-pipe-deso.js");
// const getVcd = require("vcd-stream/lib/get-vcd.js");

// const stringify = require("onml/stringify.js");

// const { StyleModule } = require("style-mod");

// const {
//   domContainer,
//   pluginRenderValues,
//   pluginRenderTimeGrid,
//   keyBindo,
//   mountTree,
//   getElement,
//   getListing,
//   genKeyHandler,
//   genOnWheel,
//   themeAll,
//   helpPanel,
// } = require("@wavedrom/doppler");

// const { createCodeMirrorState, mountCodeMirror6 } = require("waveql");

// export default function Wave2(props) {
//   const getWaveql = async (readers) => {
//     let waveql;
//     const r = readers.find((reader) => reader.ext === "waveql");
//     if (r && r.reader) {
//       const utf8Decoder = new TextDecoder("utf-8");
//       waveql = "";
//       for (let i = 0; i < 1e5; i++) {
//         const { done, value } = await r.reader.read();
//         waveql += value ? utf8Decoder.decode(value, { stream: true }) : "";
//         if (done) {
//           break;
//         }
//       }
//     }
//     return waveql;
//   };

//   const getJsonls = async (readers) => {
//     const jsonls = [];
//     const utf8Decoder = new TextDecoder("utf-8");
//     for (const r of readers) {
//       if (r.ext !== "jsonl" && r.ext !== "jsonl") {
//         continue;
//       }
//       // console.log('JSONL', r);
//       let tail = "";
//       const data = (r.data = []);
//       let lineNumber = 0;
//       for (let i = 0; i < 1e5; i++) {
//         const { done, value } = await r.reader.read();
//         tail += value ? utf8Decoder.decode(value) : "";
//         const lines = tail.split(/\n/);
//         // console.log(i, lines.length);
//         for (let j = 0; j < lines.length - 1; j++) {
//           lineNumber++;
//           try {
//             data.push(JSON.parse(lines[j]));
//           } catch (err) {
//             console.log("line: " + lineNumber + " chunk:" + i, lines[j], err);
//           }
//           tail = lines[lines.length - 1];
//         }
//         if (done) {
//           if (tail === "") {
//             break;
//           }
//           try {
//             data.push(JSON.parse(tail));
//           } catch (err) {
//             console.log(i, "tail", err);
//           }
//           break;
//         }
//       }
//       jsonls.push(r);
//     }
//     // console.log(jsonls);
//     return jsonls;
//   };

//   const pluginLocalStore = (desc, pstate /* , els */) => {
//     localStorage.setItem(
//       "vcdrom",
//       JSON.stringify({
//         // yOffset: pstate.yOffset,
//         xOffset: pstate.xOffset,
//         xScale: pstate.xScale,
//       }),
//     );
//   };

//   const getHandler = (content, inst) => async (readers) => {
//     const waveql = await getWaveql(readers);
//     const listing = await getListing(readers);
//     const jsonls = await getJsonls(readers);
//     const timeOpt = readers.find((row) => row.key === "time");

//     vcdPipeDeso({ wires: { body: [] } }, inst, (deso) => {
//       content.innerHTML = "";
//       deso.waveql = waveql;
//       deso.listing = listing;
//       deso.timeOpt = timeOpt;
//       deso.jsonls = jsonls;

//       const container = domContainer({
//         elemento: mountTree.defaultElemento,
//         layers: mountTree.defaultLayers,
//         renderPlugins: [
//           pluginRenderTimeGrid,
//           pluginRenderValues,
//           pluginLocalStore,
//         ],
//         pluginRightPanel: (elo) => {
//           elo.rightPanel.innerHTML = stringify(helpPanel.mlPanel(keyBindo));
//         },
//       });

//       content.appendChild(container.pstate.container);
//       container.start(deso);

//       container.elo.menu.innerHTML = stringify(
//         helpPanel.mlIcon(
//           "https://github.com/wavedrom/vcdrom/blob/trunk/help.md",
//         ),
//       );
//       container.elo.menu.addEventListener("click", () =>
//         helpPanel.toggle(container.pstate),
//       );

//       deso.hasHistory = true;
//       deso.isRO = true;
//       deso.updater = (/* str */) => {
//         console.log("updater");
//       };

//       const cmState = createCodeMirrorState(deso, container.pstate);

//       const cm = mountCodeMirror6(
//         cmState,
//         container.elo.waveqlPanel,
//         deso,
//         container.pstate,
//       );

//       cm.view.dispatch({ changes: { from: 0, insert: " " } });
//       cm.view.dispatch({ changes: { from: 0, to: 1, insert: "" } });

//       container.elo.container.addEventListener(
//         "keydown",
//         genKeyHandler.genKeyHandler(
//           content,
//           container.pstate,
//           deso,
//           cm,
//           keyBindo,
//         ),
//       );
//       container.elo.container.addEventListener(
//         "wheel",
//         genOnWheel(content, container.pstate, deso, cm, keyBindo),
//       );
//       // console.log(cm);
//       cm.view.focus();
//     });

//     await getVcd(readers, content, inst);
//     console.log("getVcd");
//   };

//   global.VCDrom = async (divName, vcdPath) => {
//     console.log(pkg.name, pkg.version, vcdPath);
//     const content = getElement(divName);

//     const themeAllMod = new StyleModule(themeAll);
//     StyleModule.mount(document, themeAllMod);

//     content.innerHTML = "";
//     const mod = await createVCD();
//     const inst = await webVcdParser(mod); // VCD parser instance
//     const handler = getHandler(content, inst);

//     const resp = await fetch(vcdPath);
//     const body = resp.body;
//     const reader = body.getReader();

//     const getPathBaseName = (path) => {
//       const p1 = path.split("/");
//       const res = p1.pop();
//       return res;
//     };

//     await handler({
//       key: "local",
//       value: vcdPath,
//       format: "raw",
//       baseName: getPathBaseName(vcdPath),
//       url: vcdPath,
//       reader,
//     });
//   };

//   return global.VCDrom(props.divName, props.vcdPath);
// }
