import { apiClient } from "."
import type { CommentType } from "../types/comment"


const createCommentApi = ({ postId, text, parentCommentId }:CommentType)=>{
    return apiClient.post(`/comments/posts/${postId}`,{postId,text})
}


const deleteCommentApi = (commentId:number)=>{
    return apiClient.delete(`/comments/${commentId}`)

}

const updateCommentApi = ({text,commentId}:{text:string,commentId:number})=>{
    apiClient.patch(`/comments/${commentId}`,{text})
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