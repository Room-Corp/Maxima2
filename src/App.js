import React from "react";
import { useState, useEffect, useRef } from "react";
const { ipcRenderer } = window.require("electron");
import { Xterm } from "xterm-react";
import "xterm/css/xterm.css";
import { FitAddon } from 'xterm-addon-fit';
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Panel, PanelGroup, PanelResizeHandle, getPanelElement, } from "react-resizable-panels";

// save original code, if new is different from original, then prompt user to save once user saves update original.


function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

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

 // const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());


  const folderInput = useRef(null);

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
      // do stuffs
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
      paddingBottom: "0px"
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
      height:"100%", 
      backgroundColor: "#f0f0f", 
      overflowY:"auto",
      //float:"bo
      // position:"absolute",
      borderTop: "10px solid #f0f0f0",
      //padding: "10px" ,
     // position: "fixed"
      
      //overflow:"auto",
      
    },
    editor: {
      width: "100%",
  
      //position: "relative",
      //marginLeft: "10%",
    },
    sideBar: {
      top: 0,
      padding: 0,
      margin: 0,
      width: "100%",
      height: "80vw",
      backgroundColor: "#333" /* Change the background color as desired */,
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
    ipcRenderer.send("prepare-input", terminalInfo);
    handleResize(40);
   
    //term.loadAddon(fitAddon);
    //TerminalDisplay.emit('scroll', term.ydisp);
    //fitAddon.fit();
    //ipcRenderer.send("user-input", "export PS1=\"\\\\u@\h \\\\W]\\\\$\"" + "\r");
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
        ipcRenderer.send("user-input", input + "\r"); // Send input to pty
        console.log("input is " + input);
        setInput(""); // Clear the input
      } else if (code == 127) {
        console.log(input.length)
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
    //use ipc renderer here
    //const filesAndFolders = await ipcRenderer.send("get-directory", folder);
    ipcRenderer.send("get-directory", folder);

    // Listen for response from main process
    ipcRenderer.on("directory-contents", (event, files) => {
      // Handle received files
      setFiles(files);
      console.log("Files in directory:", files);
      // Update your front end with the file names
    });

    // Listen for errors from main process
    ipcRenderer.on("directory-error", (event, errorMessage) => {
      // Handle errors
      console.error("Error fetching directory:", errorMessage);
    });
    //setFiles(filesAndFolders);
    console.log(files[0].name);
  };

  const saveFile = () => {
    console.log(filePath);
    console.log(code);
    ipcRenderer.send("save-file", filePath, code);
  };

  // function Item(props) {
  //   return <li>{props.value}</li>;
  // }

  function MyList({ items }) {
    if (!Array.isArray(items)) {
      return <div>No items to display</div>;
    }
    function setEditor(fileName) {
      let finalName = fileName.path + "/" + fileName.name;
      console.log(finalName);
      ipcRenderer.send("get-code", finalName);
      ipcRenderer.on("extracted-code", (event, newCode) => {
        setCode(newCode);
        //console.log(newCode);
        let newLanguage = "javascript";
        const extension = finalName.split(".").pop();
        if (["css", "html", "python", "dart", "json"].includes(extension)) {
          newLanguage = extension;
        }
        if("lock".includes(extension)) {
          newLanguage = "yaml";
        }

        setLanguage(newLanguage);
        console.log(language);
        setFilePath(finalName);
      });

      // Read file as text
      //reader.readAsText(fileName);
    }

    return (
      <div>
        <h2>List:</h2>
        {items.map((item, index) => (
          <div key={index} onClick={() => setEditor(item)}>
            <li>
              <p>Name: {item.name}</p>
            </li>
          </div>
        ))}
      </div>
    );
  }

  function handleResize(size) {

    if(TerminalDisplay) {
    console.log(size);
   // TerminalDisplay.open(document.getElementById('terminalC'));
   // fitAddon.fit();
   // console.log(TerminalDisplay.getFont());
  let cols = Math.floor(width / 14);
	let rows = Math.floor( height * (size/100) / 24);
  TerminalDisplay.resize(cols, rows);
  // let font = TerminalDisplay?.getFont().charHeight;
  }


  }

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
        </Panel >
        <PanelResizeHandle/>
        <Panel minSize={25}defaultSize={75}> 
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
        </PanelGroup>
        </Panel>
        <PanelResizeHandle/>
        <Panel id="term-panel" minSize={10} defaultSize={40} onResize= {(size) => handleResize(size)}> 
        <div style={styles.terminal} >
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
  
      </Panel> 
      
      </PanelGroup>
      
    </div>
  );
}

export default App;
{/* <div style={styles.terminal}>
        <Xterm
          onInit={onTermInit}
          onDispose={onTermDispose}
          onData={handleData}
        />
      </div> */}