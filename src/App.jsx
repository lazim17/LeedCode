import React from 'react'
import CodeEditor from './CodeEditor/CodeEditor'
import Navbar from './navbar'
import { Route,Routes } from 'react-router-dom'


export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/question" element={<CodeEditor />} />
      </Routes>
    </div>
  )
}
