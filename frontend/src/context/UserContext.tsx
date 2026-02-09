import { createContext, useContext, useState } from "react";
import type { User, UserLogin, UserRegister } from "../types/user";

type UserContextType = {
    isLoggedIn:boolean,
    token:string,
    user:User | null
    register:(user:UserRegister)=>void,
    login:(user:UserLogin)=>void,
    logout:()=>void
}

const UserContext = createContext<UserContextType>({
    isLoggedIn:false,
    token:"",
    user:null,
    register:async()=>{},
    login:async()=>{},
    logout:async()=>{},
})

const URL = "http://localhost:8000/api/auth"

export const UserContextProvider = ({children}:{children:React.ReactNode}) =>{

    const [user,setUser] = useState<User|null>(null);
    const [isLoggedIn,setIsLoggedIn] = useState(false)

    const register = async(user:UserRegister) => {
        try {
            const response = await fetch(`${URL}/register`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(user)
                }
            )

            const data = await response.json()
            if (!data.success){
                throw new Error(data.message)
            }

            alert(data.message)
        } catch (error:any) {
            alert(error.message)
        }
    }
    const login = async(user:UserLogin) => {
         try {
            const response = await fetch(`${URL}/register`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(user)
                }
            )

            const data = await response.json()
            if (!data.success){
                throw new Error(data.message)
            }
            localStorage.setItem("token",data.token)
            setIsLoggedIn(true)
            setUser(data.data.user)
            alert(data.message)
        } catch (error:any) {
            alert(error.message)
        }
    }
    const logout = async() => {}

    return <UserContext.Provider value={{register,login,logout,isLoggedIn,user,token}}>
        {children}
    </UserContext.Provider>
}

export const useAuth = () => useContext(UserContext)