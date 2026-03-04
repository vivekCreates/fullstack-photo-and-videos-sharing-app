import { createContext, useState } from "react";
import { useAuth } from "./UserContext";
import type { CommentType } from "../types/comment";
import toast from "react-hot-toast";

type CreateComment = {
    text: string,
    parentCommentId: number | null,
    postId: number
}


type CommentContextType = {
    comments: CommentType[] | [],
    createComment: (commentData: CreateComment) => void;
    deleteComment: (commentId: number) => void;
    updateComment: ({ commentId, text }: { commentId: number, text: string }) => void;
    fetchComment: (postId: number) => void;

}

const CommentContext = createContext<CommentContextType>({
    comments: [],
    createComment: async () => { },
    deleteComment: async () => { },
    updateComment: async () => { },
    fetchComment: async () => { }
})

const URL = "http://localhost:8000/api/comments"

const CommentContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [comments, setComments] = useState<CommentType[]>([])
    const { user } = useAuth();

    const createComment = async ({ postId, text, parentCommentId }: CreateComment) => {
        if (!user) return;

        const tempId = Date.now();
        const now = new Date();

        const newComment: CommentType = {
            id: tempId,
            text,
            userId: user.id,
            postId,
            parentCommentId,
            createdAt: now,
            updatedAt: now
        };
        setComments(prev => [newComment, ...prev]);
        try {
            const response = await fetch(`${URL}/posts/${postId}`)
            if (!response.ok) {
                throw new Error("Failed to create comment")
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data?.message || "Something went wrong")
            }

            setComments(prev => prev.map(c => c.id == tempId ? data.data : c))
            toast.success(data.message)
        } catch (error: any) {
            toast.error(error?.message)
        }
    };
    
    const updateComment = () => { }
    const fetchComment = () => { }

    return (
        <CommentContext.Provider value={{ comments, createComment, deleteComment, updateComment, fetchComment }}>
            {children}
        </CommentContext.Provider>
    )
}