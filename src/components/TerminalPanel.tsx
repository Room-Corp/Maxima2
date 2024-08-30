// can now throw this into a container, which would fix resize issues, but for now let's keep trucking
// need to change color

import React, { useState, useEffect, useRef } from "react";
const { ipcRenderer } = window.require("electron");
import { useXTerm } from "react-xtermjs";
import { FitAddon } from "@xterm/addon-fit";

interface Props {}

const TerminalComponent: React.FC<Props> = () => {
  const { instance, ref } = useXTerm();
  const fitAddon = useRef(new FitAddon());
  // const rows = Math.ceil(document.body.clientHeight / 16);
  // const cols = Math.ceil(document.body.clientWidth / 8);

  useEffect(() => {
    if (!instance) return;

    instance.loadAddon(fitAddon.current);

    const handleResize = () => {
      fitAddon.current.fit();
      const rows = instance.rows;
      const cols = instance.cols;
      ipcRenderer.send("terminal-resize", { rows, cols });
    };

    const terminalInfo = {
      rows: instance.rows,
      cols: instance.cols,
    };

    ipcRenderer.send("asynchronous-message", terminalInfo);
    ipcRenderer.invoke("prepare-input", terminalInfo);

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial fit

    const ptyDataListener = (event: any, data: string) => {
      if (data) {
        instance.write(data);
      }
    };

    ipcRenderer.on("pty-data", ptyDataListener);

    instance.onData((data) => {
      ipcRenderer.invoke("user-input", data);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      ipcRenderer.removeListener("pty-data", ptyDataListener);
    };
  }, [instance]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
};

export default TerminalComponent;
