import React from "react";
import { useState } from "react";
const { ipcRenderer } = window.require('electron');
import {Xterm} from "xterm-react";
import "xterm/css/xterm.css";
//import * as pty from 'node-pty';
//import * as pty from 'node-pty';

// import * as pty from 'node-pty';

function App() {
  // const startProcess = () => {
  //   const terminal = new Terminal();
  //   ipcRenderer.send('asynchronous-message', TerminalDisplayl);
  // };
  const [TerminalDisplay, setTerminalDisplay] = useState(null);
  const [input, setInput] = useState("");

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
      backgroundColor: "#f0f0f" /* Example background color */,
      /* Example border */
      padding: "20px" /* Example padding */,
      borderTop: "10px solid #f0f0f0",
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
    ipcRenderer.send('asynchronous-message', terminalInfo);
  };
  const onTermDispose = (term) => {
    setTerminalDisplay(null);
  };
  // const handleData = (data) => {
  //   if (TerminalDisplay) {
  //     TerminalDisplay.write(data);
  //   }
  // };
  
  let count = 0;
  const handleData = (data) => {
    console.log("interferred")
    if (TerminalDisplay) {
        const code = data.charCodeAt(0);
        // If the user hits enter, submit the input
        if (code === 13) {
            ipcRenderer.send("user-input", input + "\r"); // Send input to pty
            console.log("input is " + input);
            setInput(""); // Clear the input
        } else {
            // Add general key press characters to the terminal
            TerminalDisplay.write(data);
            console.log("data is" + data);
            
            // Append non-enter key data to the input
            //setZonsole((prevInput) => prevInput + data);
            setInput((prevInput) => prevInput + data );
        }
    }
};

  ipcRenderer.on("pty-data", (event, data) => {
    
    if(data && TerminalDisplay) {
      TerminalDisplay.write(data);
      console.log(data);
    }
  });

  
  // ipcRenderer.on("pty-data", (event, data) => {
  //   handleData(data);
  // });


  return (
    <div style={styles.container}>
      <h1>💻 Maxima ⚛️</h1>
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
