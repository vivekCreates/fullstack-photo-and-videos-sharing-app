import { useState } from "react";
import { MoreVertical, Reply, ReplyAll, ReplyIcon } from "lucide-react";
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
    isCommentEditable,
    setParentCommentId,
    createdAt,
    setIsCommentEditable,
    setEditableCommentId,
    setCommentInput
}: CommentProps) => {


    const [open, setOpen] = useState(false);
    const [isReplying,setIsReplying] = useState(false);
    const { deleteComment } = useComment();

    return (
        <div className="flex gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition relative">

            <img
                src={user?.profileImage}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
            />


            <div className="flex-1">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">
                            {user?.name}
                        </h4>

                        <span className="text-xs text-zinc-500">
                            {convertDate(createdAt)}
                        </span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setOpen(prev => !prev)}
                            className="text-zinc-500 hover:text-white transition"
                        >
                            <MoreVertical size={18} />
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-28 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden z-10">
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        setCommentInput(text)
                                        setEditableCommentId(id)
                                        setIsCommentEditable(!isCommentEditable)
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        deleteComment(Number(id))
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                    {text}
                </p>
                <span className="pt-4" onClick={() => {
                    setIsReplying(!isReplying)
                    setParentCommentId(id)
                }
}>
                    <Reply size={20} color={isReplying ? "blue":"grey"} />
                </span>
            </div>
        </div>
    );
};

export default CommentItem;