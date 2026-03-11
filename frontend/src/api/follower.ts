import { apiClient } from "."


const toggleFollowerApi = (userId:number)=> {
    return apiClient.post(`/followers/${userId}`)
}

const getAllFollwingsApi = ()=> {
     return apiClient.get(`/followers/followings`)
}


export {
    toggleFollowerApi,
    getAllFollwingsApi
}