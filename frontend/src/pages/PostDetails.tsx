import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { PostType } from "../types/post";
import toast from "react-hot-toast";
import { useAuth } from "../context/UserContext";
import { useParams } from "react-router";
import { convertDate } from "../utils/utility";
import { Loader, MessageCircle } from "lucide-react";
import { useComment } from "../context/CommentContext";
import CommentList from "../components/CommentList";

export const PostDetails = () => {

  const { id } = useParams();
  const { token } = useAuth();

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommentEditable, setIsCommentEditable] = useState(false);
  const [editableCommentId, setEditableCommentId] = useState<number | null>(null);
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);

  const { createComment, comments, fetchComment, updateComment } = useComment();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch post");

        const data = await response.json();

        if (!data.success) throw new Error(data.message);

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

      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden
        hover:border-zinc-700 transition-all
        shadow-[0_0_25px_rgba(255,255,255,0.03)]">

        
          <div className="overflow-hidden">
            <img
              src={post.file}
              alt="Post"
              className="w-full max-h-[520px] object-cover hover:scale-105 transition duration-500"
            />
          </div>

          <div className="p-8">

            <div className="flex items-center gap-3 mb-6">

              {post.user.profileImage ? (
                <img
                  src={post.user.profileImage}
                  alt={post.user.name}
                  className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                />
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-zinc-800 font-semibold">
                  {post.user.name[0].toUpperCase()}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-zinc-200">
                  @{post.user.name}
                </h3>
                <p className="text-xs text-zinc-500">
                  {convertDate(post.createdAt)}
                </p>
              </div>

            </div>

       
            <h1 className="text-3xl font-bold mb-4 tracking-wide">
              {post.title}
            </h1>

            <p className="text-zinc-400 leading-relaxed text-lg mb-8">
              {post.description}
            </p>

        
            <button
              onClick={() => {
                fetchComment(Number(id));
                setShowComments(prev => !prev);
              }}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
            >
              <MessageCircle size={18} />
              {showComments ? "Hide Comments" : "View Comments"}
            </button>

          </div>
        </div>

        <div
          className={`transition-all duration-500 overflow-hidden
          ${showComments
              ? "max-h-[900px] opacity-100 mt-8"
              : "max-h-0 opacity-0"
            }`}
        >

          <div className="bg-black border border-zinc-800 rounded-2xl p-6
          shadow-[0_0_25px_rgba(255,255,255,0.03)]">

           
            <div className="flex gap-3 mb-6">

              <input
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                type="text"
                placeholder="Write a comment..."
                className="flex-1 bg-zinc-900 border border-zinc-800
                p-3 rounded-xl text-sm
                focus:outline-none focus:border-[#8B5CF6]
                transition"
              />

              {isCommentEditable ? (

                <button
                  onClick={() => {
                    updateComment({
                      commentId: editableCommentId!,
                      text: comment
                    });

                    setComment("");
                    setIsCommentEditable(false);
                    setParentCommentId(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6]
                  hover:bg-[#7C3AED] transition"
                >
                  Update
                </button>

              ) : (

                <button
                  onClick={() => {
                    createComment({
                      postId: post.id,
                      parentCommentId,
                      text: comment
                    });

                    setComment("");
                  }}
                  className="px-5 py-2 rounded-xl bg-[#8B5CF6]
                  hover:bg-[#7C3AED] transition"
                >
                  Post
                </button>

              )}

            </div>

            <div className="space-y-6 min-h-[80px]">

              <CommentList
                comments={comments}
                parentId={null}
                commentInput={comment}
                isCommentEditable={isCommentEditable}
                setCommentInput={setComment}
                setIsCommentEditable={setIsCommentEditable}
                setEditableCommentId={setEditableCommentId}
                setParentCommentId={setParentCommentId}
              />

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};