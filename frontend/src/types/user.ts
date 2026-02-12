export type User ={
    id:number,
    name:string,
    email:string,
    profile_image:String
    created_at:Date,
    update_at:Date

}


export type UserLogin = {
    email:string,
    password:string
}

export type UserRegister = {
    name:string,
    email:string,
    password:string
}