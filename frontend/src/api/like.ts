import { apiClient } from "."


const toggleLikeApi = (postId:number) => {
    return apiClient.post(`/likes/${postId}`)
}

export {toggleLikeApi}