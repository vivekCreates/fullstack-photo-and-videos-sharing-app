export type CommentType = {
    id:number,
    text:string,
    postId:number,
    parentCommentId:null|number,
    userId:number,
    createdAt:Date,
    updatedAt:Date
} 