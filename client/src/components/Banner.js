import React from "react";
import { useNavigate } from "react-router-dom";
import '../assets/css/home.css';
import backgroundImage from '../assets/images/background.png';

export default function Banner() {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <div className="bg-hero" style={backgroundStyle}>
      <div>
        <div className="text-center">
          <h1 className="h1">
          <span className="text-primary">Inspire</span>Hub
          </h1>
          <p className="p pt-2">Where Ideas Blossom and Stories Thrive</p>
        </div>
      </div>
    </div>
  );
}
