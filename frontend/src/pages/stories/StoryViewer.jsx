import React, { useEffect, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';

const StoryViewer = ({ stories, initialStoryIndex, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentStoryIndex];
  const currentMedia = currentStory.mediaUrl[currentMediaIndex];
  const user = currentStory.user;

  const mediaCount = currentStory.mediaUrl.length;
  

  useEffect(() => {
    const segmentDuration = 5000; // 5 seconds per segment (media item)
    const updateInterval = 100; // 100ms interval for smooth progress

    const progressIncrement = 100 / (segmentDuration / updateInterval); // Calculate increment per update

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          handleNext(); // Move to next media when progress reaches 100%
          return 0;
        }
        return prevProgress + progressIncrement;
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [currentMediaIndex, currentStoryIndex]);

  const handleNext = () => {
    if (currentMediaIndex < mediaCount - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentMediaIndex(0);
    } else {
      onClose(); // Close the viewer if it's the last story
    }
    setProgress(0);
  };

  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentMediaIndex(stories[currentStoryIndex - 1].mediaUrl.length - 1);
    }
    setProgress(0);
  };

  const handleMediaError = (error) => {
    console.error("Error loading media:", error);
  };

  const renderMedia = () => {
    const mediaExtension = currentMedia.split('.').pop();

    if (['jpg', 'jpeg', 'png'].includes(mediaExtension)) {
      return <img src={currentMedia} alt="Story" className="w-full h-full" onError={handleMediaError} />;
    } else if (mediaExtension === 'mp4') {
      return (
        <video
          src={currentMedia}
          className="w-full h-full"
          autoPlay
          muted
          onEnded={handleNext}
          onError={handleMediaError}
          controls={false}
        />
      );
    } else {
      return <p className="text-white">Unsupported media type</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative w-full max-w-sm h-[80vh] bg-gray-800">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 flex gap-[2px]">
          {Array.from({ length: mediaCount }).map((_, index) => (
            <div key={index} className="h-full bg-gray-600 flex-1">
              {index === currentMediaIndex && (
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  style={{ height: '100%' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Profile image and username */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <img
            src={user.profileImg || "/avatar-placeholder.png"}
            alt={`${user.username}'s profile`}
            className="w-10 h-10 rounded-full"
          />
          <span className="text-white text-sm font-semibold">
            {user.username}
          </span>
        </div>

        {/* Render media (image or video) */}
        {renderMedia()}

        {/* Click areas for navigation */}
        <div className="absolute inset-y-0 left-0 w-1/2" onClick={handlePrevious}></div>
        <div className="absolute inset-y-0 right-0 w-1/2" onClick={handleNext}></div>

        {/* Close button */}
        <button className="absolute top-4 right-4 text-white" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;














// import React, { useEffect, useState } from "react";

// const StoryViewer = ({ stories, initialStoryIndex, onClose }) => {
//   const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
//   const [segmentProgress, setSegmentProgress] = useState(0);
//   const [segmentWidth, setSegmentWidth] = useState(100); // Width percentage of each segment

//   const currentStory = stories[currentStoryIndex];
//   const currentMedia = currentStory.mediaUrl[currentMediaIndex];
//   const user = currentStory.user;

//   // Determine number of media items
//   const mediaCount = currentStory.mediaUrl.length;

//   useEffect(() => {
//     // Calculate the segment width for the progress bar
//     setSegmentWidth(100 / mediaCount);

//     const segmentDuration = 5; // Duration for each media segment in seconds
//     const updateInterval = 100; // Interval duration in milliseconds
//     const totalUpdates = (segmentDuration * 1000) / updateInterval; // Total number of updates needed

//     const progressIncrement = segmentWidth / totalUpdates; // Increment per update for the current segment

//     const timer = setInterval(() => {
//       setSegmentProgress((prev) => {
//         if (prev >= segmentWidth) {
//           handleNext(); // Automatically move to the next media when progress reaches the segment width
//           return 0;
//         }
//         return prev + progressIncrement; // Increase progress
//       });
//     }, updateInterval);

//     return () => clearInterval(timer); // Clean up the interval when the component unmounts
//   }, [currentMediaIndex, currentStoryIndex, mediaCount, segmentWidth]);

//   const handleNext = () => {
//     if (currentMediaIndex < currentStory.mediaUrl.length - 1) {
//       setCurrentMediaIndex(currentMediaIndex + 1);
//     } else if (currentStoryIndex < stories.length - 1) {
//       setCurrentStoryIndex(currentStoryIndex + 1);
//       setCurrentMediaIndex(0);
//     } else {
//       onClose(); // Close the viewer if it's the last story
//     }
//     setSegmentProgress(0); // Reset progress
//   };

//   const handlePrevious = () => {
//     if (currentMediaIndex > 0) {
//       setCurrentMediaIndex(currentMediaIndex - 1);
//     } else if (currentStoryIndex > 0) {
//       setCurrentStoryIndex(currentStoryIndex - 1);
//       setCurrentMediaIndex(stories[currentStoryIndex - 1].mediaUrl.length - 1);
//     }
//     setSegmentProgress(0); // Reset progress
//   };

//   // Basic error handling for media loading
//   const handleMediaError = (error) => {
//     console.error("Error loading media:", error);
//   };

//   const renderMedia = () => {
//     const mediaExtension = currentMedia.split(".").pop(); // Detect file extension

//     if (
//       mediaExtension === "jpg" ||
//       mediaExtension === "jpeg" ||
//       mediaExtension === "png"
//     ) {
//       return (
//         <img
//           src={currentMedia}
//           alt="Story"
//           className="w-full h-full "
//           onError={handleMediaError}
//         />
//       );
//     } else if (mediaExtension === "mp4") {
//       return (
//         <video
//           src={currentMedia}
//           className="w-full h-full"
//           autoPlay
//           muted
//           onEnded={handleNext}
//           onError={handleMediaError}
//           controls={false}
//         />
//       );
//     } else {
//       return <p className="text-white">Unsupported media type</p>;
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
//       <div className="relative w-full max-w-sm h-[80vh] bg-gray-800">
//         {/* Progress bar */}
//         <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 flex gap-[2px]">
//           {/* Adjust the gap value here */}
//           {Array.from({ length: mediaCount }).map((_, index) => (
//             <div
//               key={index}
//               className="h-full bg-gray-600 flex-1" // Use flex-1 for equal segment widths
//             >
//               {index === currentMediaIndex && (
//                 <div
//                   className="h-full bg-white"
//                   style={{
//                     width: `${segmentProgress}%`,
//                     transition: "width 0.1s ease-out",
//                   }}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Profile image and username */}
//         <div className="absolute top-4 left-4 flex items-center space-x-2">
//           <img
//             src={user.profileImg || "/avatar-placeholder.png"} // Fallback if no profile image
//             alt={`${user.username}'s profile`}
//             className="w-10 h-10 rounded-full"
//           />
//           <span className="text-white text-sm font-semibold">
//             {user.username}
//           </span>
//         </div>

//         {/* Render media (image or video) */}
//         {renderMedia()}

//         {/* Click areas for navigation */}
//         <div
//           className="absolute inset-y-0 left-0 w-1/2"
//           onClick={handlePrevious}
//         ></div>
//         <div
//           className="absolute inset-y-0 right-0 w-1/2"
//           onClick={handleNext}
//         ></div>

//         {/* Close button */}
//         <button className="absolute top-4 right-4 text-white" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StoryViewer;

