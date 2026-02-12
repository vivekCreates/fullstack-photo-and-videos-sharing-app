export type PostType = {
    id:number,
    title:string,
    description:string,
    file:string,
    created_at:Date,
    update_at:Date,
    user:{
        id:number,
        name:string,
        profileImage:string
    }
}