import React, { useEffect, useRef } from "react";
const { ipcRenderer } = window.require("electron");

const WaveDromContainer = ({ divName, vcdPath }) => {
  const waveContainerRef = useRef(null);

  useEffect(() => {
    const openWaveDrom = () => {
      ipcRenderer.send("get-wave", vcdPath, divName);
    };

    if (waveContainerRef.current) {
      openWaveDrom();
    }
  }, [divName, vcdPath]);

  return <div id={divName} ref={waveContainerRef}></div>;
};

export default WaveDromContainer;
