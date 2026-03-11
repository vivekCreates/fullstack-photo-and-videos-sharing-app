import PostCard from './PostCard'
import { usePost } from '../context/PostContext'



function PostSection() {
  const {posts} = usePost();
  return (
    
    <div className='w-[70%] grid grid-cols-3 gap-4'>
      {
      posts.map((post)=>(
        <PostCard 
        key={post.id}
        name={post.user.name}
        isLiked={post.isLiked}
        isBookmark={post.isBookmark}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        id ={post.id} 
        title={post.title} 
        description={post.description}
        postImage={post.file}
        profileImage={post.user.profileImage}
        userId={post.user.id}
        isFollowed={post.user.isFollowed}
        isOwner={post.isOwner}
        />
      ))
    }
  </div>
  )
}

export default PostSection