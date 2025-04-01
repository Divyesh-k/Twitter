import React, { useEffect, useState } from "react";

const MessagePage = ({ data, currentUserId, onClick, active }) => {
  const [userData, setUserdata] = useState(null);
  const online = userData?.online ?? false;
  

  useEffect(() => {
    const userId = data?.members?.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching user: ${response.status}`);
        }
        const userData = await response.json();
        setUserdata(userData);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    getUserData();
  }, [data,currentUserId]);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-2 cursor-pointer rounded-lg ${
        active ? "bg-stone-700 text-white" : "hover:bg-purple-800 duration-300"
      }`}
    >
      <div className="avatar relative">
        <div className="w-8 h-8 rounded-full">
          <img
            src={userData?.profileImg || "/avatar-placeholder.png"}
            alt={userData?.username}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        {online && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${active ? "text-white" : "text-lime-700"}`}>
          {userData?.username}
        </p>
        <p className={`text-xs truncate ${active ? "text-gray-300" : "text-gray-500"}`}>
          {online ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default MessagePage;