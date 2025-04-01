import React from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

const SavePostSkeleton = () => {
    const skeletonItems = Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className={`skeleton w-full rounded-lg mb-4 ${
            index % 2 === 0 ? "h-40" : index % 3 === 0 ? "h-32" : "h-48"
          }`}
        ></div>
      ));
    
      return (
        <div className="p-4">
          <div className="columns-2 md:columns-4 gap-4">{skeletonItems}</div>
        </div>
      );
    };
    

export default SavePostSkeleton;
