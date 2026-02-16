export type PostType = {
    id:number,
    title:string,
    description:string,
    file:string,
    createdAt:Date,
    updateAt:Date,
    isLiked:boolean,
    likeCount:number,
    user:{
        id:number,
        name:string,
        profileImage:string
    }
}