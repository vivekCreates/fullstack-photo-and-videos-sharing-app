import { createContext, useContext, useEffect, useState } from "react";
import type { FollowType } from "../types/follower";
import { usePost } from "./PostContext";
import { requestHandler } from "../utils/requestHandler";
import { getAllFollwingsApi, toggleFollowerApi } from "../api/follower";
import toast from "react-hot-toast";
import { useAuth } from "./UserContext";
import type { User } from "../types/user";

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
    const { setPosts, posts } = usePost();
    const { user, setUser } = useAuth()

    useEffect(() => {
        getAllFollowings()
    }, [])

    const toggleFollower = async (userId: number) => {

    const post = posts.find(p => p.user.id === userId)
    const wasFollowed = post?.user.isFollowed

    // optimistic UI update
    setPosts(prev =>
        prev.map(p =>
            p.user.id === userId
                ? { ...p, user: { ...p.user, isFollowed: !p.user.isFollowed } }
                : p
        )
    )

    setUser((prev) => {
    if (!prev) return prev

    return {
        ...prev,
        followingCount: wasFollowed
            ? prev.followingCount - 1
            : prev.followingCount + 1
    }
})

    await requestHandler(
        async () => await toggleFollowerApi(userId),
        setCreateLoading,
        () => {
            toast.success("Follow updated")
        },
        (error) => {

            // rollback
            setPosts(prev =>
                prev.map(p =>
                    p.user.id === userId
                        ? { ...p, user: { ...p.user, isFollowed: !p.user.isFollowed } }
                        : p
                )
            )

            toast.error(error)
        }
    )
}
    const getAllFollowings = async () => {

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
        <FollowerContext.Provider value={{ followers, followings, createLoading, setCreateLoading, toggleFollower, getAllFollowings }}>
            {children}
        </FollowerContext.Provider>
    )
}


export const useFollower = () => useContext(FollowerContext)