import React from 'react';
import './Topnav.css';

const TopNav = () => {
  return (
    <div className="topnav">
      <div className="search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="user-profile">
      </div>
    </div>
  );
};

export default TopNav;
