// Should handle different models

import React, { useState, useEffect, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
const { ipcRenderer } = window.require("electron");

interface Props {
  language: string;
  code: string;
  filePath: string;
}

const EditorComponent: React.FC<Props> = ({
  code: initialCode,
  language: initialLanguage,
  filePath: initialFilePath,
}) => {
  const [count, setCount] = useState<number>(0);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [code, setCode] = useState<string>(initialCode);
  const [filePath, setFilePath] = useState<string>(initialFilePath);
  const [editorContent, setEditorContent] = useState<string>(initialCode);

  const editorRef = useRef<monaco.editor.ICodeEditor | null>(null);

  useEffect(() => {
    setLanguage(initialLanguage);
    setCode(initialCode);
    setFilePath(initialFilePath);
    setEditorContent(initialCode);
  }, [initialLanguage, initialCode, initialFilePath]);

  useEffect(() => {
    if (editorRef.current && filePath) {
      const editor = editorRef.current;
      const model = editor.getModel();
      if (
        !model ||
        model.uri.toString() !== monaco.Uri.file(filePath).toString()
      ) {
        const newModel =
          monaco.editor.getModel(monaco.Uri.file(filePath)) ||
          monaco.editor.createModel(code, language, monaco.Uri.file(filePath));
        editor.setModel(newModel);
        setEditorContent(code);
      }
    }
  }, [filePath, language, code]);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco,
  ) => {
    editorRef.current = editor;
    if (filePath) {
      const model =
        monacoInstance.editor.getModel(monacoInstance.Uri.file(filePath)) ||
        monacoInstance.editor.createModel(
          code,
          language,
          monacoInstance.Uri.file(filePath),
        );
      editor.setModel(model);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
    }
  };

  loader.config({ monaco });

  return (
    <div>
      <Editor
        height="90vh"
        language={language}
        value={editorContent}
        theme="vs-dark"
        path={filePath}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          minimap: {
            enabled: false,
          },

          // Enable linting
        }}
      />
    </div>
  );
};

export default EditorComponent;
