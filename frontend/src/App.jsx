import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/signup'
import Login from './components/login'
import Todo from './components/todo'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/todo' element={<Todo />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
