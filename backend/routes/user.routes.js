const express = require("express");
const { protectedRoute } = require("../middleware/protectedRoute.js");
const {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
  getallusers,
  getUser,
  getFollowingFollowers,
} = require("../controllers/user.controller.js");
const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested",protectedRoute,getSuggestedUsers );
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.post("/update",protectedRoute,updateUser)
router.get("/allusers",getallusers);
router.get('/:userId',getUser);
router.get('/follow_following/:feedType',protectedRoute,getFollowingFollowers)

module.exports =router;
