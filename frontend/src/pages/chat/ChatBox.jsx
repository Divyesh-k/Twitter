import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BsEmojiSmileFill } from "react-icons/bs";
import { format } from "timeago.js";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Link } from "react-router-dom";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const imageRef = useRef(null);
  const scroll = useRef();

  const addEmoji = (emoji) => {
    const emojiCode = String.fromCodePoint(
      ...emoji.unified.split("-").map((code) => `0x${code}`)
    );
    setNewMessage(newMessage + emojiCode);
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  // Fetching user data using useQuery
  const userId = chat?.members?.find((id) => id !== currentUser);
  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: userDataError,
  } = useQuery({
    queryKey: ["userData", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Error fetching user: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!userId, // Only run the query if userId is defined
  });

  // Fetch messages using useEffect (you can also convert this to useQuery if needed)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/message/getmessage/${chat._id}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    // send the message to db
    try {
      const response = await fetch(`/api/message/am`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    // send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  // Receiving message from the parent component
  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isUserDataLoading) return <div>Loading...</div>;
  if (userDataError) return <div>Error loading user data</div>;

  return (
    <>
      {chat ? (
        <>
          {/* Chat header */}
          <div className="border-b p-4 flex items-center justify-between">
            <Link
              to={`/profile/${userData?.username}`}
              className="flex items-center gap-4 flex-1 min-w-0"
            >
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img
                    src={userData.profileImg || "/avatar-placeholder.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-primary truncate">
                  {userData?.username}
                </p>
                <p className="text-xs text-green-500">
                  {userData?.online ? (
                    "Active now"
                  ) : (
                    <span className="text-red-500">Not active</span>
                  )}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                <PhoneIcon className="h-5 w-5" />
                <span className="sr-only">Call</span>
              </button>
              <button className="p-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
                <VideoIcon className="h-5 w-5" />
                <span className="sr-only">Video call</span>
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex flex-col gap-2 p-6 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={scroll}
                className={`flex flex-col gap-1 max-w-[70%] rounded-2xl p-3 ${
                  message.senderId === currentUser
                    ? "self-end bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-br-none"
                    : "self-start bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <span>{message.text}</span>
                <span className="text-xs self-end text-gray-600">
                  {format(new Date(message.createdAt), "p")}
                </span>
              </div>
            ))}
          </div>
          {/* Message input */}
          <div className="border-t p-4">
            <form className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => imageRef.current.click()}
                className="p-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="sr-only">Upload file</span>
              </button>
              {/* input or InputEmojiWithRef  */}
              <input
                id="message"
                placeholder="Type your message..."
                className="flex-1 bg-muted text-muted-foreground focus:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full py-2 px-4"
                autoComplete="off"
                value={newMessage}
                onChange={handleChange}
                // onChange={(e) => setNewMessage(e.target.value)}
              />
              {showEmoji && (
                <div
                  className="absolute z-50 bottom-20 right-96"
                  style={{ zIndex: 50 }}
                >
                  <Picker
                    data={data}
                    emojiSize={20}
                    emojiButtonSize={28}
                    maxFrequentRows={0}
                    onEmojiSelect={addEmoji}
                  />
                </div>
              )}
              <BsEmojiSmileFill
                className="fill-primary w-5 h-5 cursor-pointer"
                onClick={() => setShowEmoji(!showEmoji)}
              />
              <button
                type="submit"
                className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                onClick={handleSend}
              >
                <SendIcon className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </button>
              <input
                type="file"
                ref={imageRef}
                style={{ display: "none" }}
                // onChange={handleFileChange} // You'll need to implement this function
              />
            </form>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-muted-foreground">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </>
  );
};

export default ChatBox;

// import React, { useEffect, useRef, useState } from "react";
// import { BsEmojiSmileFill } from "react-icons/bs";
// // import InputEmojiWithRef from "react-input-emoji";
// import { format } from "timeago.js";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";

// // const dataImg = {
// //   profileImg: "/avatars/boy1.png",
// // };
// const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
//   const [userData, setUserData] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [showEmoji, setShowEmoji] = useState(false);
//   const imageRef = useRef(null);
//   const scroll = useRef();

//   console.log("getting the clicked chat in box : ", chat);

//   const addEmoji = (emoji) => {
//     const emojiCode = String.fromCodePoint(
//       ...emoji.unified.split("-").map((code) => `0x${code}`)
//     );
//     setNewMessage(newMessage + emojiCode);
//   };

//   const handleChange = (e) => {
//     setNewMessage(e.target.value);
//   };

//   // fetching data for headers
//   useEffect(() => {
//     const userId = chat?.members?.find((id) => id !== currentUser);
//     console.log("inside the use effect...");
//     console.log("User ID:", userId); // Add this line
//     console.log('Chat object:', chat); // Add this line
//     const getUserData = async () => {
//       try {
//         const response = await fetch(`/api/users/${userId}`);
//         if (!response.ok) {
//           throw new Error(`Error fetching user: ${response.status}`);
//         }
//         const userData = await response.json();
//         console.log("chat user data", userData);
//         setUserData(userData);
//       } catch (error) {
//         console.error("Error fetching user data: ", error);
//       }
//     };
//     if (chat !== null) getUserData();
//   }, [chat, currentUser]);

//   // fetch messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`/api/message/getmessage/${chat._id}`);
//         const data = await response.json();
//         setMessages(data);
//         // console.log("chat message here : ", data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (chat !== null) fetchMessages();
//   }, [chat]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim() === "") {
//       return;
//     }

//     const message = {
//       senderId: currentUser,
//       text: newMessage,
//       chatId: chat._id,
//     };

//     // send the message to db

//     try {
//       const response = await fetch(`/api/message/am`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(message),
//       });

//       const data = await response.json();

//       setMessages([...messages, data]);
//       setNewMessage("");
//     } catch (error) {
//       console.log(error);
//     }

//     // send message to socket server

//     const receiverId = chat.members.find((id) => id !== currentUser);
//     setSendMessage({ ...message, receiverId });
//   };

//   // receing from the parent  component
//   useEffect(() => {
//     if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
//       setMessages([...messages, receiveMessage]);
//     }
//   }, [receiveMessage]);

//   // Always scroll to last Message
//   useEffect(() => {
//     scroll.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   console.log("user data in the chat box of the selected user.", userData);

//   return (
//     <>
//       {chat ? (
//         <>
//           {/* Chat header */}
//           <div className="border-b p-4 flex items-center gap-4">
//             <div className="avatar">
//               <div className="w-8 h-8 rounded-full">
//                 <img
//                   src={userData.profileImg || "/avatar-placeholder.png"}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-medium text-primary truncate">
//                 {userData?.username}
//               </p>
//               <p className="text-sm text-muted-foreground">Active now</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
//                 <PhoneIcon className="h-5 w-5" />
//                 <span className="sr-only">Call</span>
//               </button>
//               <button className="p-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full">
//                 <VideoIcon className="h-5 w-5" />
//                 <span className="sr-only">Video call</span>
//               </button>
//             </div>
//           </div>
//           {/* Chat messages */}
//           <div className="flex flex-col gap-2 p-6 overflow-y-auto">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 ref={scroll}
//                 className={`flex flex-col gap-1 max-w-[70%] rounded-2xl p-3 ${
//                   message.senderId === currentUser
//                     ? "self-end bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-br-none"
//                     : "self-start bg-gray-200 text-gray-800 rounded-bl-none"
//                 }`}
//               >
//                 <span>{message.text}</span>
//                 <span className="text-xs self-end text-gray-600">
//                   {format(new Date(message.createdAt), "p")}
//                 </span>
//               </div>
//             ))}
//           </div>
//           {/* Message input */}
//           <div className="border-t p-4">
//             <form className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => imageRef.current.click()}
//                 className="p-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full"
//               >
//                 <PlusIcon className="h-5 w-5" />
//                 <span className="sr-only">Upload file</span>
//               </button>
//               {/* input or InputEmojiWithRef  */}
//               <input
//                 id="message"
//                 placeholder="Type your message..."
//                 className="flex-1 bg-muted text-muted-foreground focus:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full py-2 px-4"
//                 autoComplete="off"
//                 value={newMessage}
//                 onChange={handleChange}
//                 // onChange={(e) => setNewMessage(e.target.value)}
//               />
//               {showEmoji && (
//                 <div
//                   className="absolute z-50 bottom-20 right-96"
//                   style={{ zIndex: 50 }}
//                 >
//                   <Picker
//                     data={data}
//                     emojiSize={20}
//                     emojiButtonSize={28}
//                     maxFrequentRows={0}
//                     onEmojiSelect={addEmoji}
//                   />
//                 </div>
//               )}
//               <BsEmojiSmileFill
//                 className="fill-primary w-5 h-5 cursor-pointer"
//                 onClick={() => setShowEmoji(!showEmoji)}
//               />
//               <button
//                 type="submit"
//                 className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
//                 onClick={handleSend}
//               >
//                 <SendIcon className="h-5 w-5" />
//                 <span className="sr-only">Send</span>
//               </button>
//               <input
//                 type="file"
//                 ref={imageRef}
//                 style={{ display: "none" }}
//                 // onChange={handleFileChange} // You'll need to implement this function
//               />
//             </form>
//           </div>
//         </>
//       ) : (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-lg text-muted-foreground">
//             Select a chat to start messaging
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatBox;
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
