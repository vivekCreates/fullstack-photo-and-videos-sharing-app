import { createContext } from "react"
import type { PostType } from "../types/post"

type CreatePostType = {
    title:string,
    description:string,
    file:string
}

type PostContextType = {
    posts:PostType[],
    createPost:(post:CreatePostType)=>{}
    updatePost:({id,post}:{id:number,post:CreatePostType})=>{}
    deletePost:(id:number)=>{}
}

const PostContext = createContext<PostContextType>({
    posts:[],
    createPost:async()=>{},
    updatePost:async()=>{},
    deletePost:async()=>{}
})