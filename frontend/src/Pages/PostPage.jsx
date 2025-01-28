import React from 'react'

import CreatePost from '../Components/PostsPageCompo/CreatePost/CreatePost'
import CreatePostNavBar from '../Components/PostsPageCompo/CreatePostnavBar/CreatePostNavBar'
import Posts from '../Components/PostsPageCompo/Posts/Posts'

import Post from '../Components/Login_Post_Profile/Post_Page/Post'


const PostPage = () => {
  return (
    <div>

      <CreatePostNavBar/>
      <Posts/>


      <Post />

    </div>
  )
}

export default PostPage
