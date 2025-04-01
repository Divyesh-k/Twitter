import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import MessagePage from "./MessagePage";
import ChatBox from "./ChatBox";
import { io } from "socket.io-client";

const data = {
  profileImg: "/avatars/boy1.png",
};

const ChatPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  // const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentchat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();

  useEffect(() => {
    // Fetch users
    // fetch("/api/users/allusers")
    //   .then((response) => response.json())
    //   .then((data) => setUsers(data))
    //   .catch((error) => console.error("Error fetching users:", error));

    const getchats = async () => {
      try {
        const res = await fetch(`/api/chat/${authUser._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setChats(data);
        // console.log("chats here: ", data);
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    };
    getchats();
  }, [authUser._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("http://localhost:5000"),{
      withCredentials: true,
    };
    socket.current.emit("new-user-add", authUser._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [authUser]);

 // Send Message to socket server
 useEffect(() => {
  if (sendMessage!==null) {
    socket.current.emit("send-message", sendMessage);}
}, [sendMessage]);


// Get the message from socket server
useEffect(() => {
  socket.current.on("recieve-message", (data) => {

    // console.log(data)
    setReceiveMessage(data);
  }

  );
}, [data]);


// const checkOnlineStatus = (chat) => {
//   const chatMember = chat.members.find((member) => member !== user._id);
//   const online = onlineUsers.find((user) => user.userId === chatMember);
//   return online ? true : false;
// };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full max-w-6xl mx-auto">
      {/* Sidebar */}
      <div className="bg-muted/20 p-4 border-r w-full md:w-64 md:min-w-[250px] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Chats</h2>
          <button className="rounded-full p-2 hover:bg-muted/50">
            <PlusIcon className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </button>
        </div>
        <div className="space-y-2">
          {/* Chat list items */}

          {chats.map((chat, index) => (
            <div onClick={() => setCurrentChat(chat)}>
              <MessagePage
                key={index}
                data={chat}
                currentUserId={authUser._id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        <ChatBox
          chat={currentchat}
          currentUser={authUser._id}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}
        />
      </div>
    </div>
  );
};

// // ChatListItem component for reusability
// const ChatListItem = ({ name, message, time, active = false }) => (
//   <Link
//     to="#"
//     className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 ${
//       active ? "bg-muted/30" : ""
//     }`}
//   >
//     <div className="avatar">
//       <div className="w-8 h-8 rounded-full">
//         <img
//           src={data.profileImg || "/avatar-placeholder.png"}
//           alt={name}
//           className="w-full h-full object-cover"
//         />
//       </div>
//     </div>
//     <div className="flex-1 min-w-0">
//       <p
//         className={`font-medium truncate ${
//           active ? "text-primary" : "text-muted-foreground"
//         }`}
//       >
//         {name}
//       </p>
//       <p className="text-sm text-muted-foreground truncate">{message}</p>
//     </div>
//     <div className="text-xs text-muted-foreground">{time}</div>
//   </Link>
// );

// function ChatListItem({ user, active, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       className={`flex items-center gap-3 p-2 cursor-pointer rounded-lg ${
//         active ? "bg-stone-700 text-white" : "hover:bg-purple-800   duration-300"
//       }`}
//     >
//       <div className="avatar">
//         <div className="w-8 h-8 rounded-full">
//           <img
//             src={user.profileImg || "/avatar-placeholder.png"}
//             alt={user.username}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className={`font-medium truncate ${active ? "text-white" : "text-lime-700"}`}>
//           {user.username}
//         </p>
//       </div>
//     </div>
//   );
// }

export default ChatPage;

function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function VideoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}
