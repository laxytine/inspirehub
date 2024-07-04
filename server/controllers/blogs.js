const Blog = require("../models/Blogs");
const User = require('../models/User');
const { errorHandler } = require('../auth.js');



// [SECTION] Create Post (Authenticated User)
module.exports.addBlog = (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    Blog.findOne({ title })
        .then(existingBlog => {
            if (existingBlog) {
                return res.status(400).send({ message: 'Blog with the same title already exists' });
            }

            const newBlog = new Blog({
                title,
                content
            });

            return newBlog.save();
        })
        .then(savedBlog => {
            res.status(201).send(savedBlog);
        })
        .catch(error => {
            console.error("Error in saving the blog: ", error);
            res.status(500).send({ error: 'Failed to save the blog' });
        });
};



// [SECTION] Get My Blogs (Authenticated Users)
module.exports.getMyBlogs = (req, res) => {
  const userId = req.user.id;

  Blog.find({ userId })
    .then(blogs => {
      if (blogs.length > 0) {
        return res.status(200).send({ blogs });
      } else {
        return res.status(404).send({ message: 'No blogs found.' });
      }
    })
    .catch(err => res.status(500).send({ error: 'Error finding blogs.' }));
};


// [SECTION] Get Single Blog (Authenticated User)
module.exports.getBlogById = (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.id;

  Blog.findOne({ _id: blogId, userId })
    .then(foundBlog => {
      if (!foundBlog) {
        return res.status(404).send({ error: 'Blog not found or you do not have permission to view it.' });
      }
      return res.status(200).send(foundBlog);
    })
    .catch(err => {
      console.error("Error in fetching the blog: ", err)
      return res.status(500).send({ error: 'Failed to fetch blog' });
    });
};

// [SECTION] Update Blog (Authenticated User)
module.exports.updateBlog = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.id;

        // Find the blog by ID and ensure it belongs to the authenticated user
        const blog = await Blog.findOne({ _id: blogId, userId });
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found or you do not have permission to update it.' });
        }

        // Extract the new title and content from the request body
        const blogUpdates = {
            title: req.body.title,
            content: req.body.content
        };

        // Check if the updates provided are the same as the current blog data
        if (
            blog.title === blogUpdates.title &&
            blog.content === blogUpdates.content
        ) {
            return res.status(400).send({ message: 'No updates provided' });
        }

        // Update the blog with the new data
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogUpdates, { new: true });

        return res.status(200).send({ 
            message: 'Blog updated successfully', 
            updatedBlog 
        });
    } catch (error) {
        console.error("Error in updating a blog:", error);
        return res.status(500).send({ error: 'Error in updating a blog.' });
    }
};

// [SECTION] Add Blog Comment (Authenticated User)
module.exports.addComment = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).send({ error: 'Comment is required' });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }

        // Add the comment to the blog
        blog.comments.push({ userId, comment });
        await blog.save();

        return res.status(201).send({ message: 'Comment added successfully', blog });
    } catch (error) {
        console.error("Error in adding a comment: ", error);
        return res.status(500).send({ error: 'Failed to add comment' });
    }
};

// [SECTION] Edit Comment (Authenticated User)
module.exports.editComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        // Check if the comment belongs to the authenticated user
        if (comment.userId.toString() !== userId) {
            return res.status(403).send({ error: 'You do not have permission to edit this comment' });
        }

        // Update the comment
        comment.text = req.body.text; // Assuming text is the field to update
        await comment.save();

        return res.status(200).send({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error("Error in updating a comment:", error);
        return res.status(500).send({ error: 'Error in updating a comment.' });
    }
};


// [SECTION] Delete Blog (Admin and Authenticated User)
module.exports.deleteBlog = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.id;

        // Find the blog by ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Check if the user is the owner of the blog or an admin
        if (blog.username.toString() !== userId.toString() && !user.isAdmin) {
            return res.status(403).send({ error: 'You do not have permission to delete this blog' });
        }

        // Delete the blog
        const deletedBlog = await Blog.deleteOne({ _id: blogId });
        if (deletedBlog.deletedCount === 0) {
            return res.status(400).send({ error: 'No blog deleted' });
        }

        return res.status(200).send({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error("Error in deleting a blog: ", error);
        return res.status(500).send({ error: 'Error in deleting a blog.' });
    }
};

// [SECTION] Delete Comments on Blog (Admin and Authenticated User)
module.exports.deleteComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId; // Assuming you pass commentId in URL params

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Check if the user is the owner of the comment or an admin
        if (comment.user.toString() !== userId && !user.isAdmin) {
            return res.status(403).send({ error: 'You do not have permission to delete this comment' });
        }

        // Delete the comment
        await comment.remove();

        return res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error("Error in deleting a comment: ", error);
        return res.status(500).send({ error: 'Error in deleting a comment.' });
    }
};


// [SECTION] Get All Blogs (All Users)
module.exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('name').populate('comments.userId');
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ error: 'Error finding blogs.' });
  }
};



// [SECTION] Get Blog Comments (All Users)
module.exports.getAllComments = async (req, res) => {
    try {
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }

        // Assuming comments are stored directly in the blog document
        const comments = blog.comments;

        return res.status(200).send({ comments });
    } catch (error) {
        console.error("Error in fetching comments: ", error);
        return res.status(500).send({ error: 'Failed to fetch comments' });
    }
};