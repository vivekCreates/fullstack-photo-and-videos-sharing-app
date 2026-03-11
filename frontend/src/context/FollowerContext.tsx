import { createContext, useState } from "react";
import type { FollowerType } from "../types/follower";
import { usePost } from "./PostContext";
import { requestHandler } from "../utils/requestHandler";
import { getAllFollwersApi, toggleFollowerApi } from "../api/follower";
import toast from "react-hot-toast";

type FollowerContextType = {

    followers: FollowerType[],
    createLoading: boolean,
    toggleFollower: (userId: number) => void,
    setCreateLoading: (loading: boolean) => void,
    getAllFollowers: () => void
}

const FollowerContext = createContext<FollowerContextType>({
    followers: [],
    createLoading: false,
    toggleFollower: async () => { },
    setCreateLoading: () => { },
    getAllFollowers: async () => { }
})


const FollowerContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [followers, setFollowers] = useState<FollowerType[]>([])
    const [createLoading, setCreateLoading] = useState(false)
    const { setPosts } = usePost();

    const toggleFollower = async (userId: number
    ) => {
        setPosts(prev =>
            prev.map(p =>
                p.user.id === userId
                    ? { ...p, user: { ...p.user, isFollowed: !p.user.isFollowed } }
                    : p
            )
        );

        await requestHandler(
            async () => await toggleFollowerApi(userId),
            setCreateLoading,
            (res) => {
                toast.success(res.message)
            },
            (error) => {
                setPosts(prev =>
                    prev.map(p =>
                        p.user.id === userId
                            ? { ...p, user: { ...p.user, isFollowed: !p.user.isFollowed } }
                            : p
                    )
                );
                toast.error(error)
            }
        )
    }
    const getAllFollowers = async ()=>{

        await requestHandler(
            async () => await getAllFollwersApi(),
            setCreateLoading,
            (res) => {
                const data = res.data;
                setFollowers(data)
                toast.success(res.message)
            },
            (error) => {
                toast.error(error)
            }
        )
    }

    return (
        <FollowerContext.Provider value={{followers,createLoading,setCreateLoading,toggleFollower,getAllFollowers}}>
            {children}
        </FollowerContext.Provider>
    )
}
