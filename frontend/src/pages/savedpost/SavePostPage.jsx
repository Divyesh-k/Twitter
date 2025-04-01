import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import Avatar from "@mui/material/Avatar";
import { FaRegHeart, FaRegBookmark } from "react-icons/fa";
import { styled } from "@mui/material/styles";
import { IoSettingsOutline } from "react-icons/io5";
import SavePostSkeleton from "../../components/skeletons/SavedPostSkeleton";
import { Link, useNavigate } from "react-router-dom";

// const OverlayTop = styled("div")(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   color: "#fff",
//   padding: "10px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-start",
//   opacity: 0,
//   transition: "opacity 0.3s ease",
//   borderTopLeftRadius: 4,
//   borderTopRightRadius: 4,
// }));

const OverlayBottom = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  opacity: 0,
  transition: "opacity 0.3s ease",
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
}));

const ImageContainer = styled("div")({
  position: "relative",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and shadow
  "&:hover": {
    transform: "scale(1.05)", // Slightly scale up the image
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)", // Add a shadow effect
  },
  "&:hover .overlay": {
    opacity: 1,
  },
});

const SavePostPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Fetch saved posts
  const { data: savedPosts = [], isLoading } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const response = await fetch("/api/posts/getsavedpost");
      if (!response.ok) throw new Error("Failed to fetch saved posts");
      return response.json();
    },
    staleTime: 60000, // Data stays fresh for 1 minute
    cacheTime: 300000, // Cache is kept for 5 minutes (default)
  });

  const handleImageClick = (post) => {
    // Navigate to the SinglePostPage with the username, postId, and full post data
    navigate(`/post/${post.user.username}/${post._id}`, { state: { post } });
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      {/* Header section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Saved Posts</p>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="m-1">
            <IoSettingsOutline className="w-4" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Delete all saved posts</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Masonry layout section */}
      <Box sx={{ width: "100%", minHeight: "100vh", padding: "20px" }}>
        {isLoading ? (
          <SavePostSkeleton /> // Render the skeleton while loading
        ) : (
          <Masonry columns={4} spacing={2}>
            {savedPosts.map((post) => (
              <ImageContainer key={post._id}>
                <img
                  src={post.img}
                  alt={post.text || "Saved Post"}
                  loading="lazy"
                  style={{
                    display: "block",
                    width: "100%",
                    borderRadius: 4,
                  }}
                  onClick={() => handleImageClick(post)} // Pass the entire post object
                />
                {/* <OverlayTop className="overlay">
                  <Avatar
                    src={post.user.profileImg || "/avatar-placeholder.png"}
                    alt={post.user.username}
                    sx={{ width: 24, height: 24, marginRight: 1 }}
                  />
                  <span>{post.user.username}</span>
                </OverlayTop> */}
                <OverlayBottom
                  className="overlay"
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Link
                    to={`/profile/${post.user.username}`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      src={post.user.profileImg || "/avatar-placeholder.png"}
                      alt={post.user.username}
                      sx={{ width: 24, height: 24, marginRight: 1 }} // Adjust margin as needed
                    />
                    <span>{post.user.username}</span>
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                  >
                    <FaRegHeart
                      style={{
                        color: "red",
                        marginRight: 8,
                        cursor: "pointer",
                      }}
                    />
                    <span>{post.likes.length}</span>
                  </div>
                  {/* <FaRegBookmark className="w-4 h-4 text-white cursor-pointer" /> */}
                </OverlayBottom>
              </ImageContainer>
            ))}
          </Masonry>
        )}
      </Box>
    </div>
  );
};

export default SavePostPage;

//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------

// import React from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import Box from "@mui/material/Box";
// import Masonry from "@mui/lab/Masonry";
// import Avatar from "@mui/material/Avatar";
// import { FaRegHeart, FaRegBookmark } from "react-icons/fa";
// import { styled } from "@mui/material/styles";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import { toast } from "react-hot-toast";
// import { IoSettingsOutline } from "react-icons/io5";

// const OverlayTop = styled("div")(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   color: "#fff",
//   padding: "10px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-start",
//   opacity: 0,
//   transition: "opacity 0.3s ease",
//   borderTopLeftRadius: 4,
//   borderTopRightRadius: 4,
// }));

// const OverlayBottom = styled("div")(({ theme }) => ({
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   right: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   color: "#fff",
//   padding: "10px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   opacity: 0,
//   transition: "opacity 0.3s ease",
//   borderBottomLeftRadius: 4,
//   borderBottomRightRadius: 4,
// }));

// const ImageContainer = styled("div")({
//   position: "relative",
//   cursor: "pointer",
//   "&:hover .overlay": {
//     opacity: 1,
//   },
// });

// const SavePostPage = () => {
//   const queryClient = useQueryClient();

//   // Fetch saved posts
//   const { data: savedPosts = [], isLoading } = useQuery({
//     queryKey: ["savedPosts"],
//     queryFn: async () => {
//       const response = await fetch("/api/posts/getsavedpost");
//       if (!response.ok) throw new Error("Failed to fetch saved posts");
//       return response.json();
//     },
//   });

//   // // Like post mutation
//   // const { mutate: likedPost, isLoading: isLiking } = useMutation({
//   //   mutationFn: async (postId) => {
//   //     try {
//   //       const response = await fetch(`/api/posts/like/${postId}`, {
//   //         method: "POST",
//   //       });
//   //       const data = await response.json();
//   //       if (!response.ok) {
//   //         throw new Error(data.error || "Failed to like post");
//   //       }
//   //       return data;
//   //     } catch (error) {
//   //       throw new Error(error);
//   //     }
//   //   },
//   //   onMutate: async (postId) => {
//   //     await queryClient.cancelQueries(["savedPosts"]);

//   //     const previousPosts = queryClient.getQueryData(["savedPosts"]);

//   //     // Optimistic update
//   //     queryClient.setQueryData(["savedPosts"], (oldPosts) =>
//   //       oldPosts.map((post) =>
//   //         post._id === postId
//   //           ? { ...post, likes: [...post.likes, { userId: 'temporary' }] }
//   //           : post
//   //       )
//   //     );

//   //     return { previousPosts };
//   //   },
//   //   onError: (error, postId, context) => {
//   //     queryClient.setQueryData(["savedPosts"], context.previousPosts);
//   //     toast.error(error.message);
//   //   },
//   //   onSuccess: (updatedPost) => {
//   //     queryClient.setQueryData(["savedPosts"], (oldPosts) =>
//   //       oldPosts.map((post) =>
//   //         post._id === updatedPost._id
//   //           ? { ...post, likes: updatedPost.likes }
//   //           : post
//   //       )
//   //     );
//   //     toast.success("Post Liked Successfully");
//   //   },
//   // });

//   // const handleLikePost = (postId) => {
//   //   if (isLiking) return;
//   //   likedPost(postId);
//   // };

//   // if (isLoading) {
//   //   return (
//   //     <div className="h-screen flex justify-center items-center">
//   //       <LoadingSpinner size="lg" />
//   //     </div>
//   //   );
//   // }

//     return (
//       <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
//         {/* Header section */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-700">
//           <p className="font-bold">Saved Posts</p>
//           <div className="dropdown">
//             <div tabIndex={0} role="button" className="m-1">
//               <IoSettingsOutline className="w-4" />
//             </div>
//             <ul
//               tabIndex={0}
//               className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
//             >
//               <li>
//                 <a>Delete all saved posts</a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Masonry layout section */}
//         <Box sx={{ width: "100%", minHeight: "100vh", padding: "20px" }}>
//           <Masonry columns={4} spacing={2}>
//             {savedPosts.map((post) => (
//               <ImageContainer key={post._id}>
//                 <img
//                   src={post.img}
//                   alt={post.text || "Saved Post"}
//                   loading="lazy"
//                   style={{
//                     display: "block",
//                     width: "100%",
//                     borderRadius: 4,
//                   }}
//                 />
//                 <OverlayTop className="overlay">
//                   <Avatar
//                     src={post.user.profileImg || "/avatar-placeholder.png"}
//                     alt={post.user.username}
//                     sx={{ width: 24, height: 24, marginRight: 1 }}
//                   />
//                   <span>{post.user.username}</span>
//                 </OverlayTop>
//                 <OverlayBottom className="overlay">
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <FaRegHeart
//                       style={{ color: "red", marginRight: 8, cursor: "pointer" }}
//                     />
//                     <span>{post.likes.length}</span>
//                   </div>
//                   <FaRegBookmark className="w-4 h-4 text-white cursor-pointer" />
//                 </OverlayBottom>
//               </ImageContainer>
//             ))}
//           </Masonry>
//         </Box>
//       </div>
//     );
// };

// export default SavePostPage;
