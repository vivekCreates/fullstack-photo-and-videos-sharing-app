import { createContext, useContext, useState } from "react";
import type { PostType } from "../types/post";
import { useAuth } from "./UserContext";
import toast from "react-hot-toast";

type BookmarkContextType = {
    bookmarks: PostType[],
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
    const [bookmarks, setBookmarks] = useState<PostType[]>([])
    const { token } = useAuth();


    const addToBookmark = async (id: number) => {
        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "GET",
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

            toast.success(data.success)
        } catch (error: any) {
            console.log(error?.message)
            toast.error(error?.message)
        }
    }

    const removeToBookmark = async (id: number) => {
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

            toast.success(data.success)
        } catch (error: any) {
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
            setBookmarks(data?.data)
            toast.success(data.success)
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