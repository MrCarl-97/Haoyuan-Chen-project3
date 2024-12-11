import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../styles/User.css";

const User = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await api.get(`/users/${userId}`);
        setUserData(userRes.data);

        const postsRes = await api.get(`/posts?userId=${userId}`);
        setUserPosts(postsRes.data);
      } catch (error) {
        console.error("Failed to fetch user data or posts:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="user">
      <h1>{userData.username}'s Profile</h1>
      <div className="user-posts">
        <h2>Posts</h2>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post._id} className="user-post">
              <p>{post.content}</p>
              <small>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>This user has no posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default User;
