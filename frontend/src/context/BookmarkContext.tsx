import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import toast from "react-hot-toast";
import type { BookmarkPost } from "../types/bookmark";
import { usePost } from "./PostContext";
import { requestHandler } from "../utils/requestHandler";
import { getAllBookmarksApi, toggleBookmarkApi } from "../api/bookmark";

type BookmarkContextType = {
    bookmarks: BookmarkPost[],
    toggleBookmark: (postId: number) => void,
    setCreateLoading:(loading:boolean)=>void,
    createLoading:boolean,
    getAllBookmarks: () => void
}

const BookmarkContext = createContext<BookmarkContextType>({
    bookmarks: [],
    setCreateLoading:()=>{},
    createLoading:false,
    toggleBookmark: async () => { },
    getAllBookmarks: async () => { }
})

const URL = "http://localhost:8000/api/bookmarks"

export const BookmarkContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkPost[]>([])
    const {token } = useAuth();
    const {setPosts} = usePost();
    const [createLoading,setCreateLoading] = useState(false);
 
    const toggleBookmark = async (id: number) => {
        setPosts(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
        await requestHandler(
            async()=>await toggleBookmarkApi(id),
            setCreateLoading,
            (res)=>{
                toast.success(res.message)
            },
            (error)=>{
                setPosts(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
                toast.error(error)
            }
        )
    }

    const getAllBookmarks = async()=>{
         await requestHandler(
            async()=>await getAllBookmarksApi(),
            setCreateLoading,
            (res)=>{
                const data = res.data;
                setBookmarks(data);
                toast.success(res.message)
            },
            (error)=>{
                toast.error(error)
            }
        )
    }

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark,getAllBookmarks,createLoading,setCreateLoading}}>
            {children}
        </BookmarkContext.Provider>
    )
}

export const useBookmark = () => useContext(BookmarkContext)