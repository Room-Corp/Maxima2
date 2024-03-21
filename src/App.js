import React from "react";
import { useState, useEffect, useRef } from "react";
const { ipcRenderer } = window.require("electron");
import { Xterm } from "xterm-react";
import "xterm/css/xterm.css";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// save original code, if new is different from original, then prompt user to save once user saves update original.

function App() {
  const [TerminalDisplay, setTerminalDisplay] = useState(null);
  const [input, setInput] = useState("");
  const [lastLine, setLastLine] = useState("");
  const [code, setCode] = useState("");
  // const [file, setFile] = useState();
  const [filePath, setFilePath] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [files, setFiles] = useState([]);

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
      height: "100vh",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      padding: 0,
      margin: 0,
    },
    terminal: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#f0f0f",
      //padding: "10px" ,
      borderTop: "10px solid #f0f0f0",
    },
    editor: {
      width: "90%",
      height: "80%",
      position: "relative",
      marginLeft: "10%",
    },
    sideBar: {
      width: "10%",
      height: "80%",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "#333" /* Change the background color as desired */,
    },
  };

  const onTermInit = (term) => {
    setTerminalDisplay(term);
    term.reset();
    const terminalInfo = {
      rows: term.rows,
      cols: term.cols,
      // Add other necessary properties here
    };
    ipcRenderer.send("asynchronous-message", terminalInfo);
    ipcRenderer.send("prepare-input", terminalInfo);
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
        setInput((prevInput) => prevInput.substring(0, prevInput.length - 1));
        TerminalDisplay.write("\x1b[D\x1b[P");
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
        <div style={styles.sideBar}>
          <MyList items={files} />
        </div>
      </div>
      <div style={styles.terminal}>
        <Xterm
          onInit={onTermInit}
          onDispose={onTermDispose}
          onData={handleData}
        />
      </div>
    </div>
  );
}

export default App;
