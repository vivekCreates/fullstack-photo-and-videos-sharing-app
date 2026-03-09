import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import toast from "react-hot-toast";
import type { BookmarkPost } from "../types/bookmark";
import { usePost } from "./PostContext";

type BookmarkContextType = {
    bookmarks: BookmarkPost[],
    toggleBookmark: (postId: number) => void,
    getAllBookmarks: () => void
}

const BookmarkContext = createContext<BookmarkContextType>({
    bookmarks: [],
    toggleBookmark: async () => { },
    getAllBookmarks: async () => { }
})

const URL = "http://localhost:8000/api/bookmarks"

export const BookmarkContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkPost[]>([])
    const {token } = useAuth();
    const {setPosts} = usePost();

 
    const toggleBookmark = async (id: number) => {
        setPosts(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to bookmark post")
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data?.message || "Something went wrong")
            }

            toast.success(data.message)
        } catch (error: any) {
             setPosts(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
            console.log(error?.message)
            toast.error(error?.message)
        }
    }

    const getAllBookmarks = async()=>{
          try {
            const response = await fetch(`${URL}`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            })

            if(!response.ok){
                throw new Error("Failed to bookmark post")
            }

            const data = await response.json()

            if(!data.success){
                throw new Error(data?.message || "Something went wrong")
            }
            console.log("data: ",data)
            setBookmarks(data?.data)
            toast.success(data.message)
            return bookmarks
        } catch (error:any) {
            console.log(error?.message)
            toast.error(error?.message)
        }
    }

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark,getAllBookmarks}}>
            {children}
        </BookmarkContext.Provider>
    )
}

export const useBookmark = () => useContext(BookmarkContext)