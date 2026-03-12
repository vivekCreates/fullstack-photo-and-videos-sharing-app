
import type { CommentType } from "../types/comment";
import CommentItem from "./Comment";

type Props = {
  comments: CommentType[]
  parentId: number | null

  commentInput: string
  isCommentEditable: boolean
  setCommentInput: (text: string) => void
  setIsCommentEditable: (val: boolean) => void
  setEditableCommentId: (id: number) => void
  setParentCommentId: (id: number) => void
};

const CommentList = ({
  comments,
  parentId,
  commentInput,
  isCommentEditable,
  setCommentInput,
  setIsCommentEditable,
  setEditableCommentId,
  setParentCommentId
}: Props) => {

  const filtered = comments.filter(
    c => c.parentCommentId === parentId
  );

  return (
    <>
      {filtered.map(comment => (
        <div key={`${comment.id}-${comment.parentCommentId}`} className="flex flex-col gap-3">

          <CommentItem
            {...comment}
            commentInput={commentInput}
            isCommentEditable={isCommentEditable}
            setCommentInput={setCommentInput}
            setIsCommentEditable={setIsCommentEditable}
            setEditableCommentId={setEditableCommentId}
            setParentCommentId={setParentCommentId}
          />

          <div className="ml-12">
            <CommentList
              comments={comments}
              parentId={comment.id}
              commentInput={commentInput}
              isCommentEditable={isCommentEditable}
              setCommentInput={setCommentInput}
              setIsCommentEditable={setIsCommentEditable}
              setEditableCommentId={setEditableCommentId}
              setParentCommentId={setParentCommentId}
            />
          </div>

        </div>
      ))}
    </>
  );
};

export default CommentList;