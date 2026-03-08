import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import toast from "react-hot-toast";
import type { BookmarkPost } from "../types/bookmark";

type BookmarkContextType = {
    bookmarks: BookmarkPost[],
    addToBookmark: (postId: number) => void,
    removeToBookmark: (postId: number) => void,
    getAllBookmarks: () => void
}

const BookmarkContext = createContext<BookmarkContextType>({
    bookmarks: [],
    addToBookmark: async () => { },
    removeToBookmark: async () => { },
    getAllBookmarks: async () => { }
})

const URL = "http://localhost:8000/api/bookmarks"

export const BookmarkContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkPost[]>([])
    const { token,user } = useAuth();


    useEffect(()=>{
        getAllBookmarks()
    },[])
 
    const addToBookmark = async (id: number) => {
        // setBookmarks(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
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
            //  setBookmarks(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
            console.log(error?.message)
            toast.error(error?.message)
        }
    }
 
    const removeToBookmark = async (id: number) => {
         console.log("removeBookmark: ",removeToBookmark)   // setBookmarks(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to delete bookmark post")
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data?.message || "Something went wrong")
            }

            toast.success(data.message)
        } catch (error: any) {
            //  setBookmarks(prev=>prev.map(b=>b.id == id ? {...b,isBookmark:!b.isBookmark}:b))
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
        } catch (error:any) {
            console.log(error?.message)
            toast.error(error?.message)
        }
    }

    return (
        <BookmarkContext.Provider value={{ bookmarks, addToBookmark ,removeToBookmark,getAllBookmarks}}>
            {children}
        </BookmarkContext.Provider>
    )
}

export const useBookmark = () => useContext(BookmarkContext)