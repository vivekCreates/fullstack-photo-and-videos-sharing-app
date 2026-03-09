import { useState } from "react";
import { MoreVertical, Reply } from "lucide-react";
import type { CommentType } from "../types/comment";
import { useComment } from "../context/CommentContext";
import { convertDate } from "../utils/utility";

type CommentProps = CommentType & {
  commentInput: string
  isCommentEditable: boolean
  setCommentInput: (text: string) => void
  setIsCommentEditable: (val: boolean) => void
  setEditableCommentId: (id: number) => void
  setParentCommentId: (id: number) => void
}

const CommentItem = ({
  id,
  user,
  text,
  createdAt,
  commentInput,
  isCommentEditable,
  setParentCommentId,
  setIsCommentEditable,
  setEditableCommentId,
  setCommentInput
}: CommentProps) => {

  const [open, setOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { deleteComment } = useComment();

  return (
    <div className="group flex gap-4 p-4 bg-black border border-zinc-800
    rounded-xl hover:border-zinc-700 transition relative
    shadow-[0_0_15px_rgba(255,255,255,0.02)]">

      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-zinc-700"
        />
      ) : (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 text-sm font-semibold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      )}


      <div className="flex-1">

    
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <h4 className="text-sm font-semibold text-zinc-200">
              @{user?.name}
            </h4>

            <span className="text-xs text-zinc-500">
              {convertDate(createdAt)}
            </span>
          </div>

     
          <div className="relative">

            <button
              onClick={() => setOpen(prev => !prev)}
              className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
            >
              <MoreVertical size={18} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-28 bg-zinc-900
              border border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50">

                <button
                  onClick={() => {
                    setOpen(false)
                    setCommentInput(text)
                    setEditableCommentId(id)
                    setIsCommentEditable(!isCommentEditable)
                  }}
                  className="block w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setOpen(false)
                    deleteComment(Number(id))
                  }}
                  className="block w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-zinc-800"
                >
                  Delete
                </button>

              </div>
            )}

          </div>

        </div>

        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
          {text}
        </p>

        
        <button
          className={`flex items-center gap-1 mt-3 text-xs transition
          ${isReplying ? "text-[#8B5CF6]" : "text-zinc-500 hover:text-white"}`}
          onClick={() => {
            setIsReplying(!isReplying)
            setParentCommentId(id)
          }}
        >
          <Reply size={16} />
          Reply
        </button>

      </div>

    </div>
  );
};

export default CommentItem;