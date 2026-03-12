import { createContext, useContext, useEffect, useState } from "react";
import type { User, UserLogin, UserRegister } from "../types/user";
import toast from "react-hot-toast";
import { requestHandler } from "../utils/requestHandler";
import { fetchUserApi, loginUserApi, logOutUserApi, registerUserApi } from "../api/auth";



type UserContextType = {
    isLoggedIn: boolean,
    token: string | null,
    user: User | null,
    setUser:React.Dispatch<React.SetStateAction<User|null>>,
    loading: boolean,
    createLoading:boolean,
    fetchingLoading:boolean;
    register: (user: UserRegister) => void,
    login: (user: UserLogin) => void,
    logout: () => void
}

const UserContext = createContext<UserContextType>({
    isLoggedIn: false,
    token: "",
    user: null,
    setUser:()=>{},
    loading: true,
    createLoading:false,
    fetchingLoading:false,
    register: async () => { },
    login: async () => { },
    logout: async () => { },
})


export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [createLoading,setCreateLoading]= useState(false);
    const [fetchingLoading,setFetchingLoading]= useState(false);

    const [token, setToken] = useState<string | null>(localStorage.getItem("token"))

    useEffect(() => {
        if(!token) return;
        const fetchUser = async () => {
            await requestHandler(
                async ()=> await fetchUserApi(),
                setLoading,
                (res)=>{
                    const data = res.data;
                    setUser(data)
                    setIsLoggedIn(true)
                    // setLoading(false)
                    toast.success(res.message)
                },
                (error)=>{
                    toast.error("user"+error)
                }

            )
        };

        fetchUser();
    }, []);


    const register = async (user: UserRegister) => {
        await requestHandler(
            async () => await registerUserApi(user),
            setCreateLoading,
            (res)=>{
                const data = res.data
                setUser(data)
                toast.success(res.message)
            },
            (error)=>{
                toast.error(error)
            }
        )
    }

    const login = async (user: UserLogin) => {
       await requestHandler(
        async ()=> await loginUserApi(user),
        setCreateLoading,
        (res)=>{
            const data = res.data;
            localStorage.setItem("token",data.token)
            setUser(data?.user)
            setToken(data?.token)
            setIsLoggedIn(true)
            toast.success(res.message)
        },
       (error)=>{
        toast.error(error)
       }
    )
    }

    const logout = async () => {
        await requestHandler(
        async ()=> await logOutUserApi(),
        setCreateLoading,
        (res)=>{
            const data = res.data;
            localStorage.removeItem("token")
            setUser(data?.user)
            setToken(data?.token)
            setIsLoggedIn(false)
            toast.success(res.message)
        },
       (error)=>{
        toast.error(error)
       }
    )
    }


    return <UserContext.Provider value={{ register, login, logout, isLoggedIn, user,setUser, token, loading,createLoading,fetchingLoading }}>
        {children}
    </UserContext.Provider>
}

export const useAuth = () => useContext(UserContext)