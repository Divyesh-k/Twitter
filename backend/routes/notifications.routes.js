const express = require("express");
const { protectedRoute } = require("../middleware/protectedRoute.js");
const { deleteNotifications, deleteNotification, getNotifications } = require("../controllers/notifications.controller.js");


const router = express.Router();

router.get("/",protectedRoute,getNotifications);
router.delete("/delete",protectedRoute,deleteNotifications);
router.delete("/delete/:id",protectedRoute,deleteNotification);


module.exports =router;