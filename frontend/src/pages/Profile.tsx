import { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import toast from "react-hot-toast";

type PostType = {
    id:number;
    title:string;
    description:string;
    file:string;
    createdAt:Date;
    updateAt:Date;
}

function ProfilePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const {user,token} = useAuth();

  useEffect(() => {
    const fetchCurrentUserPosts = async()=>{
        try {
            const response = await fetch("http://localhost:8000/api/posts/current-user",{
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            if (!response.ok){
                throw new Error("Failed to fetch current user posts")
            }
            const data = await response.json();

            if(!data.success){
                throw new Error(data.message || "Something went wrong") 
            }
            setPosts(data?.data)
            toast.success(data.message)
        } catch (error:any) {
            console.log(error?.message)
            toast.error(error?.message)

        }
    }
   fetchCurrentUserPosts()
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-[70%] py-10">

        <div className="flex flex-col items-center border-b border-zinc-800 pb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-600 shadow-lg shadow-indigo-900/30">
            <img
              src={String(user?.profile_image!)}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-wide">
            @{user?.name}
          </h1>

          <p className="text-zinc-400 mt-1">
            3 Posts
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-6">My Posts</h2>

          {posts.length === 0 ? (
            <p className="text-zinc-500">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer shadow-lg shadow-black/40"
                >
                  <img
                    src={post.file}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg">
                      {post.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
