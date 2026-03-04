import type { CommentType } from "../types/comment"


export type CommentNode = CommentType & {
  children: CommentNode[]
}

export function buildCommentTree(
  comments: CommentType[]
): CommentNode[] {

  const commentMap = new Map<number, CommentNode>()
  const roots: CommentNode[] = []

  comments.forEach(comment => {
    commentMap.set(comment.id, {
      ...comment,
      children: []
    })
  })


  comments.forEach(comment => {
    const node = commentMap.get(comment.id)!

    if (comment.parentCommentId === null) {
      roots.push(node)
    } else {
      const parent = commentMap.get(comment.parentCommentId)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return roots
}