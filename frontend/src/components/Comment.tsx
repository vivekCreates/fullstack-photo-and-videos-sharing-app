import { useState } from "react";
import { MoreVertical, Reply } from "lucide-react";
import type { CommentType } from "../types/comment";
import { useComment } from "../context/CommentContext";
import { convertDate } from "../utils/utility";

type CommentProps = CommentType & {
  commentInput: string;
  isCommentEditable: boolean;
  setCommentInput: (text: string) => void;
  setIsCommentEditable: (val: boolean) => void;
  setEditableCommentId: (id: number) => void;
  setParentCommentId: (id: number) => void;
};

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
    <div
      className="
      group flex gap-3 sm:gap-4 p-3 sm:p-4
      bg-neutral-900 border border-neutral-800
      rounded-lg sm:rounded-xl
      hover:border-neutral-700
      hover:bg-neutral-800
      transition relative shadow-sm
      "
    >

      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-neutral-700"
        />
      ) : (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-neutral-800 text-xs sm:text-sm font-semibold text-white">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">

        <div className="flex items-center justify-between gap-2">

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
              @{user?.name}
            </h4>
            <span className="text-[10px] sm:text-xs text-neutral-400">
              {convertDate(createdAt)}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen(prev => !prev)}
              className="p-1 rounded-full text-white hover:bg-neutral-700 transition"
            >
              <MoreVertical size={18} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-24 sm:w-28 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={() => {
                    setOpen(false);
                    setCommentInput(text);
                    setEditableCommentId(id);
                    setIsCommentEditable(!isCommentEditable);
                  }}
                  className="block w-full text-left px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-white hover:bg-neutral-800"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    deleteComment(Number(id));
                  }}
                  className="block w-full text-left px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-red-500 hover:bg-neutral-800"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

        </div>

        <p className="mt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed break-words">
          {text}
        </p>


        <button
          className={`flex items-center gap-1 mt-3 text-[11px] sm:text-xs transition
          ${isReplying ? "text-violet-500" : "text-white hover:text-violet-400"}`}
          onClick={() => {
            setIsReplying(!isReplying);
            setParentCommentId(id);
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