import React, { useState,useEffect, use} from "react";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      _id: "1",
      image: "https://images.pexels.com/photos/35846663/pexels-photo-35846663.jpeg",
      caption: "First post!",
    }
  ]);

  useEffect(() => {
    axios.get('http://localhost:3000/posts')
      .then(response => {
        setPosts(response.data.posts);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);


  return (
    <section className="feed-section">
      <h2>Feed</h2>

      {
        // Fetch posts from backend and setPosts

        posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <img src={post.image} alt={post.caption} />
              <p>{post.caption}</p>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )

      }
    </section>
  );
};

export default Feed;
