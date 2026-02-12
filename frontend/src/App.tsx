import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './pages/Protected'
import PublicRoute from './pages/Public'
import CreatePostPage from './pages/CreatePost'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute/>}>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<CreatePostPage />} />
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