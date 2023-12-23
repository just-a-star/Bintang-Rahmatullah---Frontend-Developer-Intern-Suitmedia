import React from "react";
import "./Banner.scss";

const Banner = () => {
  const backgroundImage = "https://suitmedia.static-assets.id/storage/files/601/6.jpg";
  return (
    <div className="app__banner app__flex">
      <figure className="banner-image" style={{ backgroundImage: `url(${backgroundImage})` }}></figure>
      <div className="app__banner-content">
        <h1>Ideas</h1>
        <p>Where all our great things begin</p>
      </div>
    </div>
  );
};

export default Banner;
