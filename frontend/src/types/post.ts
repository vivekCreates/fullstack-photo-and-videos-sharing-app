export type PostType = {
    id:number,
    title:string,
    description:string,
    file:string,
    createdAt:Date,
    updateAt:Date,
    user:{
        id:number,
        name:string,
        profileImage:string
    }
}