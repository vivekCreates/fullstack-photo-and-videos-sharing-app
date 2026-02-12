import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserContextProvider } from './context/UserContext.tsx'
import { PostContextProvider } from './context/PostContext.tsx'

createRoot(document.getElementById('root')!).render(

    <UserContextProvider>
    <PostContextProvider>
        <App />
    </PostContextProvider>
    </UserContextProvider>
)
