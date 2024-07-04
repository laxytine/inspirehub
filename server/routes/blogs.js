const express = require("express");
const blogController = require("../controllers/blogs");

const {verify, verifyAdmin} = require("../auth");

const router = express.Router();


// [SECTION] For Authenticated User
router.post("/addBlog", verify, blogController.addBlog);
router.get("/getMyBlogs", verify, blogController.getMyBlogs);
router.get("/getBlog/:id", verify, blogController.getBlogById);
router.put("/updateBlog/:id", verify, blogController.updateBlog);

router.post("/addComment", verify, blogController.addComment);
router.put("/editComent/:id", verify, blogController.editComment);

// [SECTION] For Authenticated User and Admin
router.delete("/deleteBlog/:id", verify, verifyAdmin, blogController.deleteBlog);
router.delete("/deleteComment/:id", verify, verifyAdmin, blogController.deleteComment);

// [SECTION] For All Users
router.get("/getAllBlogs", blogController.getAllBlogs);
router.get("/getAllComments", blogController.getAllComments);


module.exports = router;