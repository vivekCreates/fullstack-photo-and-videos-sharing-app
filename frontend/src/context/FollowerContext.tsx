import { createContext, useContext, useEffect, useState } from "react";
import type { FollowType } from "../types/follower";
import { usePost } from "./PostContext";
import { requestHandler } from "../utils/requestHandler";
import { getAllFollwingsApi, toggleFollowerApi } from "../api/follower";
import toast from "react-hot-toast";
import { useAuth } from "./UserContext";

type FollowerContextType = {

    followers: FollowType[],
    followings: FollowType[],
    createLoading: boolean,
    toggleFollower: (userId: number) => void,
    setCreateLoading: (loading: boolean) => void,
    getAllFollowings: () => void
}

const FollowerContext = createContext<FollowerContextType>({
    followers: [],
    followings: [],
    createLoading: false,
    toggleFollower: async () => { },
    setCreateLoading: () => { },
    getAllFollowings: async () => { }
})


export const FollowerContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [followers, setFollowers] = useState<FollowType[]>([])
    const [followings, setFollowings] = useState<FollowType[]>([])
    const [createLoading, setCreateLoading] = useState(false)
    const { setPosts } = usePost();
    const { user} = useAuth()

    useEffect(()=>{
        getAllFollowings()
    },[])

    const toggleFollower = async (userId: number
    ) => {
        setPosts(prev =>
            prev.map(p =>
                p.user.id === userId
                    ? { ...p, user: { ...p.user, isFollowed: !p.user.isFollowed } }
                    : p
            )
        );

        const tempId = Date.now()

        // const follow = {
        //     id:tempId,
        //     profileImage:String(user?.profile_image!),
        //     name:user?.name!,
        //     userId:user?.id!
        // }

        // setFollowings(prev=>([follow,...prev]))
        await requestHandler(
            async () => await toggleFollowerApi(userId),
            setCreateLoading,
            (res) => {
                const data = res.data;
                // setFollowings(prev=>prev.map(f=>f.id ==tempId ? data :f))
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
                // setFollowings(prev=>prev.filter(f=>f.id != tempId))
                toast.error(error)
            }
        )
    }
    const getAllFollowings = async ()=>{

        await requestHandler(
            async () => await getAllFollwingsApi(),
            setCreateLoading,
            (res) => {
                const data = res.data;
                setFollowings(data)
            },
            (error) => {
                toast.error(error)
            }
        )
    }

    return (
        <FollowerContext.Provider value={{followers,followings,createLoading,setCreateLoading,toggleFollower,getAllFollowings}}>
            {children}
        </FollowerContext.Provider>
    )
}


export const useFollower = () => useContext(FollowerContext)