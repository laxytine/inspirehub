import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import "../assets/css/blogs.css";

export default function Blogs(props) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const token = localStorage.getItem("token");

  useEffect(() => {
    retrieveBlogs();
  }, []);

  const retrieveBlogs = async () => {
    try {
      const response = await fetch('http://localhost:4000/blogs/getAllBlogs', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setBlogs(data.blogs);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving blogs:", error);
      setLoading(false);
    }
  };

  const handleSearch = (data) => {
    setBlogs(data);
  };

  const handleViewAll = () => {
    retrieveBlogs();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4 min-vh-100">
        <Spinner animation="border" className="text-white" />
      </div>
    );
  }

  return (
    <div className="bg bg-feature">
      <div className="container min-vh-100">
        <div className="row">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div className="col-12 mt-5" key={blog._id}>
                <div className="blog-post">
                  <h2 className="blog-title">{blog.title}</h2>
                  <p className="blog-content">{blog.content}</p>
                  <p className="blog-author">By {blog.name ? blog.name.username : 'Unknown Author'}</p>
                  <p className="blog-date">{new Date(blog.createdOn).toLocaleDateString()}</p>
                  {blog.comments && blog.comments.length > 0 && (
                    <div className="blog-comments">
                      <h3>Comments:</h3>
                      {blog.comments.map((comment, index) => (
                        <div key={index} className="comment">
                          <p><strong>{comment.userId.username}</strong>: {comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white mt-5 no-blogs">
              <p className="noblog">No blog found.</p>
              <Button className="view" onClick={handleViewAll}>
                View All Blogs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
