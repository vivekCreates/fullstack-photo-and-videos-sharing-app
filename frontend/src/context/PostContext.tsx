import { createContext, useState } from "react"
import type { PostType } from "../types/post"
import { useAuth } from "./UserContext"

type CreatePostType = {
    title: string,
    description: string,
    file: string
}

type UpdatePostType = CreatePostType & {
    file: string
}

type PostContextType = {
    posts: PostType[] | [],
    createPost: (postData: FormData) => {}
    updatePost: (id: number, postData: FormData) => {}
    deletePost: (id: number) => {}
}

const PostContext = createContext<PostContextType>({
    posts: [],
    createPost: async () => { },
    updatePost: async () => { },
    deletePost: async () => { }
})

const URL = "http://localhost:8000/api/posts"

export const PostContextProvider = async ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState<PostType[] | []>([])

    const createPost = async (postData: FormData) => {
        if (!user || !token) return;

        const tempId = Date.now();
        const now = new Date();

        const optimisticPost: PostType = {
            id: tempId,
            title: postData.get("title") as string,
            description: postData.get("description") as string,
            file: postData.get("file") as string,
            user_id: user.id,
            created_at: now,
            update_at: now,
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

        } catch (error: any) {
            setPosts((prev) => prev.filter((p) => p.id !== tempId));
            console.error("Create Post Error:", error.message);
        }
    };

    const updatePost = async (id: number, formData: FormData) => {
        const previousPosts = posts;

        setPosts((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                        ...p,
                        title: String(formData.get("title")),
                        file: String(formData.get("file")),
                        description: String(formData.get("description")),
                        update_at: new Date(),
                    }
                    : p
            )
        );

        try {
            const response = await fetch(`${URL}${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed");

            const data = await response.json();

            if (!data?.success) {
                throw new Error(data?.message || "Something went wrong")
            }

            alert(data.message)
        } catch (error: any) {
            setPosts(previousPosts);
            console.log(error?.message)
        }
    };

    const deletePost = async (id: number) => { }

    return <PostContext.Provider value={{ posts, createPost, updatePost, deletePost }}>
        {children}
    </PostContext.Provider>
}