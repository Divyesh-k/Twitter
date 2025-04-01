import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import Post from "./Post";
import { FaArrowLeft } from "react-icons/fa6";

const SinglePostPage = () => {
  const location = useLocation();
  const { post } = location.state || {}; // Destructure the post object from the state
//   console.log(post);
  const navigate = useNavigate();

  if (!post) {
    return <div>Post not found</div>; // Handle cases where post data is not available
  }

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        {/* Header section */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)}>
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <p className="font-bold ml-2">Single Saved Post</p>
          </div>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>abc</a>
              </li>
            </ul>
          </div>
        </div>
        <Post key={post._id} post={post} />
      </div>
    </>
  );
};

export default SinglePostPage;
