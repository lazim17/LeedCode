import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";
import "./CodeEditor.css";
import * as monaco from 'monaco-editor';

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [error, setError] = useState("");
  const [compilationMessage, setCompilationMessage] = useState("");


  monaco.editor.defineTheme('myTheme', {
    base: 'vs', // Use the 'vs' as the base theme
    inherit: true, // Inherit styles from the base theme
    rules: [
      { token: 'comment', foreground: '008000' }, // Define the color for comments
      { token: 'string', foreground: '800000' },  // Define the color for strings
      // Add more token rules as needed
    ],
    colors: {
      'editor.background': '#B9C2C6', // Set the editor background color
    },
  });

  const compileCode = async () => {
    if (selectedLanguage) {
      try {
        const response = await axios.post(`/compile`, {
          code,
          language: selectedLanguage,
        });
        if (response.data === "Compilation Successful") {
          setCompilationMessage("Compilation Successful");
          setError("");
        } else {
          setCompilationMessage("Compilation Failed");
          setError(response.data);
        }
      } catch (error) {
        console.error(error);
        setCompilationMessage("An error occurred while checking the code.");
        setError("");
      }
    } else {
      setCompilationMessage("Please select a language.");
      setError("");
    }
  };

  const runCode = async () => {
    if (selectedLanguage) {
      try {
        const response = await axios.post(`/run`, {
          code,
          language: selectedLanguage,
        });
        if (selectedLanguage === "python") {
          if (response.data.error) {
            setError(response.data.error);
            setCompilationMessage("");
          } else {
            setError("");
            setCompilationMessage("");
          }
        }
        setOutput(response.data.output);
      } catch (error) {
        console.error(error);
        setOutput("An error occurred while running the code.");
        setError("");
        setCompilationMessage("");
      }
    } else {
      setOutput("Please select a language.");
      setError("");
      setCompilationMessage("");
    }
  };

  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
  };

  return (
    <div>
      <nav>
        <h2>LeedCode</h2>&nbsp;( Pun Intended )
      </nav>
      <div className="canvas">
        <div className="question-container">
        <div className="question-sidebar">
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>5</button>
              <button>6</button>
          </div>
          <div className="question">
          <h3>Question Title</h3>
          <h4>Problem</h4>
          <p>
            Given a square matrix, calculate the absolute difference between the
            sums of its diagonals. For example, the square matrix is shown
            below:
          </p>
          <h4>Function Description</h4>
          <p>
            Given a square matrix, calculate the absolute difference between the
            sums of its diagonals. For example, the square matrix is shown
            below:
          </p>
          <h4>Return</h4>
          <p>
            Given a square matrix, calculate the absolute difference between the
            sums of its diagonals. For example, the square matrix is shown
            below:
          </p>
          <h4>Input Format</h4>
          <p>
            Given a square matrix, calculate the absolute difference between the
            sums of its diagonals. For example, the square matrix is shown
            below:
          </p>
          <h4>Constraints</h4>
          <p>
            Given a square matrix, calculate the absolute difference between the
            sums of its diagonals. For example, the square matrix is shown
            below:
          </p>
          <h4>Constraints</h4>
          <p>
            Given a square matrix, calculate the absolute difference between the
            sums of its diagonals. For example, the square matrix is shown
            below:
          </p>
          </div>
        </div>
        <div>
        <div className="editor-container">
          <div className="editor-sidebar">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">Select Language</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            {selectedLanguage === "cpp" || selectedLanguage === "java" && (
              <button onClick={compileCode}>Compile</button>
            )}
            <button onClick={runCode}>Run</button>
          </div>
          <div className="editor-content">
            <MonacoEditor
              language={selectedLanguage}
              theme="myTheme"
              value={code}
              options={editorOptions}
              height= "35vh"
              automaticLayout={true}
              onChange={(newCode) => {
                setCode(newCode);
                setCompilationMessage("");
                setError("");
                setOutput("");
              }}
            />
          </div>
        </div>
        <div className="output-container">
        <div className="output-heading">
          <h4>Output</h4>
        </div>
        <div className="command-prompt">
          {compilationMessage && <pre>{compilationMessage}</pre>}
          {error && <pre>{error}</pre>}
          {!error && <pre>{output}</pre>}

        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
