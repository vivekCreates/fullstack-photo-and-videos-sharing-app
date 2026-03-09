import { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import toast from "react-hot-toast";
import type { PostType } from "../types/post";



function ProfilePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks" | "likes">(
    "posts"
  );

  const { user, token } = useAuth();

  const fetchPosts = async (type: "posts" | "bookmarks" | "likes") => {
    try {
      let url = "";

      if (type === "posts") {
        url = "http://localhost:8000/api/posts/current-user";
      }

      if (type === "bookmarks") {
        url = "http://localhost:8000/api/bookmarks";
      }

      if (type === "likes") {
        url = "http://localhost:8000/api/likes";
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }
      console.log("posts: ",data?.data)
      setPosts(data?.data);
    } catch (error: any) {
      console.log(error?.message);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchPosts("posts");
  }, []);

  const handleTabChange = (tab: "posts" | "bookmarks" | "likes") => {
    setActiveTab(tab);
    fetchPosts(tab);
  };

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

          <p className="text-zinc-400 mt-1">{posts.filter(p=>p.user.id==user?.id)?.length} Posts</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-10 mt-8 border-b border-zinc-800 pb-4">
          <button
            onClick={() => handleTabChange("posts")}
            className={`pb-2 ${
              activeTab === "posts"
                ? "border-b-2 border-indigo-500 text-white"
                : "text-zinc-400"
            }`}
          >
            My Posts
          </button>

          <button
            onClick={() => handleTabChange("bookmarks")}
            className={`pb-2 ${
              activeTab === "bookmarks"
                ? "border-b-2 border-indigo-500 text-white"
                : "text-zinc-400"
            }`}
          >
            Bookmarks
          </button>

          <button
            onClick={() => handleTabChange("likes")}
            className={`pb-2 ${
              activeTab === "likes"
                ? "border-b-2 border-indigo-500 text-white"
                : "text-zinc-400"
            }`}
          >
            Liked Posts
          </button>
        </div>

        <div className="mt-10">
          {posts.length === 0 ? (
            <p className="text-zinc-500 text-center">No posts found.</p>
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
                    <h3 className="font-medium text-lg">{post.title}</h3>
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