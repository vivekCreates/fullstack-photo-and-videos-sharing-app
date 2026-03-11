import { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import toast from "react-hot-toast";
import type { PostType } from "../types/post";
import { usePost } from "../context/PostContext";
import UserPostCard from "../components/UserPostCard";

function ProfilePage() {
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks" | "likes">(
    "posts"
  );

  const { user, token } = useAuth();
  const { posts } = usePost();

  const fetchPosts = async (type: "posts" | "bookmarks" | "likes") => {
    try {
      let url = "";

      if (type === "posts") url = "http://localhost:8000/api/posts/current-user";
      if (type === "bookmarks") url = "http://localhost:8000/api/bookmarks";
      if (type === "likes") url = "http://localhost:8000/api/likes";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      setUserPosts(data?.data);
    } catch (error: any) {
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
    <div className="min-h-screen bg-black text-white flex justify-center px-4">

      <div className="w-full max-w-6xl py-10">


        <div className="flex flex-col items-center border-b border-neutral-800 pb-8">

          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-neutral-700">
            <img
              src={String(user?.profile_image)}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="mt-4 text-xl sm:text-2xl font-semibold">
            @{user?.name}
          </h1>


          <div className="flex gap-6 sm:gap-10 mt-4 text-sm">

            <div className="text-center">
              <p className="font-semibold">
                {posts.filter((p) => p.user.id == user?.id).length}
              </p>
              <p className="text-neutral-400">Posts</p>
            </div>

            <div className="text-center">
              <p className="font-semibold">{user?.followersCount}</p>
              <p className="text-neutral-400">Followers</p>
            </div>

            <div className="text-center">
              <p className="font-semibold">{user?.followingCount}</p>
              <p className="text-neutral-400">Following</p>
            </div>

          </div>

        </div>


        <div className="flex justify-center gap-6 sm:gap-12 mt-6 border-b border-neutral-800 pb-3 text-sm overflow-x-auto">

          <button
            onClick={() => handleTabChange("posts")}
            className={`pb-2 whitespace-nowrap ${
              activeTab === "posts"
                ? "border-b border-white text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Posts
          </button>

          <button
            onClick={() => handleTabChange("bookmarks")}
            className={`pb-2 whitespace-nowrap ${
              activeTab === "bookmarks"
                ? "border-b border-white text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Bookmarks
          </button>

          <button
            onClick={() => handleTabChange("likes")}
            className={`pb-2 whitespace-nowrap ${
              activeTab === "likes"
                ? "border-b border-white text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Liked Posts
          </button>

        </div>


        <div className="mt-10">

          {userPosts.length === 0 ? (
            <p className="text-neutral-500 text-center">No posts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <UserPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;