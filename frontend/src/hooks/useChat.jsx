import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useChat = (authUserId, visitedUserId) => {
  const queryClient = useQueryClient();
  const [openChat, setOpenChat] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Function to check if a chat already exists
  useEffect(() => {
    const fetchChat = async () => {
      try {
        setIsPending(true);
        const response = await fetch(`/api/chat/find/${authUserId}/${visitedUserId}`);
        const data = await response.json();

        if (response.ok && data) {
          setOpenChat(true);
        } else {
          setOpenChat(false);
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally {
        setIsPending(false);
      }
    };

    if (authUserId && visitedUserId) {
      fetchChat();
    }
  }, [authUserId, visitedUserId]);

  // Mutation to create a new chat
  const { mutate: createChat } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch("/api/chat/cc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: authUserId,
            receiverId: visitedUserId,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to create chat");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      setOpenChat(true);
      toast.success("Chat started successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createChat, isPending, openChat };
};

export default useChat;
