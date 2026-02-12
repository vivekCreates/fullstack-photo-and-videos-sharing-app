import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserContextProvider } from './context/UserContext.tsx'
import { PostContextProvider } from './context/PostContext.tsx'
import {Toaster} from "react-hot-toast"

createRoot(document.getElementById('root')!).render(
    <>
    <Toaster/>
    <UserContextProvider>
    <PostContextProvider>
        <App />
    </PostContextProvider>
    </UserContextProvider>
    </>
    
)
