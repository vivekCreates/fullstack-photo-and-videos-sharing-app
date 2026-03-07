export type CommentType = {
    id:number,
    text:string,
    postId:number,
    parentCommentId:null|number,
    createdAt:Date,
    updatedAt:Date,
    user:{
        id:number,
        name:string,
        profileImage:string
    }
} 

