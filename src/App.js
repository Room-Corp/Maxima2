// @ts-nocheck
import React from "react";
import { useState, useEffect, useRef } from "react";
const { ipcRenderer } = window.require("electron");

import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  getPanelElement,
} from "react-resizable-panels";
import saveIcon from "./icons/saveicon.png";
import openIcon from "./icons/openfile.png";
import Popup from "reactjs-popup";
import { parseVCD } from "./vcdParser.ts";
import WaveformViewer from "./WaveformViewer.tsx";
import TerminalComponent from "./components/TerminalPanel.tsx";
import Sidebar from "./components/SidePanel.tsx";
import EditorCopmponent from "./components/EditorPanel.tsx";

import { useEditor } from "./hooks/useEditorFunctions.ts";
import { useWindowDimensions } from "./hooks/useWindowDimensions.ts";

// window dimensions hook --> figure out how to make this one
// save original code, if new is different from original, then prompt user to save once user saves update original.
// potentially remove tabbing from here as well --> move it to it's own function we will see how well this works out
// i think what's beneficial here is that the tabbing can be removed and passed to props the editor layout component

/*
Remaining Pieces to Abstract Out 🔎:
- Bottom Bar (terminal handling)
- Top bar (file handling)


After these pieces are done can start building out new UI

*/

function App() {
  const {
    code,
    setCode,
    filePath,
    language,
    openTabs,
    openFiles,
    activeFile,
    saveFile, // take out save file --> instead will take a prop to the current file in it's own hook
    setEditorFromFile,
    addTab,
    handleFileClick,
  } = useEditor();

  const [files, setFiles] = useState([]);
  const { width, height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Terminal", "Wave Form Viewer"];
  const [folderPath, setFolderPath] = useState([]);
  const [waveformData, setWaveformData] = useState(null);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(false);

  // opens wave form --> BottomBar
  const openWaveForm = async () => {
    console.log("file has bene found");
    const vcdFile = await ipcRenderer.invoke("get-vcd", filePath, folderPath);
    const parsedData = await parseVCD(vcdFile);
    setWaveformData(parsedData);
  };

  // Move to editor

  // leave this in main or abstract to css class
  const styles = {
    container: {
      color: "white",
      height: "100%",
      display: "flex",

      flexDirection: "column",

      margin: 0,
      paddingBottom: "0px",
      padding: 0,
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

      overflowY: "auto",
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

      backgroundColor: "transparent",
    },
    waveFormPanel: {
      top: 0,
      padding: 0,
      margin: 0,
      height: "100%",
      width: "100%",
      height: "80vw",
    },

    tabIst: {
      borderTop: "1px solid #404040",
      backgroundColor: "#141414",
      height: "100%",
    },
    tabContent: { backgroundColor: "#141414", height: "100%" },

    tabManager: {
      backgroundColor: "#141414",
      height: "100%",
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
      backgroundColor: "#141414",
    },
  };

  // file system hook
  // this will be handled my top bar --> moved to hook with all file data --> top bar will take props for these

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

  // Bottom bar tab click -- Opens wave form --> Bottom Bar
  const handleTabClick = (index) => {
    if (index == 1) {
      openWaveForm();
    }
    setActiveTab(index);
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
            <button
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "none",
              }}
            >
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
            <Sidebar items={files} setEditorFromFile={setEditorFromFile} />
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
                  <EditorCopmponent
                    language={language}
                    code={code}
                    filePath={filePath}
                  />
                </div>
              )}
            </Panel>
            <PanelResizeHandle
              style={{
                borderTop: "1px solid #404040",
              }}
            />
            <Panel
              style={{ backgroundColor: "#141414" }}
              minSize={10}
              defaultSize={40}
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
                <div style={{ ...styles.tabContent, overflow: "auto" }}>
                  {activeTab === 0 && (
                    <div>
                      <TerminalComponent />
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
