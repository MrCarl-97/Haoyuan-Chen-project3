import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await api.post("/posts", { userId: user.id, content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleEditPost = (postId, currentContent) => {
    setEditingPostId(postId);
    setEditingContent(currentContent);
  };

  const handleSaveEdit = async (postId) => {
    if (!editingContent.trim()) return;
    try {
      const res = await api.put(`/posts/${postId}`, { content: editingContent });
      setPosts(posts.map((post) => (post._id === postId ? res.data : post)));
      setEditingPostId(null);
      setEditingContent("");
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingContent("");
  };

  return (
    <div className="home">
      <h1>Posts</h1>
      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post">
            {editingPostId === post._id ? (
              <div>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(post._id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <p>{post.content}</p>
                <small>
                  <Link to={`/user/${post.userId._id}`} className="user-link">
                    {post.userId.username}
                  </Link>{" "}
                  - {new Date(post.createdAt).toLocaleString()}
                </small>
                {user && post.userId._id === user.id && (
                  <>
                    <button onClick={() => handleEditPost(post._id, post.content)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {user && (
        <div className="create-post">
          <textarea
            placeholder="Write your post here..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button onClick={handleCreatePost}>Post</button>
        </div>
      )}
    </div>
  );
};

export default Home;
