import React from 'react'
import CodeEditor from './CodeEditor/CodeEditor'

import { Route,Routes } from 'react-router-dom'


export default function App() {
  return (
    <Routes>
        <Route path="/question" element={<CodeEditor/>}/>
    </Routes>
  )
}
