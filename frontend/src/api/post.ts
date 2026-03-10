import { apiClient } from "."


const createPostApi = async(postData:FormData)=> {
    return apiClient.post("/posts",postData,{
        headers: { "Content-Type": "application/json" }
    })
}
const updatePostApi = async(id:number,postData:FormData)=>{
    return apiClient.patch(`/posts/${id}`,postData,{
        headers: { "Content-Type": "application/json" }
    })
}
const deletePostApi = async(id:number)=> {
    return apiClient.delete(`/posts/${id}`,{})
}
const getPostByIdApi = async(id:number)=> {
    return apiClient.get(`/posts/${id}`,{})
}
const getUserPostsApi = async()=> {
    return apiClient.get(`/posts/current-user`,{})
}
const getPostsApi = async()=> {
    return apiClient.get(`/posts/`,{})
}


export {
    createPostApi,
    updatePostApi,
    deletePostApi,
    getPostByIdApi,
    getUserPostsApi,
    getPostsApi
}

