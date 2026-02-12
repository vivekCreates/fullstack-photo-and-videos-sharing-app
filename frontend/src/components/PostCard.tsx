import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { randomColor } from "../utils/utility";
import { useAuth } from "../context/UserContext";

type PostCardProps = {
  id: number;
  name: string;
  title: string;
  description: string;
  postImage: string;
  profileImage:string;
  userId:number
};

export const PostCard = ({
  id,
  name,
  title,
  description,
  postImage,
  profileImage,
  userId
}: PostCardProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const {user} = useAuth()
 

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-200 relative">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2 ">
          {
            profileImage ? (<img
            src={profileImage}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />)
          :
              (
                <div className="w-8 h-8 rounded-full object-cover flex items-center justify-center bg-[#222222] ">
                    {name[0].toUpperCase()}
                </div>
              )
          }
          
          <h3 className="text-sm font-medium text-zinc-200">
            @{name}
          </h3>
        </div>
          {
            userId == user?.id && (
              <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-full hover:bg-zinc-800 transition"
          >
            <MoreVertical size={18} className="text-zinc-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-28 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
              <button className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700 rounded-t-md">
                Edit
              </button>
              <button className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-700 rounded-b-md">
                Delete
              </button>
            </div>
          )}
        </div>
            )
          }
        
      </div>

      <img
        src={postImage}
        alt="post"
        className="w-full max-h-60 object-cover"
      />

      <div className="px-3 py-3 space-y-1.5">
        <h2 className="text-base font-semibold text-white">
          {title}
        </h2>

        <p className="text-xs text-zinc-400 leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
