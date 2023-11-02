import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";
import "./CodeEditor.css";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [error, setError] = useState("");
  const [compilationMessage, setCompilationMessage] = useState("");

  const baseURL = "http://localhost:5000";

  const compileCode = async () => {
    if (selectedLanguage) {
      try {
        const response = await axios.post(`${baseURL}/compile`, {
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
        const response = await axios.post(`${baseURL}/run`, {
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
            </select>
            {selectedLanguage === "cpp" && (
              <button onClick={compileCode}>Compile</button>
            )}
            <button onClick={runCode}>Run</button>
          </div>
          <div className="editor-content">
            <MonacoEditor
              language={selectedLanguage}
              theme="vs-dark"
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
