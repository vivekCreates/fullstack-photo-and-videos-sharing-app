import { useState } from "react";
import { usePost } from "../context/PostContext";
import { useAuth } from "../context/UserContext";



function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks" | "likes">(
    "posts"
  );
  const {userPosts,getUserPosts} = usePost();
  const {user} = useAuth();

 

  const handleTabChange = (tab: "posts" | "bookmarks" | "likes") => {
    setActiveTab(tab);
  
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

          <p className="text-zinc-400 mt-1">{userPosts.length} Posts</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-10 mt-8 border-b border-zinc-800 pb-4">
          <button
            onClick={
              () => {
                handleTabChange("posts")
                getUserPosts()
              }
            }
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
          {userPosts.length === 0 ? (
            <p className="text-zinc-500 text-center">No posts found.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-900 border border-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer shadow-lg shadow-black/40"
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