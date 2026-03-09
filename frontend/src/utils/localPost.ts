

export const createLocalPost = (post: any) => {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    file: post.file,
    createdAt: post.createdAt ?? new Date().toISOString(),
    updateAt: post.updateAt ?? new Date().toISOString(),
    isLiked: post.isLiked ?? false,
    isBookmark: post.isBookmark ?? false,
    likeCount: post.likeCount ?? 0,
    commentCount: post.commentCount ?? 0,
    user: {
      id: post.user?.id,
      name: post.user?.name,
      profileImage: post.user?.profileImage
    }
  }
}