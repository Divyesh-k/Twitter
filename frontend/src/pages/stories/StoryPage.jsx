import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef } from "react";
import { IoSettingsOutline, IoAddCircle } from "react-icons/io5";
import StoryViewer from "./StoryViewer";

const StoryPage = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  // console.log(authUser);
  const [media, setMedia] = useState(null); // Store media file
  const imgRef = useRef(null); // For selecting the file

  const [viewingStories, setViewingStories] = useState(null);

 // Modify the click handler to accept both story type and index
const handleStoryClick = (storyIndex, storyType) => {
  if (storyType === "us") {
    setViewingStories({ stories: [userStories], initialStoryIndex: storyIndex });
  } else if (storyType === "os") {
    setViewingStories({ stories: otherStories, initialStoryIndex: storyIndex });
  }
};

  // Fetch user stories
  const { data: userStories, isLoading: loadingUserStories } = useQuery({
    queryKey: ["userStories"],
    queryFn: async () => {
      const response = await fetch("/api/story/getuserstories");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch user stories");
      return data;
    },
    staleTime: 60000, // 1 minute stale time
    cacheTime: 300000, // 5 minutes cache time
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
  // console.log(userStories)

  const { data: otherStories, isLoading: loadingOtherStories } = useQuery({
    queryKey: ["otherStories"],
    queryFn: async () => {
      const response = await fetch("/api/story/getallstories");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch other stories");
      return data; // The API already returns the correct structure
    },
    staleTime: 60000, // 1 minute stale time
    cacheTime: 300000, // 5 minutes cache time
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
  // console.log(otherStories)

  // Create a story mutation
  const {
    mutate: createStory,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (media) => {
      try {
        const response = await fetch("/api/story/cs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ media }), // Send media as JSON string
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to upload story");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      setMedia(null); // Clear the selected media after upload
      queryClient.invalidateQueries(["userStories"]); // Refetch user stories
    },
    staleTime: 60000, // 1 minute stale time
    cacheTime: 300000, // 5 minutes cache time
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });

  // Handle media file selection
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia(reader.result); // This will have the correct base64 prefix
      };
      reader.readAsDataURL(file); // Ensures data URL format
    }
  };

  // Handle story upload submission
  const handleStorySubmit = (e) => {
    e.preventDefault();
    if (media) {
      createStory(media); // Call mutation with selected media
      document.getElementById("story_upload_modal").close(); // Close the modal after submission
    }
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      {/* Header section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Story Page</p>
        <IoSettingsOutline size={24} />
      </div>

      {/* User and other users' stories */}
      <div className="flex justify-start items-center h-28 p-4 border-b border-gray-700 space-x-4">
        {/* User story */}
        <div className="relative">
          <img
            // src={
            //   userStories && userStories.length > 0
            //     ? userStories[0]
            //     : "default_profile_image_url"
            // }
            src={authUser.profileImg}
            alt="User Story"
            className="w-16 h-16 rounded-full border-2 border-gray-700"
            onClick={() => handleStoryClick(0,"us")} // Pass the index to the click handler
          />
          {!userStories?.length && (
            <IoAddCircle
              size={24}
              className="absolute bottom-0 right-0 text-blue-500 cursor-pointer"
              onClick={() =>
                document.getElementById("story_upload_modal").showModal()
              }
            />
          )}
        </div>
         {/* Rendering the other users' stories */}
        {otherStories?.map((story, index) => (
          <div key={story._id} className="relative">
            <img
              src={story.user.profileImg || "/avatar-placeholder.png"}
              alt="Other User Story"
              className="w-16 h-16 rounded-full border-2 border-gray-700 cursor-pointer"
              onClick={() => handleStoryClick(index,"os")} // Pass the index to the click handler
            />
          </div>
        ))}
      </div>

      {/* Upload Story Dialog */}
      <dialog
        id="story_upload_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Upload Your Story</h3>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleImgChange}
            ref={imgRef}
          />
          {media && <p className="mt-2">Media selected for upload</p>}
          <div className="modal-action">
            <button className="btn" onClick={handleStorySubmit}>
              {isPending ? "Uploading..." : "Upload"}
            </button>
            <button
              className="btn"
              onClick={() => {
                setMedia(null);
                document.getElementById("story_upload_modal").close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
      {viewingStories && (
        <StoryViewer
          stories={viewingStories.stories}
          initialStoryIndex={viewingStories.initialStoryIndex}
          onClose={() => setViewingStories(null)}
        />
      )}
    </div>
  );
};

export default StoryPage;

// import React from "react";
// import { IoSettingsOutline } from "react-icons/io5";

// const StoryPage = () => {
//   return (
//     <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
//       {/* Header section */}
//       <div className="flex justify-between items-center p-4 border-b border-gray-700">
//         <p className="font-bold">Story Page</p>
//       </div>

//       <div className="flex justify-between items-center h-28 p-4 border-b border-gray-700">
//         {/* stories will be here first will be user  then the other users stories to be displayed  */}
//       </div>
//       <div>{/* on click of the stories stories will be displays here */}</div>
//     </div>
//   );
// };

// export default StoryPage;
