const Notification = require("../models/notification.model.js");

 const getNotifications = async (req, res) => {
  try {
    const userID = req.user._id;
    const notifications = await Notification.find({ to: userID }).populate({
      path: "from",
      select: "username profileImg",
    });
    await Notification.updateMany({ to: userID }, { read: true });

     // Reverse the order of notifications  (to get the latest notifications on the top.)
     const reversedNotifications = notifications.reverse();

    // res.status(200).json(notifications);
    res.status(200).json(reversedNotifications);
  } catch (error) {
    console.log("error in getNotification controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
 const deleteNotifications = async (req, res) => {
  try {
    const userID = req.user._id;
    const notifications = await Notification.deleteMany({ to: userID });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("error in getNotification controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


 const deleteNotification = async (req, res) => {
  try {
    const userID = req.user._id;
    const notificationId = req.params.id;
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      to: userID,
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("error in getNotification controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  getNotifications,
  deleteNotifications,
  deleteNotification,
};
