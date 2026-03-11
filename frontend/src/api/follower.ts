import { apiClient } from "."


const toggleFollowerApi = (userId:number)=> {
    return apiClient.post(`/followers/${userId}`)
}

const getAllFollwersApi = ()=> {
     return apiClient.get(`/followers`)
}


export {
    toggleFollowerApi,
    getAllFollwersApi
}