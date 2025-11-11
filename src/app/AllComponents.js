"use client"

import React, { useState } from 'react';
import Navbar from '../(Components)/Navbar';
import CardSlider from './(pages)/_Home/TodayNews';
import Features from './(pages)/_Home/Features';
import { CardDemo } from './(auth)/signup/_logindialogue/LoginDialogue';

const AllComponents = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="relative ">
      <Navbar showLogin={showLogin} />
      <CardSlider />
      <Features showLogin={showLogin} setShowLogin={setShowLogin} />
      
      {showLogin && (
        <div className="fixed z-99 flex items-center justify-center bg-black/40">
          <CardDemo onClose={() => setShowLogin(false)} />
        </div>
      )}
    </div>
  );
};

export default AllComponents;
