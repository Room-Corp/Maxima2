import { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

interface FileInfo {
  name: string;
  path: string;
}

export function useEditor() {
  const [code, setCode] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [language, setLanguage] = useState<string>("verilog");
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [openFiles, setOpenFiles] = useState<FileInfo[]>([]);
  const [activeFile, setActiveFile] = useState<number>(-1);

  const saveFile = () => {
    ipcRenderer.invoke("save-file", filePath, code);
  };

  const setEditorFromFile = async (fileName: FileInfo) => {
    let finalName = fileName.path + "/" + fileName.name;
    const invokeReturn = await ipcRenderer.invoke("get-code", finalName);

    if (typeof invokeReturn === "string") {
      if (!openTabs.includes(fileName.name)) {
        addTab(fileName);
        setCode(invokeReturn);
      } else {
        setActiveFile(openTabs.indexOf(fileName.name));
      }

      let newLanguage = determineLanguage(finalName);
      setLanguage(newLanguage);
      setFilePath(finalName);
    } else {
      console.log("opening new folder");
    }
  };

  const addTab = (fileName: FileInfo) => {
    setOpenTabs((prevOpenTabs) => [...prevOpenTabs, fileName.name]);
    setOpenFiles((prevOpenFiles) => [...prevOpenFiles, fileName]);
    setActiveFile(openFiles.length);
  };

  const handleFileClick = async (index: number) => {
    setActiveFile(index);
    await setEditorFromFile(openFiles[index]);
  };

  const determineLanguage = (fileName: string): string => {
    const extension = fileName.split(".").pop() || "";
    if (["css", "html", "python", "dart", "json"].includes(extension)) {
      return extension;
    } else if (extension === "lock") {
      return "yaml";
    } else if (extension === "sv") {
      return "systemverilog";
    } else if (extension === "v") {
      return "verilog";
    } else {
      return "plaintext";
    }
  };

  return {
    code,
    setCode,
    filePath,
    language,
    openTabs,
    openFiles,
    activeFile,
    saveFile,
    setEditorFromFile,
    addTab,
    handleFileClick,
  };
}
