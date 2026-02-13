import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './pages/Protected'
import PublicRoute from './pages/Public'
import CreatePostPage from './pages/CreatePost'
import { PostDetails } from './pages/PostDetails'
import ProfilePage from './pages/profile'
import UpdatePostPage from './pages/UpdatePost'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute/>}>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<CreatePostPage />} />
        <Route path='/post/:id' element={<PostDetails />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/edit/:id' element={<UpdatePostPage />} />
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