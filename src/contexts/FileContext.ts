import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import * as monaco from "monaco-editor";
const { ipcRenderer } = window.require("electron");

interface FileEditorContextType {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  filePath: string;
  setFilePath: (filePath: string) => void;
  openFiles: any[];
  setOpenFiles: (files: any[]) => void;
  activeFile: number;
  setActiveFile: (index: number) => void;
  openTabs: string[];
  setOpenTabs: (tabs: string[]) => void;
  handleFileClick: (index: number) => void;
  setEditorFromFile: (fileName: any) => Promise<void>;
  addTab: (fileName: any) => Promise<void>;
}
