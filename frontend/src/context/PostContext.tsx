import { createContext, useContext, useEffect, useState } from "react"
import type { PostType } from "../types/post"
import { useAuth } from "./UserContext"
import toast from "react-hot-toast"



type PostContextType = {
    posts: PostType[] | [],
    createPost: (postData: FormData) => {}
    updatePost: (id: number, postData: FormData) => {}
    deletePost: (id: number) => {}
    getPostById: (id: number) => {}
}

const PostContext = createContext<PostContextType>({
    posts: [],
    createPost: async () => { },
    updatePost: async () => { },
    deletePost: async () => { },
    getPostById: async () => { }
})

const URL = "http://localhost:8000/api/posts"

export const PostContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState<PostType[] | []>([])

    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async () => {
        try {
            const response = await fetch(`${URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch posts")

            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Something went wrong")
            }
            setPosts(data.data)
            toast.success(data.message)

        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const createPost = async (postData: FormData) => {
        if (!user || !token) return;

        const tempId = Date.now();
        const now = new Date();

        const optimisticPost: PostType = {
            id: tempId,
            title: postData.get("title") as string,
            description: postData.get("description") as string,
            file: postData.get("file") as string,
            createdAt: now,
            updateAt: now,
            user: {
                id: user.id,
                name: user.name,
                profileImage: String(user.profile_image)
            }
        };

        setPosts((prev) => [...prev, optimisticPost]);

        try {
            const response = await fetch(`${URL}/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: postData,
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Something went wrong");
            }

            setPosts((prev) =>
                prev.map((p) =>
                    p.id === tempId ? data.data : p
                )
            );

            toast.success(data.message)
        } catch (error: any) {
            setPosts((prev) => prev.filter((p) => p.id !== tempId));
            toast.error(error.message)
            console.error("Create Post Error:", error.message);
        }
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
                        file: file ? window.URL.createObjectURL(file) : p.file,
                        description: String(formData.get("description")),
                        update_at: new Date(),
                    }
                    : p
            )
        );

        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
console.log(response)
            if (!response.ok) throw new Error("Failed");

            const data = await response.json();

            if (!data?.success) {
                throw new Error(data?.message || "Something went wrong")
            }
            console.log(data)
            toast.success(data.message)
        } catch (error: any) {
            setPosts(previousPosts);
            toast.error(error.message)
            console.log(error?.message)
        }
    };

    const deletePost = async (id: number) => {
        const previousPosts = posts;

        setPosts(prev => (
            prev.filter(p => (
                p.id != id
            ))
        ))

        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Failed to delete post")
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Something went wrong")
            }
            toast.success(data?.message)
        } catch (error: any) {
            setPosts(previousPosts)
            toast.error(error.message)
            console.log(error.message)
        }
    }

    const getPostById = async (id: number) => {
        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch posts")

            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Something went wrong")
            }
            toast.success(data.message)
            return data.data
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return <PostContext.Provider value={{ posts, createPost, updatePost, deletePost, getPostById }}>
        {children}
    </PostContext.Provider>
}

export const usePost = () => useContext(PostContext)