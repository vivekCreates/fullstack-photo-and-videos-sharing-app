
import { createContext, useContext } from "react";



type LikeContextType = {
    toggleLike:(postId:number)=>void
}



const LikeContext = createContext<LikeContextType>({
    toggleLike:async()=>{}
})


export const LikeContextProvider = ({children}:{children:React.ReactNode})=>{
    const toggleLike = async()=>{}
    <LikeContext.Provider value={{toggleLike}}>
        {children}
    </LikeContext.Provider>
}

export const useLike = ()=>useContext(LikeContext)