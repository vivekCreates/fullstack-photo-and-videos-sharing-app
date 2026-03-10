import { createContext, useContext, useState } from "react";
import { usePost } from "./PostContext";
import { requestHandler } from "../utils/requestHandler";
import { toggleLikeApi } from "../api/like";
import toast from "react-hot-toast";



type LikeContextType = {
    toggleLike:(postId:number)=>void
    createLoading:boolean
    setCreateLoading:(loading:boolean)=>void
}



const LikeContext = createContext<LikeContextType>({
    toggleLike:async()=>{},
    createLoading:false,
    setCreateLoading:()=>{}
})


export const LikeContextProvider = ({children}:{children:React.ReactNode})=>{
    const {setPosts} = usePost()
    const [createLoading,setCreateLoading] = useState(false);

    const toggleLike = async(postId:number)=>{
        setPosts(prev=>prev.map(p=>p.id == postId ? {...p,isLiked:!p.isLiked,likeCount:p.isLiked ? p.likeCount-1:p.likeCount+1}:p))
        await requestHandler(
            async()=>await toggleLikeApi(postId),
            setCreateLoading,
            (res)=>{
                toast.success(res.message)
            },
            (error)=>{
                setPosts(prev=>prev.map(p=>p.id == postId ? {...p,isLiked:!p.isLiked,likeCount:p.isLiked ? p.likeCount-1:p.likeCount+1}:p))
                toast.error(error)
            }
        )
    }
    return (<LikeContext.Provider value={{toggleLike,setCreateLoading,createLoading}}>
        {children}
    </LikeContext.Provider>
    )
}

export const useLike = ()=>useContext(LikeContext)