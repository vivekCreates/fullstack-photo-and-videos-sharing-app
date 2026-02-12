import React from 'react'
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
        username={post.user.name}
        id ={post.id} 
        title={post.title} 
        description={post.description}
        postImage={post.file}
        profileImage={post.user.profileImage}

        />
      ))
    }
  </div>
  )
}

export default PostSection