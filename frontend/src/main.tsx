import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserContextProvider } from './context/UserContext.tsx'
import { PostContextProvider } from './context/PostContext.tsx'
import { Toaster } from "react-hot-toast"
import { CommentContextProvider } from './context/CommentContext.tsx'
import { BookmarkContextProvider } from './context/BookmarkContext.tsx'

createRoot(document.getElementById('root')!).render(
    <>
        <Toaster />
<UserContextProvider>
  <PostContextProvider>
      <BookmarkContextProvider>
    <CommentContextProvider>
        <App />
    </CommentContextProvider>
      </BookmarkContextProvider>
  </PostContextProvider>
</UserContextProvider>
    </>

)
