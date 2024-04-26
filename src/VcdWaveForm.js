import React, { useEffect, useRef } from "react";
const { ipcRenderer } = window.require("electron");

const VCDromComponent = ({ vcdPath }) => {
  const divRef = useRef(null);

  useEffect(() => {
    const initVCDrom = async () => {
      const divId = divRef.current.id;
      await ipcRenderer.invoke("initVCDrom", divId, vcdPath);
    };

    initVCDrom();
  }, [vcdPath]);

  return <div ref={divRef} id="vcdrom-container"></div>;
};

export default VCDromComponent;
