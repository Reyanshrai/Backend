import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        axios.post('http://localhost:3000/create-post', formData)
            .then(response => {
                console.log("Post created successfully:", response.data);
                // Optionally, you can redirect to the feed page or clear the form here
                navigate('/feed');
            })
            .catch(error => {
                console.error("Error creating post:", error);
            })
    };

  return (
    
        <>
            <section className="create-post-section">
                <h2>Create Post</h2>
                <form onSubmit={handleSubmit}>
                    <input type="file" name="image" accept='image/*'/>
                    <input type="text" name="caption" placeholder='Enter Caption' required/>
                    <button type="submit">Submit</button>
                </form>
            </section>

        </>
  )
}

export default CreatePost
