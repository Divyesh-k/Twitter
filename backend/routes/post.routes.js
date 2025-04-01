const express = require("express");
const { protectedRoute } = require("../middleware/protectedRoute.js");
const {
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
  commentOnPost,
  createPost,
  deletePost,
  likeUnlikePost,
  addSavedPost,
  getSavedPost,
} = require("../controllers/post.controller.js");

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/followingposts", protectedRoute, getFollowingPosts);
router.get("/userposts/:username", protectedRoute, getUserPosts);
router.get("/likedpost/:id", protectedRoute, getLikedPosts);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/create", protectedRoute, createPost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete("/deletepost/:id", protectedRoute, deletePost);
router.post("/addsavedpost/:postId",protectedRoute,addSavedPost);
router.get("/getsavedpost",protectedRoute,getSavedPost);


module.exports = router;

