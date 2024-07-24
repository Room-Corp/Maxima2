import React from "react";
import { useState, useEffect, useRef } from "react";
const { ipcRenderer } = window.require("electron");
import { Xterm } from "xterm-react";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  getPanelElement,
} from "react-resizable-panels";
import saveIcon from "./icons/saveicon.png";
import openIcon from "./icons/openfile.png";
import verilogIcon from "./icons/verilog.png";
import systemVerilogIcon from "./icons/svicon2.png";
import fileIconNew from "./icons/fileIconNew.png";
import Popup from "reactjs-popup";
import { parseVCD } from "./vcdParser.ts";
import WaveformViewer from "./WaveformViewer.tsx";

// save original code, if new is different from original, then prompt user to save once user saves update original.
//

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize2() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize2);
    return () => window.removeEventListener("resize", handleResize2);
  }, []);

  return windowDimensions;
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

monaco.languages.setMonarchTokensProvider("systemverilog", {
  defaultToken: "",
  tokenPostfix: ".sv",

  keywords: [
    "accept_on",
    "alias",
    "always",
    "always_comb",
    "always_ff",
    "always_latch",
    "and",
    "assert",
    "assign",
    "assume",
    "automatic",
    "before",
    "begin",
    "bind",
    "bins",
    "binsof",
    "bit",
    "break",
    "buf",
    "bufif0",
    "bufif1",
    "byte",
    "case",
    "casex",
    "casez",
    "cell",
    "chandle",
    "class",
    "clocking",
    "cmos",
    "config",
    "const",
    "constraint",
    "context",
    "continue",
    "cover",
    "covergroup",
    "coverpoint",
    "cross",
    "deassign",
    "default",
    "defparam",
    "design",
    "disable",
    "dist",
    "do",
    "edge",
    "else",
    "end",
    "endcase",
    "endclass",
    "endclocking",
    "endconfig",
    "endfunction",
    "endgenerate",
    "endgroup",
    "endinterface",
    "endmodule",
    "endpackage",
    "endprimitive",
    "endprogram",
    "endproperty",
    "endspecify",
    "endsequence",
    "endtable",
    "endtask",
    "enum",
    "event",
    "expect",
    "export",
    "extends",
    "extern",
    "final",
    "first_match",
    "for",
    "force",
    "foreach",
    "forever",
    "fork",
    "forkjoin",
    "function",
    "generate",
    "genvar",
    "highz0",
    "highz1",
    "if",
    "iff",
    "ifnone",
    "ignore_bins",
    "illegal_bins",
    "import",
    "incdir",
    "include",
    "initial",
    "inout",
    "input",
    "inside",
    "instance",
    "int",
    "integer",
    "interface",
    "intersect",
    "join",
    "join_any",
    "join_none",
    "large",
    "liblist",
    "library",
    "local",
    "localparam",
    "logic",
    "longint",
    "macromodule",
    "matches",
    "medium",
    "modport",
    "module",
    "nand",
    "negedge",
    "new",
    "nmos",
    "nor",
    "noshowcancelled",
    "not",
    "notif0",
    "notif1",
    "null",
    "or",
    "output",
    "package",
    "packed",
    "parameter",
    "pmos",
    "posedge",
    "primitive",
    "priority",
    "program",
    "property",
    "protected",
    "pull0",
    "pull1",
    "pulldown",
    "pullup",
    "pulsestyle_onevent",
    "pulsestyle_ondetect",
    "pure",
    "rand",
    "randc",
    "randcase",
    "randsequence",
    "rcmos",
    "real",
    "realtime",
    "ref",
    "reg",
    "release",
    "repeat",
    "return",
    "rnmos",
    "rpmos",
    "rtran",
    "rtranif0",
    "rtranif1",
    "scalared",
    "sequence",
    "shortint",
    "shortreal",
    "showcancelled",
    "signed",
    "small",
    "solve",
    "specify",
    "specparam",
    "static",
    "string",
    "strong0",
    "strong1",
    "struct",
    "super",
    "supply0",
    "supply1",
    "sync_accept_on",
    "sync_reject_on",
    "table",
    "tagged",
    "task",
    "this",
    "throughout",
    "time",
    "timeprecision",
    "timeunit",
    "tran",
    "tranif0",
    "tranif1",
    "tri",
    "tri0",
    "tri1",
    "triand",
    "trior",
    "trireg",
    "type",
    "typedef",
    "union",
    "unique",
    "unsigned",
    "use",
    "var",
    "vectored",
    "virtual",
    "void",
    "wait",
    "wait_order",
    "wand",
    "weak0",
    "weak1",
    "while",
    "wildcard",
    "wire",
    "with",
    "within",
    "wor",
    "xnor",
    "xor",
  ],

  operators: [
    "=",
    ">",
    "<",
    "!",
    "~",
    "?",
    ":",
    "==",
    "<=",
    ">=",
    "!=",
    "&&",
    "||",
    "++",
    "--",
    "+",
    "-",
    "*",
    "/",
    "&",
    "|",
    "^",
    "%",
    "<<",
    ">>",
    ">>>",
    "+=",
    "-=",
    "*=",
    "/=",
    "&=",
    "|=",
    "^=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      [
        /[a-z_$][\w$]*/,
        { cases: { "@keywords": "keyword", "@default": "identifier" } },
      ],
      [/[A-Z][\w\$]*/, "type.identifier"],

      { include: "@whitespace" },

      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

      [/\d*\d+[eE]([\-+]?\d+)?/, "number.float"],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\d[\d']*/, "number"],
      [/\d+/, "number"],

      [/[;,.]/, "delimiter"],

      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"],
    ],

    comment: [
      [/[^\/*]+/, "comment"],
      [/\/\*/, "comment", "@push"],
      ["\\*/", "comment", "@pop"],
      [/[\/*]/, "comment"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],
  },
});

// Configuration for SystemVerilog language
monaco.languages.setLanguageConfiguration("systemverilog", {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "[", close: "]" },
    { open: "{", close: "}" },
    { open: "(", close: ")" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string"] },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*#pragma\\s+region\\b"),
      end: new RegExp("^\\s*#pragma\\s+endregion\\b"),
    },
  },
});

function App() {
  const [TerminalDisplay, setTerminalDisplay] = useState(null);
  const [input, setInput] = useState("");
  const [lastLine, setLastLine] = useState("");
  const [code, setCode] = useState("");
  // const [file, setFile] = useState();
  const [filePath, setFilePath] = useState("");
  const [language, setLanguage] = useState("verilog");
  const [files, setFiles] = useState([]);
  const fitAddon = new FitAddon();
  const [terminal, setTerminal] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { width, height } = useWindowDimensions();
  const termPanelElement = getPanelElement("term-panel");
  const [parseData, setParsedData] = useState();

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Terminal", "Wave Form Viewer"];
  const editorRef = useRef(null);

  const [openTabs, setOpenTab] = useState([]);
  const [openFiles, setOpenFile] = useState([]);
  const [activeFile, setActiveFile] = useState(-1);

  const [folderPath, setFolderPath] = useState([]);

  // const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  //
  const [waveformData, setWaveformData] = useState(null);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(false);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Set up the model for the current file
    if (filePath) {
      const model =
        monaco.editor.getModel(monaco.Uri.file(filePath)) ||
        monaco.editor.createModel(code, language, monaco.Uri.file(filePath));
      editor.setModel(model);
    }
  }

  // Effect to update the editor model when the file changes
  useEffect(() => {
    if (editorRef.current && filePath) {
      const editor = editorRef.current;
      const model = editor.getModel();

      if (
        !model ||
        model.uri.toString() !== monaco.Uri.file(filePath).toString()
      ) {
        const newModel =
          monaco.editor.getModel(monaco.Uri.file(filePath)) ||
          monaco.editor.createModel(code, language, monaco.Uri.file(filePath));
        editor.setModel(newModel);
        setEditorContent(code);
      }
    }
  }, [filePath, language]);

  useEffect(() => {
    const loadPresetVCDFile = async () => {
      setIsLoadingWaveform(true);
      try {
        // Assuming you have a method to get the VCD file content
        const vcdContent = await ipcRenderer.invoke("get-vcd");
        const parsedData = await parseVCD(vcdContent);
        setWaveformData(parsedData);
      } catch (error) {
        console.error("Error loading preset VCD file:", error);
      } finally {
        setIsLoadingWaveform(false);
      }
    };

    loadPresetVCDFile();
  }, []);

  const folderInput = useRef(null);
  const openWaveForm = async () => {
    console.log("file has bene found");

    const vcdFile = await ipcRenderer.invoke("get-vcd", filePath, folderPath);
    const parsedData = await parseVCD(vcdFile);
    setWaveformData(parsedData);

    // switch this to work with relative paths
    // const invokeReturn = await ipcRenderer.invoke(
    //   "get-code",
    //   "/Users/farhankhan/Maxima2/src/test/example.vcd",
    // );
    // console.log(invokeReturn);
    // console.log("filedone");
    // parser.parse_str(invokeReturn);
    // console.log(parser);
    // setParsedData(parser.scope.toJson());
    //console.log("json String is");
    //console.log(jsonString);
  };

  useEffect(() => {
    console.log(folderInput);
  }, [folderInput]);

  useEffect(() => {
    console.log("ran");
    ipcRenderer.on("pty-data", (event, data) => {
      if (data && TerminalDisplay) {
        console.log("data: " + data);
        TerminalDisplay.write(data);
      } else {
        console.log("bozo");
      }
    });
    return () => {
      ipcRenderer.removeAllListeners("pty-data");
    };
  });

  loader.config({ monaco });

  const styles = {
    container: {
      backgroundColor: "#141414",
      color: "white",
      height: "100%",
      display: "flex",
      // alignItems: "center",
      flexDirection: "column",
      // padding: 0,
      margin: 0,
      paddingBottom: "0px",
      padding: 0,
    },
    terminalContainer: {
      // Set maximum height to fit within viewport
      //overflow: "hidden", // Hide overflow content
      //display: "block",
      //position: "absolute",  /* Matches padding-bottom on .terminal-outer-container */
      // height:"100%",
      //borderTop: "10px solid #f0f0f0",
    },
    terminal: {
      bottom: 0,
      margin: 0,
      padding: 0,
      left: 0,
      marginBottom: 25,
      width: "100%",
      height: "100%",
      paddingBottom: "2%",
      //  backgroundColor: "#f0f0f",
      overflowY: "auto",
      //float:"bo
      // position:"absolute",
      //  borderTop: "2px solid #565656",
      //padding: "10px" ,
      // position: "fixed"

      //overflow:"auto",
    },
    editor: {
      width: "100%",
      height: "100%",
    },
    sideBar: {
      top: 0,
      padding: 0,
      margin: 0,
      width: "100%",
      height: "100vw",
      //padding: 1rem;

      backgroundColor: "#1e1d1e" /* Change the background color as desired */,
    },
    waveFormPanel: {
      top: 0,
      padding: 0,
      margin: 0,
      height: "100%",
      width: "100%",
      height: "80vw",
      // backgroundColor: "#1e1d1e" /* Change the background color as desired */,
    },

    tabIst: {
      borderTop: "1px solid #404040",
      backgroundColor: "#565656",
    },

    tabManager: {
      backgroundColor: "#565656",
    },
    fileManager: {
      display: "flex",
      flexDirection: "row",
    },

    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      color: "white",
    },
  };
  const onTermInit = (term) => {
    setTerminalDisplay(term);
    term.reset();
    // term.loadAddon();

    //term.open(document.getElementById('terminal'));
    //fitAddon.fit();

    const terminalInfo = {
      rows: term.rows,
      cols: term.cols,
      // Add other necessary properties here
    };
    ipcRenderer.send("asynchronous-message", terminalInfo);
    ipcRenderer.invoke("prepare-input", terminalInfo);
    handleResize(40);
  };

  const onTermDispose = (term) => {
    setTerminalDisplay(null);
  };

  let count = 0;
  const handleData = (data) => {
    if (TerminalDisplay) {
      const code = data.charCodeAt(0);
      // If the user hits enter, submit the input
      if (code === 13) {
        ipcRenderer.invoke("user-input", input + "\r"); // Send input to pty
        console.log("input is " + input);
        setInput(""); // Clear the input
      } else if (code == 127) {
        console.log(input.length);
        setInput((prevInput) => prevInput.substring(0, prevInput.length - 1));
        TerminalDisplay.write("\x1b[D\x1b[P");
        //TerminalDisplay.resize(100,);
      } else {
        TerminalDisplay.write(data);
        //console.log("data is" + data);
        setInput((prevInput) => prevInput + data);
      }
    }
  };

  const folderOnChange = async (e) => {
    if (!e.target.files?.length) return;
    const files = e.target.files;
    const folderPath = files[0].path;
    const dotIdx = folderPath.lastIndexOf("/");
    let folder;
    if (!dotIdx) {
      folder = folderPath;
    } else {
      folder = folderPath.substring(0, dotIdx);
    }
    console.log(folder);
    const filesAndFolders = await ipcRenderer.invoke("get-directory", folder);
    setFiles(filesAndFolders);
    setFolderPath(folder);
  };

  const saveFile = () => {
    console.log(filePath);
    console.log(code);
    ipcRenderer.invoke("save-file", filePath, code);
  };

  // maybe I make a list with maps --> then list of inside files?

  // function Item(props) {
  //   return <li>{props.value}</li>;
  // }

  function MyList({ items }) {
    if (items.length == 0) {
      return <div>No items to display</div>;
    }

    return (
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            style={{ padding: "2px", fontSize: "14px" }}
            onClick={() => setEditorFromFile(item)}
          >
            <li
              style={{
                listStyleType: "none",
                display: "flex",
                alignItems: "center",
                backgroundColor: "transparent", // Set initial background color
                transition: "background-color 0.3s ease", // Add transition for smooth effect
                cursor: "pointer",
              }}
              onMouseEnter={(e) => handleMouseEnter(e)}
              onMouseLeave={(e) => handleMouseLeave(e)}
            >
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
              >
                {renderFileIcon(item.name)}
                <p>{item.name.replace("Name: ", "")}</p>
              </div>
            </li>
          </div>
        ))}
      </div>
    );
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)"; // Change background color on hover
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent"; // Reset background color on mouse leave
  };
  const renderFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "v":
        return (
          <img
            src={verilogIcon}
            style={{
              paddingTop: "8px",
              width: "24px", // Increase the width
              height: "24px", // Increase the height
              objectFit: "contain",
              paddingLeft: "4px",
            }}
          />
        );
      case "sv":
        return (
          <img
            src={systemVerilogIcon}
            style={{
              paddingTop: "8px",
              paddingLeft: "4px",
              height: "24px" /* Container height */,
              width: "24px" /* Container width */,
              objectFit: "cover",
            }}
          />
        );
      default:
        return (
          <img
            src={fileIconNew}
            style={{ paddingTop: "12px", height: "24px", width: "24px" }}
          />
        );
    }
  };
  function getLanguageFromExtension(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "css":
      case "html":
      case "python":
      case "dart":
      case "json":
        return extension;
      case "lock":
        return "yaml";
      case "sv":
        return "systemverilog";
      case "v":
        return "verilog";
      default:
        return "plaintext";
    }
  }

  async function setEditorFromFile(fileName) {
    // add function to check if directory here !
    //

    let finalName = fileName.path + "/" + fileName.name;

    const invokeReturn = await ipcRenderer.invoke("get-code", finalName);
    //console.log(invokeReturn);

    let typist = typeof invokeReturn;
    if (typist == "string") {
      if (openTabs.indexOf(fileName.name) == -1) {
        addTab(fileName);
      } else {
        setActiveFile(openTabs.indexOf(fileName.name));
      }

      setCode(invokeReturn);
      //console.log(newCode);
      let newLanguage = "javascript";
      const extension = finalName.split(".").pop();
      console.log(extension);
      if (["css", "html", "python", "dart", "json"].includes(extension)) {
        newLanguage = extension;
      } else if ("lock".includes(extension)) {
        newLanguage = "yaml";
      } else if ("sv".includes(extension)) {
        newLanguage = "systemverilog";
      } else if ("v".includes(extension)) {
        newLanguage = "verilog";
      } else {
        newLanguage = "plaintext";
      }
      setLanguage(newLanguage);
      console.log(newLanguage + "new language ");
      console.log(language + "language");
      setFilePath(finalName);
    } else {
      console.log("opening new folder");
    }
  }
  async function setEditor(fileName) {
    let finalName = fileName.path + "/" + fileName.name;
    const invokeReturn = await ipcRenderer.invoke("get-code", finalName);

    if (typeof invokeReturn === "string") {
      setCode(invokeReturn);
      let newLanguage = getLanguageFromExtension(finalName);
      setLanguage(newLanguage);
      setFilePath(finalName);
    } else {
      console.log("opening new folder");
    }
  }
  const addTab = async (fileName) => {
    //const finalName = fileName.path + "/" + fileName.name;
    setOpenTab((prevOpenTabs) => [...prevOpenTabs, fileName.name]);
    setOpenFile((prevOpenFiles) => [...prevOpenFiles, fileName]);
    setActiveFile(openFiles.length);
  };
  function handleResize(size) {
    if (TerminalDisplay) {
      console.log(size);
      // TerminalDisplay.open(document.getElementById('terminalC'));
      // fitAddon.fit();
      // console.log(TerminalDisplay.getFont());
      let cols = Math.floor(width / 14);
      let rows = Math.floor((height * (size / 100)) / 24);
      TerminalDisplay.resize(cols, rows);
      // let font = TerminalDisplay?.getFont().charHeight;
    }
  }

  const handleTabClick = (index) => {
    if (index == 1) {
      openWaveForm();
    }
    if (index == 2) {
      // openWaveDrom();
    }
    setActiveTab(index);
  };

  const handleFileClick = async (index) => {
    setActiveFile(index);
    await setEditor(openFiles[index]);
  };

  return (
    <div id="container" style={styles.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "5%",
          width: "100%",
          borderBottom: "1px solid #565656",
          backgroundColor: "#323232",
          gap: "2%",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <label htmlFor="folderInput">
            <img
              style={{
                width: "24px",
                height: "24px",
                fill: "#E74C3C",
                paddingTop: "8px",
              }}
              src={openIcon}
              alt="Folder Icon"
            />
          </label>
          <input
            type="file"
            id="folderInput"
            className="hiddenInput"
            directory=""
            webkitdirectory=""
            onChange={folderOnChange}
            style={{ overflow: "hidden", display: "none" }}
          />
        </div>
        <button
          style={{ backgroundColor: "transparent", border: "none" }}
          onClick={saveFile}
        >
          <img
            src={saveIcon}
            style={{ width: "24px", height: "24px" }}
            alt="Save Icon"
          />
        </button>
        <Popup
          trigger={
            <button style={{ backgroundColor: "red", border: "none" }}>
              Settings
            </button>
          }
          position="center"
          contentStyle={{
            position: "fixed",
            top: "-50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            zIndex: 9999,
            width: "20%",
            height: "20%",
          }}
        >
          <div>Popup content here !!</div>
        </Popup>
      </div>

      <PanelGroup direction="horizontal">
        <Panel minSize={5} defaultSize={10} maxSize={25}>
          <div id="sideBary" style={styles.sideBar}>
            <MyList items={files} />
          </div>
        </Panel>
        <PanelResizeHandle style={{ border: "0.5px solid #404040" }} />
        <Panel defaultSize={80}>
          <PanelGroup direction="vertical">
            <div className={styles.fileManager}>
              <div
                style={{
                  backgroundColor: "#141414",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {openTabs.map((tab, index) => (
                  <button
                    style={{
                      backgroundColor:
                        activeFile === index ? "#232323" : "#141414", // Change colors as desired
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      //backgroundColor: "#141414",
                      borderRight: "1px solid #404040",
                      //borderLeft: "1px solid #404040",
                      // borderTop: "1px solid #404040",
                      paddingRight: "5%",
                      paddingLeft: "5%",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                    key={index}
                    className={activeFile === index ? "active" : ""}
                    onClick={() => handleFileClick(index)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <Panel minSize={25} defaultSize={75}>
              {openFiles.length > 0 && (
                <div style={styles.editor}>
                  <Editor
                    height="90vh"
                    language={language}
                    value={code}
                    path={filePath} // Add this line
                    theme="vs-dark"
                    onChange={(newCode) => {
                      setCode(newCode);
                    }}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: {
                        enabled: false,
                      },
                      // Enable linting
                      lint: {
                        enabled: true,
                      },
                    }}
                  />
                </div>
              )}
            </Panel>
            <PanelResizeHandle style={{ borderTop: "1px solid #404040" }} />
            <Panel
              id="term-panel"
              minSize={10}
              defaultSize={40}
              onResize={(size) => handleResize(size)}
            >
              <div className={styles.tabManager}>
                <div className={{ backgroundColor: "#141414" }}>
                  {tabs.map((tab, index) => (
                    <button
                      style={{
                        backgroundColor:
                          activeTab === index ? "#232323" : "#141414", // Change colors as desired
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRight: "1px solid #404040",
                        paddingRight: "2.5%",
                        paddingLeft: "2.5%",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                      }}
                      key={index}
                      className={activeTab === index ? "active" : ""}
                      onClick={() => handleTabClick(index)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className={styles.tabContent}>
                  {activeTab === 0 && (
                    <div style={styles.terminal}>
                      <Xterm
                        ref={(ref) => {
                          setTerminal(ref ? ref.getTerminal() : null);
                        }}
                        onInit={onTermInit}
                        onDispose={onTermDispose}
                        onData={handleData}
                        fontSize={14}
                        // scrollBack={}
                        //ssr={false}
                      />
                    </div>
                  )}
                  {activeTab === 1 && (
                    <div style={styles.waveFormPanel}>
                      {isLoadingWaveform ? (
                        <div style={styles.loadingContainer}>
                          <p>Loading waveform...</p>
                        </div>
                      ) : waveformData ? (
                        <WaveformViewer data={waveformData} />
                      ) : (
                        <div style={styles.loadingContainer}>
                          <p>No waveform data available</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
