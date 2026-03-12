import { createContext, useContext, useState } from "react";
import { useAuth } from "./UserContext";
import type { CommentType } from "../types/comment";
import toast from "react-hot-toast";
import { requestHandler } from "../utils/requestHandler";
import { createCommentApi, deleteCommentApi, fetchCommentApi, updateCommentApi } from "../api/comment";

export type CreateComment = {
    text: string,
    parentCommentId: number | null,
    postId: number
}


type CommentContextType = {
    comments: CommentType[] | [],
    createLoading: boolean,
    setCreateLoading: (loading: boolean) => void;
    createComment: (commentData: CreateComment) => void;
    deleteComment: (commentId: number) => void;
    updateComment: ({ commentId, text }: { commentId: number, text: string }) => void;
    fetchComment: (postId: number) => void;

}

const CommentContext = createContext<CommentContextType>({
    comments: [],
    createLoading: false,
    setCreateLoading: () => { },
    createComment: async () => { },
    deleteComment: async () => { },
    updateComment: async () => { },
    fetchComment: async () => { }
})


export const CommentContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [comments, setComments] = useState<CommentType[]>([]);
    const [createLoading, setCreateLoading] = useState(false);
    const { user, token } = useAuth();


    const createComment = async ({ postId, text, parentCommentId }: CreateComment) => {
        if (!user) return;

        const tempId = Date.now();
        const now = new Date();

        const newComment: CommentType = {
            id: tempId,
            text,
            postId,
            parentCommentId,
            createdAt: now,
            updatedAt: now,
            user: {
                id: user.id,
                name: user.name,
                profileImage: String(user?.profile_image)
            },

        };
        console.log("Optimistic: ",newComment)

        setComments(prev => [...prev, newComment]);
        await requestHandler(
            async () => await createCommentApi({ postId, text, parentCommentId }),
            setCreateLoading,
            (res) => {
                const data = res.data;
                const commentData = {
                    id: data.id,
                    text: data.text,
                    postId: data.postId,
                    parentCommentId: data.parentCommentId,
                    createdAt: now,
                    updatedAt: now,
                        user: {
                            id: user.id,
                            name: user.name,
                            profileImage: String(user?.profile_image)
                        }

                }
                console.log("from Backend: ",commentData)
                setComments(prev => prev.map(c => c.id == tempId ? commentData : c))
                toast.success(res.message)
            },
            (error) => {
                toast.error(error)
            }
        )
    };

    const deleteComment = async (commentId: number) => {
        const prevComments = comments;
        setComments(prev =>
            prev.filter(c => c.id !== commentId && c.parentCommentId !== commentId)
        )
        await requestHandler(
            async () => await deleteCommentApi(commentId),
            setCreateLoading,
            (res) => {
                toast.success(res.message)
            },
            (error) => {
                setComments(prevComments)
                toast.error(error)
            }
        )
    };


    const updateComment = async ({ text, commentId }: { text: string, commentId: number }) => {
        const prevComment = comments.find(c => c.id == commentId);

        setComments(prev => prev.map(c => c.id == commentId ? { ...c, text } : c))

        await requestHandler(
            async () => await updateCommentApi({ text, commentId }),
            setCreateLoading,
            (res) => {
                toast.success(res.message)
            },
            (error) => {
                setComments(prev => prev.map(c => c.id == commentId ? prevComment! : c))
                toast.error(error)
            }
        )
    }


    const fetchComment = async (postId: number) => {
        await requestHandler(
            async () => await fetchCommentApi(postId),
            setCreateLoading,
            (res) => {
                const data = res.data;
                setComments(data)
                toast.success(res.message)
            },
            (error) => {
                toast.error(error)
            }
        )
    }

    return (
        <CommentContext.Provider value={{ comments, createComment, deleteComment, updateComment, fetchComment, createLoading, setCreateLoading }}>
            {children}
        </CommentContext.Provider>
    )
}


export const useComment = () => useContext(CommentContext)