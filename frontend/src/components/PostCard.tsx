import { useState, useRef, useEffect } from "react";
import { Bookmark, Heart, MessageCircle, MoreVertical } from "lucide-react";
import { useAuth } from "../context/UserContext";
import { usePost } from "../context/PostContext";
import { useNavigate } from "react-router";
import { useBookmark } from "../context/BookmarkContext";
import { useLike } from "../context/LikeContext";
import { useFollower } from "../context/FollowerContext";

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
  isFollowed: boolean;
  isOwner: boolean;
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
  userId,
  isFollowed,
  isOwner,
}: PostCardProps) => {

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { deletePost } = usePost();
  const { toggleLike } = useLike();
  const { toggleFollower } = useFollower();
  const { toggleBookmark } = useBookmark();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="group w-full bg-black border border-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden
      hover:border-neutral-600 transition-all duration-300
      hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] relative"
    >

      <div className="flex items-center justify-between px-3 sm:px-4 py-3">

        <div className="flex items-center gap-2 sm:gap-3">

          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-neutral-700"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-neutral-800 text-xs sm:text-sm font-semibold">
              {name[0].toUpperCase()}
            </div>
          )}

          <h3 className="text-xs sm:text-sm font-medium text-neutral-300">
            @{name}
          </h3>

        </div>

        <div className="flex gap-2 items-center">

          {!isOwner && (
            <button
              onClick={() => toggleFollower(userId)}
              className={`px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium rounded-full transition
                ${isFollowed
                  ? "bg-neutral-900 text-neutral-300"
                  : "bg-white text-black hover:bg-neutral-200"
                }`}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
          )}

          {userId === user?.id && (

            <div className="relative" ref={menuRef}>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
                className="p-2 rounded-full hover:bg-neutral-800 transition"
              >
                <MoreVertical size={18} className="text-neutral-400" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-28 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-50">

                  <button
                    onClick={() => navigate(`/edit/${id}`)}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 rounded-t-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deletePost(id)}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-neutral-800 rounded-b-lg"
                  >
                    Delete
                  </button>

                </div>
              )}

            </div>
          )}

        </div>
      </div>

      <div className="overflow-hidden">
        <img
          src={postImage}
          onClick={() => navigate(`/post/${id}`)}
          alt="post"
          className="w-full h-48 sm:h-56 md:h-64 object-cover cursor-pointer
          group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="px-3 sm:px-4 py-4 space-y-3">

        <h2 className="text-base sm:text-lg font-semibold text-white">
          {title}
        </h2>


        <div className="flex items-center justify-between">

          <div className="flex gap-2 sm:gap-3">

            <button
              onClick={() => toggleLike(id)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full
              bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition"
            >
              <Heart
                size={18}
                fill={isLiked ? "red" : "none"}
                className={isLiked ? "text-red-500" : "text-neutral-300"}
              />
              <span className="text-xs sm:text-sm text-neutral-300">
                {likeCount}
              </span>
            </button>

            <button
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full
              bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition"
            >
              <MessageCircle size={18} className="text-neutral-300" />
              <span className="text-xs sm:text-sm text-neutral-300">
                {commentCount}
              </span>
            </button>

          </div>

          <button
            onClick={() => toggleBookmark(id)}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition"
          >
            <Bookmark
              size={18}
              fill={isBookmark ? "red" : "none"}
              className={isBookmark ? "text-red-500" : "text-neutral-300"}
            />
          </button>

        </div>


        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          {description.slice(0, 120)}
        </p>

      </div>
    </div>
  );
};

export default PostCard;