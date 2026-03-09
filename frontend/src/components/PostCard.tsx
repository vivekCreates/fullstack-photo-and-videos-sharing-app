import { useState, useRef, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, MoreVertical } from "lucide-react";
import { useAuth } from "../context/UserContext";
import { usePost } from "../context/PostContext";
import { useNavigate } from "react-router";
import { useBookmark } from "../context/BookmarkContext";

type PostCardProps = {
  id: number;
  name: string;
  title: string;
  description: string;
  postImage: string;
  isLiked: boolean;
  isBookmark: boolean;
  profileImage: string;
  likeCount: number;
  commentCount: number;
  userId: number;
};

export const PostCard = ({
  id,
  name,
  title,
  description,
  commentCount,
  postImage,
  isBookmark,
  isLiked,
  likeCount,
  profileImage,
  userId
}: PostCardProps) => {

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { deletePost, likeOrDislike } = usePost();
  const { toggleBookmark } = useBookmark();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="group w-full max-w-md bg-black border border-zinc-800 rounded-2xl overflow-hidden
    hover:border-zinc-600 transition-all duration-300
    hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] relative">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">

        <div className="flex items-center gap-3">

          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-9 h-9 rounded-full object-cover border border-zinc-700"
            />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-800 text-sm font-semibold">
              {name[0].toUpperCase()}
            </div>
          )}

          <h3 className="text-sm font-medium text-zinc-300">
            @{name}
          </h3>

        </div>

        {userId === user?.id && (

          <div className="relative" ref={menuRef}>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(prev => !prev);
              }}
              className="p-2 rounded-full hover:bg-zinc-800 transition"
            >
              <MoreVertical size={18} className="text-zinc-400" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-28 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50">

                <button
                  onClick={() => navigate(`/edit/${id}`)}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 rounded-t-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deletePost(id)}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-zinc-800 rounded-b-lg"
                >
                  Delete
                </button>

              </div>
            )}

          </div>

        )}

      </div>

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={postImage}
          onClick={() => navigate(`/post/${id}`)}
          alt="post"
          className="w-full h-64 object-cover cursor-pointer
          group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">

        <h2 className="text-lg font-semibold text-white tracking-wide">
          {title}
        </h2>

        {/* Actions */}
        <div className="flex items-center justify-between">

          <div className="flex gap-3">

            <button
              onClick={() => likeOrDislike(id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
            >
              <Heart
                size={18}
                fill={isLiked ? "red" : "none"}
                className={isLiked ? "text-red-500" : "text-zinc-300"}
              />
              <span className="text-sm text-zinc-300">{likeCount}</span>
            </button>

            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
            >
              <MessageCircle size={18} className="text-zinc-300" />
              <span className="text-sm text-zinc-300">{commentCount}</span>
            </button>

          </div>

          <button
            onClick={() => toggleBookmark(id)}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
          >
            <Bookmark
              size={18}
              fill={isBookmark ? "red" : "none"}
              className={isBookmark ? "text-red-500" : "text-zinc-300"}
            />
          </button>

        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">
          {description.slice(0, 120)}
        </p>

      </div>

    </div>
  );
};

export default PostCard;