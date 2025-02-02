import React from 'react'
import CreatePost from '../Components/PostsPageCompo/CreatePost/CreatePost'
import CreatePostNavBar from '../Components/PostsPageCompo/CreatePostnavBar/CreatePostNavBar'
import Posts from '../Components/PostsPageCompo/Posts/Posts'

const PostPage = () => {
  return (
    <div>
      <CreatePostNavBar/>
      <Posts/>
    </div>
  )
}

export default PostPage
