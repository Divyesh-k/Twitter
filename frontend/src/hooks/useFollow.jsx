import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await fetch(`/api/users/follow/${userId}`, {
          method: "POST",
        });
        const data = await response.json();
        // console.log(data)
        if (!response.ok) {
          throw new Error(data.error || "Failed to follow user");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ querykey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ querykey: ["authUser"] }),
      ]);
      toast.success("User followed successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { follow, isPending };
};

export default useFollow;
