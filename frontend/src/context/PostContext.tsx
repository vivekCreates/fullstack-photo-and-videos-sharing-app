import { createContext, useContext, useEffect, useState } from "react"
import type { PostType } from "../types/post"
import { useAuth } from "./UserContext"
import toast from "react-hot-toast"
import { requestHandler } from "../utils/requestHandler"
import { createPostApi, deletePostApi, getPostByIdApi, getPostsApi, getUserPostsApi, updatePostApi } from "../api/post"




type PostContextType = {
    posts: PostType[] | [],
    setPosts: React.Dispatch<React.SetStateAction<PostType[]>>,
    userPosts: PostType[],
    createLoading:boolean,
    fetchingLoading:boolean,
    createPost: (postData: FormData) => {}
    updatePost: (id: number, postData: FormData) => {}
    deletePost: (id: number) => {}
    getPostById: (id: number) => {}
    getUserPosts: () => {}
}

const PostContext = createContext<PostContextType>({
    posts: [],
    userPosts: [],
    createLoading:false,
    fetchingLoading:false,
    setPosts: () => { },
    createPost: async () => { },
    updatePost: async () => { },
    deletePost: async () => { },
    getPostById: async () => { },
    getUserPosts: async () => { },
})


export const PostContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState<PostType[] | []>([])
    const [userPosts, setUserPosts] = useState<PostType[] | []>([])
    const [createLoading,setCreateLoading ] = useState(false)
    const [fetchingLoading,setFetchingLoading ] = useState(false)

    useEffect(() => {
        if (!user) return;
        getPosts();
        getUserPosts();
    }, [user])

    const getPosts = async () => { 
        await requestHandler(
            async()=>await getPostsApi(),
            setCreateLoading,
            (res)=>{
                const data = res.data;
                setPosts(data);
                toast.success(res.message)
            },
            (error)=>{
                toast.error(error)
            }
        )
    }

    const createPost = async (postData: FormData) => {
        if (!user || !token) return;

        const tempId = Date.now();
        const now = new Date();
        const file = postData.get("file") as File | null;

        const optimisticPost: PostType = {
            id: tempId,
            title: postData.get("title") as string,
            description: postData.get("description") as string,
            file: file ? URL.createObjectURL(file) : "",
            isLiked: false,
            isBookmark: false,
            commentCount: 0,
            likeCount: 0,
            createdAt: now,
            updateAt: now,
            user: {
                id: user.id,
                name: user.name,
                profileImage: String(user.profile_image)
            }
        };
        setPosts((prev) => [...prev, optimisticPost]);

        await requestHandler(
            async()=>await createPostApi(postData),
            setCreateLoading,
            (res)=>{
                const data = res.data;
                 setPosts((prev) =>
                prev.map((p) =>
                    p.id === tempId ? data?.data : p
                )
            );
            toast.success(res.message)
            },
            (error)=>{
                setPosts((prev) => prev.filter((p) => p.id !== tempId));
                toast.error(error)
            }
        )
    };

    const updatePost = async (id: number, formData: FormData) => {
        const previousPosts = posts;
        const file = formData.get("file") as File | null;

        setPosts((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                        ...p,
                        title: String(formData.get("title")),
                        file: file ? URL.createObjectURL(file) : p.file,
                        description: String(formData.get("description")),
                        update_at: new Date(),
                    }
                    : p
            )
        );

        
        await requestHandler(
            async()=>await updatePostApi(id,formData),
            setCreateLoading,
            (res)=>{
                toast.success(res.message)
            },
            (error)=>{
                setPosts(previousPosts)
                toast.error(error)
            }
        )
    };

    const deletePost = async (id: number) => {
        const previousPosts = posts;

        setPosts(prev => (
            prev.filter(p => (
                p.id != id
            ))
        ))  
        await requestHandler(
            async()=>await deletePostApi(id),
            setCreateLoading,
            (res)=>{
                toast.success(res.message)
            },
            (error)=>{
                setPosts(previousPosts)
                toast.error(error)
            }
        )
    }

    const getPostById = async (id: number) => {
         
        await requestHandler(
            async()=>await getPostByIdApi(id),
            setCreateLoading,
            (res)=>{
                const data = res.data;
                toast.success(res.message)
                return data;
            },
            (error)=>{
                toast.error(error)
            }
        )
    }

    const getUserPosts = async () => {
         
        await requestHandler(
            async()=>await getUserPostsApi(),
            setCreateLoading,
            (res)=>{
                const data =res.data;
                setUserPosts(data);
                toast.success(res.message)
            },
            (error)=>{
                toast.error(error)
            }
        )
    }


    return <PostContext.Provider value={
        {
            posts,
            getUserPosts,
            setPosts,
            userPosts,
            createPost,
            updatePost,
            deletePost,
            getPostById,
            createLoading,
            fetchingLoading
        }}>
        {children}
    </PostContext.Provider>

};


export const usePost = () => useContext(PostContext)