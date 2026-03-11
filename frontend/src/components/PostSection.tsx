import PostCard from "./PostCard";
import { usePost } from "../context/PostContext";

function PostSection() {
  const { posts } = usePost();

  return (
    <div
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {posts.map((post) => (
        <PostCard
          key={post.id}
          name={post.user.name}
          isLiked={post.isLiked}
          isBookmark={post.isBookmark}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          id={post.id}
          title={post.title}
          description={post.description}
          postImage={post.file}
          profileImage={post.user.profileImage}
          userId={post.user.id}
          isFollowed={post.user.isFollowed}
          isOwner={post.isOwner}
        />
      ))}
    </div>
  );
}

export default PostSection;