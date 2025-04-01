import React from "react";
import './NotFoundTwo.css'; // Ensure this file contains the CSS you provided

const NotFoundTwo = () => {
  return (
    <div className="wrapper">
      <div className="container" data-text="404">
        <div className="title glitch" data-text="404">
          404
        </div>
        <div className="description glitch" data-text="PAGE NOT FOUND">
          PAGE NOT FOUND
        </div>
      </div>
    </div>
  );
};

export default NotFoundTwo;
