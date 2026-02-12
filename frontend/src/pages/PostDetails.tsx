import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import type { PostType } from "../types/post";
import toast from "react-hot-toast";
import { useAuth } from "../context/UserContext";
import { useParams } from "react-router";
import { convertDate } from "../utils/utility";

export const PostDetails= () => {
  const {id} = useParams();
 console.log("id: ",id)
  const [post,setPost] = useState<PostType|null>(null);
  const {token} = useAuth();

  useEffect(()=>{
      const fetchPost = async() => {
        try {
            const response = await fetch(`http://localhost:8000/api/posts/${id}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            })

            if (!response.ok){
                throw new Error("Failed to fetch posts")

            }

            const data = await response.json();
            if (!data.success){
                throw new Error(data.message || "Something went wrong")
            }
            setPost(data.data)
            console.log("data: ",data.data)
            toast.success(data.message)
        
        } catch (error:any) {
            toast.error(error.message)
        }
      }
      fetchPost()
  },[])
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between items-center">
      <Navbar/>
      <div className="w-[70%] h-140 mb-10 max-w-6xl bg-zinc-900 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        <div className="h-96 md:h-auto bg-zinc-800">
          <img
            src={post?.file}
            alt="Post"
            className="w-full h-full object-cover object-center "
          />
        </div>

        <div className="px-10 py-6 h-fit flex flex-col gap-6 justify-between">
          <div className="flex items-center gap-2 ">
          {
            post?.file ? (<img
            src={post.user.profileImage}
            alt={post.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />)
          :
              (
                <div className="w-8 h-8 rounded-full object-cover flex items-center justify-center bg-[#222222] ">
                    {post?.user.name[0].toUpperCase()}
                </div>
              )
          }
          
          <h3 className="text-sm font-medium text-zinc-200">
            {post?.user.name}
          </h3>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-6">
              {post?.title}
            </h1>

            <p className="text-zinc-400 leading-relaxed mb-8">
             {post?.description}
            </p>
          </div>

          <div className="border-t border-zinc-700 pt-6 text-sm text-zinc-500">
           {convertDate(post?.createdAt!)}
          </div>

        </div>

      </div>

    </div>
  );
};

