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
import { WaveGraph } from "d3-wave";
import { VcdParser } from "./Parser.js";
import WaveformGraph from "./WaveformGraph";

// save original code, if new is different from original, then prompt user to save once user saves update original.

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

function App() {
  const [TerminalDisplay, setTerminalDisplay] = useState(null);
  const [input, setInput] = useState("");
  const [lastLine, setLastLine] = useState("");
  const [code, setCode] = useState("");
  // const [file, setFile] = useState();
  const [filePath, setFilePath] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [files, setFiles] = useState([]);
  const fitAddon = new FitAddon();
  const [terminal, setTerminal] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { width, height } = useWindowDimensions();
  const termPanelElement = getPanelElement("term-panel");
  const [parseData, setParsedData] = useState();

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Terminal", "Wave Form Viewer"];

  // const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const folderInput = useRef(null);
  const openWaveForm = async () => {
    console.log("file has bene found");
    // const fileContents = await readFileContents("./test/swerv1.vcd");

    // switch this to work with relative paths
    const invokeReturn = await ipcRenderer.invoke(
      "get-code",
      "/Users/farhankhan/Maxima2/src/test/swerv1.vcd",
    );
    console.log(invokeReturn);
    console.log("filedone");
    const parser = new VcdParser();
    parser.parse_str(invokeReturn);
    console.log(parser);
    setParsedData(parser.scope.toJson());
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
      backgroundColor: "black",
      color: "white",
      height: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      // padding: 0,
      margin: 0,
      paddingBottom: "0px",
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
    },
    sideBar: {
      top: 0,
      padding: 0,
      margin: 0,
      width: "100%",
      height: "80vw",
      backgroundColor: "#333" /* Change the background color as desired */,
    },

    waveFormPanel: {
      top: 0,
      padding: 0,
      margin: 0,
      height: "100%",
      width: "100%",
      height: "80vw",
      backgroundColor: "#333" /* Change the background color as desired */,
    },

    tabIst: {
      borderTop: "2px solid #565656",
      backgroundColor: "#565656",
    },

    tabManager: {
      backgroundColor: "#565656",
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
    if (!Array.isArray(items)) {
      return <div>No items to display</div>;
    }
    async function setEditor(fileName) {
      // add function to check if directory here !
      //
      let finalName = fileName.path + "/" + fileName.name;
      console.log(finalName);
      //ipcRenderer.send("get-code", finalName);
      // ipcRenderer.on("directory-contentsInside", (event, files) => {
      //   console.log("Files in directory:", files);
      // }
      // );
      const invokeReturn = await ipcRenderer.invoke("get-code", finalName);
      console.log(invokeReturn);

      let typist = typeof invokeReturn;
      if (typist == "string") {
        setCode(invokeReturn);
        //console.log(newCode);
        let newLanguage = "javascript";
        const extension = finalName.split(".").pop();
        if (["css", "html", "python", "dart", "json"].includes(extension)) {
          newLanguage = extension;
        }
        if ("lock".includes(extension)) {
          newLanguage = "yaml";
        }
        if ("sv".includes(extension)) {
          newLanguage = "systemverilog";
        }
        if ("v".inclues(extension)) {
          newLanguage = "verilog";
        }

        setLanguage(newLanguage);
        //console.log(language);
        setFilePath(finalName);
      } else {
        console.log("opening new folder");
      }
    }

    return (
      <div>
        <h2>List:</h2>
        {items.map((item, index) => (
          <div
            key={index}
            style={{ border: "3px solid rgb(212, 212, 212)", padding: "2px" }}
            onClick={() => setEditor(item)}
          >
            <li style={{ listStyleType: "none" }}>
              <p>{item.name.replace("Name: ", "")}</p>
            </li>
          </div>
        ))}
      </div>
    );
  }

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
    setActiveTab(index);
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        className="hidden"
        directory=""
        webkitdirectory=""
        onChange={folderOnChange}
      />
      <button onClick={saveFile}>Save Changes</button>
      <PanelGroup direction="vertical">
        <Panel defaultSize={80}>
          <PanelGroup direction="horizontal">
            <Panel minSize={5} defaultSize={10}>
              <div style={styles.sideBar}>
                <MyList items={files} />
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={25} defaultSize={75}>
              <div style={styles.editor}>
                <Editor
                  height="90vh"
                  defaultLanguage="javascript"
                  language={language}
                  value={code}
                  theme="vs-dark"
                  onChange={(newCode) => {
                    setCode(newCode);
                  }}
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                />
              </div>
            </Panel>
            <PanelResizeHandle />
          </PanelGroup>
        </Panel>
        <PanelResizeHandle style={{ borderTop: "2px solid #565656" }} />
        <Panel
          id="term-panel"
          minSize={10}
          defaultSize={40}
          onResize={(size) => handleResize(size)}
        >
          <div className={styles.tabManager}>
            <div className={{ backgroundColor: "#565656" }}>
              {tabs.map((tab, index) => (
                <button
                  style={{
                    backgroundColor: activeTab === index ? "#565656" : "black", // Change colors as desired
                    color: "white",
                    border: "none",
                    borderRight: "2px solid #565656",
                    paddingRight: "2%",
                    paddingLeft: "2%",
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
                  <WaveformGraph parsedData={parseData} />
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
