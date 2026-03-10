import { apiClient } from "."
import type { CreateComment } from "../context/CommentContext"
import type { CommentType } from "../types/comment"


const createCommentApi = ({ postId, text, parentCommentId }:CreateComment)=>{
    return apiClient.post(`/comments/posts/${postId}`,{parentCommentId,text})
}


const deleteCommentApi = (commentId:number)=>{
    return apiClient.delete(`/comments/${commentId}`)

}

const updateCommentApi = ({text,commentId}:{text:string,commentId:number})=>{
    return apiClient.patch(`/comments/${commentId}`,{text})
}


const fetchCommentApi = (postId:number)=>{
    return apiClient.get(`/comments/posts/${postId}`)
}


export {
    createCommentApi,
    updateCommentApi,
    fetchCommentApi,
    deleteCommentApi
}