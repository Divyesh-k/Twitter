const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const postRoutes = require("./routes/post.routes.js");
const storyRoutes = require("./routes/story.routes.js");
const notificationsRoutes = require("./routes/notifications.routes.js");
const chatRoutes = require("./routes/chat.routes.js");
const MessageRoute = require("./routes/message.routes.js");

const connectMongoDb = require("./db/connectMongoDb.js");
const socketHandler = require("./socket.js"); // Import the socket handler


// const http = require('http');

// const socketIO = require('socket.io');

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 5001;
// const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // to parse req.body  , making payload upto (100kb, 5mb...) only.
app.use(express.urlencoded({ extended: true })); // to parse from data (urlencoded)
app.use(cookieParser());
app.use(cors());

// routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", MessageRoute);
app.use("/api/story",storyRoutes);

// console.log("node env here :",process.env.NODE_ENV);
// frontend dist file for ubuntu
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend","dist", "index.html"));
//   });
// }

// // frontend dist file for windows
if (process.env.NODE_ENV === "production") {
  // Adjust the path to go up one level and then into the frontend/dist directory
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "frontend", "dist", "index.html")
    );
  });
}

//--------------------------------------------------------------
// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*", //https://twiter-clone-ol5q.onrender.com    ... front end url  http://localhost:5173
//     methods: ["GET", "POST"],
//     // credentials: true,
//   },
// });

// let activeUsers = [];

// io.on("connection", (socket) => {
//   console.log("socket connection is on.");
//   socket.on("new-user-add", (newUserId) => {
//     // if user is not added previously
//     if (!activeUsers.some((user) => user.userId === newUserId)) {
//       activeUsers.push({ userId: newUserId, socketId: socket.id });
//       console.log("New User Connected", activeUsers);
//     }
//     // send all active users to new user
//     io.emit("get-users", activeUsers);
//   });

//   // send message to a specific user
//   socket.on("send-message", (data) => {
//     const { receiverId } = data;
//     const user = activeUsers.find((user) => user.userId === receiverId);
//     console.log("Sending from socket to :", receiverId);
//     console.log("Data: ", data);
//     if (user) {
//       io.to(user.socketId).emit("recieve-message", data);
//     }
//   });

//   socket.on("disconnect", () => {
//     // remove user from active users
//     activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
//     console.log("User Disconnected", activeUsers);
//     // send all active users to all users
//     io.emit("get-users", activeUsers);
//   });
// });

//--------------------------------------------------------------





//--------------------------------------------------------------
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

socketHandler(io); // Use the socket handler

//--------------------------------------------------------------


// testing route
app.get("/testroute", (req, res) => {
  res.send("Testing twiter backend!!");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectMongoDb();
});
