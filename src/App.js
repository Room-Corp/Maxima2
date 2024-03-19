import React from "react";
import { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");
import { Xterm } from "xterm-react";
import "xterm/css/xterm.css";
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from "monaco-editor";




function App() {

  const [TerminalDisplay, setTerminalDisplay] = useState(null);
  const [input, setInput] = useState("");
  const [lastLine, setLastLine] = useState("");
  const [code, setCode] = useState('');
  const [file, setFile] = useState(); 
  const [language, setLanguage] = useState('javascript');

  // ipcRenderer.on('pty-data', (event, data) => {
  //   if (data && TerminalDisplay) {
  //     console.log("data: " + data);
  //          TerminalDisplay.write(data);
  //     } else {
  //       console.log("bozo");
        
  //     }
  //   // do stuffs
  // });

  useEffect(() => {
    console.log("ran");
    ipcRenderer.on('pty-data', (event, data) => {
      if (data && TerminalDisplay) {
        console.log("data: " + data);
             TerminalDisplay.write(data);
        } else {
          console.log("bozo");
          
        }
      // do stuffs
    });
    return () => {
     ipcRenderer.removeAllListeners('pty-data');
    };
  });

  useEffect(() => {
    if (file) {
      var reader = new FileReader();
      reader.onload = async (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
      let newLanguage = 'javascript';
      const extension = file.name.split('.').pop();
      if (['css', 'html', 'python', 'dart'].includes(extension)) {
        newLanguage = extension;
      }
      setLanguage(newLanguage);
    }
  }, [file]);

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
      width: "100%",
      height:"80%",
    }
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
      } else if(code == 127) {
          setInput((prevInput) => prevInput.substring(0, prevInput.length - 1));
          TerminalDisplay.write("\x1b[D\x1b[P");
      } else {
        TerminalDisplay.write(data);
        //console.log("data is" + data);
        setInput((prevInput) => prevInput + data);
      }
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const saveFile = () => {
    console.log(file.path);
    console.log(code);
    ipcRenderer.send("save-file", file.path, code); 
    console.log(Editor.onDidChangeModelContent);
  }
  return (
    <div style={styles.container}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={saveFile}>
      Save Changes
    </button>
      <div style={styles.editor}>
        <Editor height="90vh" defaultLanguage="javascript" language={language} value={code} theme="vs-dark" onChange={(newCode) => { setCode(newCode); }}options={{
            minimap: {
              enabled: false,
            },
      }}/>
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
