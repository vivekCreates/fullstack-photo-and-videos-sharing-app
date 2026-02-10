import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './pages/Protected'
import PublicRoute from './pages/Public'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute/>}>
        <Route path='/' element={<Home />} />
        </Route>

        <Route element={<PublicRoute/>}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App