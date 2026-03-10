import { apiClient } from "."


const toggleBookmarkApi = (postId:number) => {
    return apiClient.post(`bookmarks/${postId}`)
}

const getAllBookmarksApi = () => {
    return apiClient.get(`/bookmarks`)
}

export {toggleBookmarkApi,getAllBookmarksApi}