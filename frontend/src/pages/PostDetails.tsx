import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { PostType } from "../types/post";
import toast from "react-hot-toast";
import { useAuth } from "../context/UserContext";
import { useParams } from "react-router";
import { convertDate } from "../utils/utility";
import { Loader } from "lucide-react";

export const PostDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComments,setShowComments] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/posts/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Something went wrong");
        }

        setPost(data.data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="animate-spin text-white" size={40} />
      </div>
    );
  }

  if (!post) {
    return <div className="text-white text-center mt-20">Post not found</div>;
  }

 return (
  <div className="min-h-screen bg-black text-white">
    <Navbar />

    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* POST CARD */}
      <div className="bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">

        {/* Image */}
        <div className="bg-zinc-800">
          <img
            src={post.file}
            alt="Post"
            className="w-full max-h-[500px] object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8">

          {/* User */}
          <div className="flex items-center gap-3 mb-6">
            {post.user.profileImage ? (
              <img
                src={post.user.profileImage}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-700">
                {post.user.name[0].toUpperCase()}
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold">
                {post.user.name}
              </h3>
              <p className="text-xs text-zinc-500">
                {convertDate(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-zinc-400 leading-relaxed text-lg mb-8">
            {post.description}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-6 border-t border-zinc-800 pt-4">

            <button
              onClick={() => setShowComments(!showComments)}
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              💬 {showComments ? "Hide Comments" : "View Comments"}
            </button>

          </div>

        </div>
      </div>

      {/* COMMENTS PANEL */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showComments ? "max-h-[800px] opacity-100 mt-8" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg">

          {/* Comment Input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500 transition"
            />
            <button className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition">
              Post
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-5 min-h-[80px]">
            <p className="text-zinc-500 text-sm">
              No comments yet.
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
);
};