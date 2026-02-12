import { createContext, useContext, useEffect, useState } from "react";
import type { User, UserLogin, UserRegister } from "../types/user";


type UserContextType = {
    isLoggedIn:boolean,
    token:string|null,
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
    const [token,setToken] = useState<string|null>(localStorage.getItem("token"))

useEffect(() => {
  const fetchUser = async () => {
    try {
      const resposne = await fetch(`${URL}/me`, {
          method:"GET",
          credentials: "include",
          headers:{
            Authorization:`Bearer ${token}`
        }
      });
      
      const data = await resposne.json();
      console.log(data)

      if (!data.success){
        alert(data.message)

      }
      console.log(data)
      setIsLoggedIn(true)
      setUser(data);
      console.log("token: ",token)
    } catch(error:any) {
    alert(error.message)
      setUser(null);
      setToken("")
    }
  };

  fetchUser();
}, []);


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
            console.log("data: ",data)
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
            const response = await fetch(`${URL}/login`,
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
            localStorage.setItem("token",data.data.token)
            setIsLoggedIn(true)
            setToken(data.data.token)
            setUser(data.data.user)
            alert(data.message)
        } catch (error:any) {
            alert(error.message)
        }
    }
    const logout = async() => {
        try {
            const response = await fetch(`${URL}/logout`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                }
            )
            const data = await response.json()
            if (!data.success){
                alert(data.message)
            }
            localStorage.removeItem("token")
            setToken("")
            setIsLoggedIn(false)
            setUser(null);
        } catch (error:any) {
            alert(error.message)
        }
    }

    return <UserContext.Provider value={{register,login,logout,isLoggedIn,user,token}}>
        {children}
    </UserContext.Provider>
}

export const useAuth = () => useContext(UserContext)