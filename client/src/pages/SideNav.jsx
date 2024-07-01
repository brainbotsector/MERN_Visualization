import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidenav.css';

const SideNav = () => {
  const [isChartsSubNavOpen, setIsChartsSubNavOpen] = useState(false);
  const [isareaSubNavOpen, setIsareaSubNavOpen] = useState(false);
  const [isbulletsubNavOpen, setIsbulletSubNavOpen] = useState(false);
  const [isganttsubNavOpen, setIsganttSubNavOpen] = useState(false);
  const [iszigsubNavOpen, setIszigSubNavOpen] = useState(false);
  const [istimesubNavOpen, setIstimeSubNavOpen] = useState(false);
  const [isstackedsubNavOpen, setIsstackedSubNavOpen] = useState(false);
  const [ispieSubNavOpen, setIspieSubNavOpen] = useState(false);

  const handleChartsClick = () => {
    setIsChartsSubNavOpen(!isChartsSubNavOpen);
    setIsareaSubNavOpen(false); 
    setIsbulletSubNavOpen(false);
    setIsganttSubNavOpen(false);
    setIszigSubNavOpen(false);
    setIstimeSubNavOpen(false);
    setIsstackedSubNavOpen(false);
    setIspieSubNavOpen(false);
  };

  const handleareaMapClick = () => {
    setIsareaSubNavOpen(!isareaSubNavOpen);
    setIsChartsSubNavOpen(false); 
    setIsbulletSubNavOpen(false);
    setIsganttSubNavOpen(false);
    setIszigSubNavOpen(false);
    setIstimeSubNavOpen(false);
    setIsstackedSubNavOpen(false);
    setIspieSubNavOpen(false);
  };

  const handleBulletClick = () => {
    setIsbulletSubNavOpen(!isbulletsubNavOpen);
    setIsChartsSubNavOpen(false); 
    setIsareaSubNavOpen(false);
    setIsganttSubNavOpen(false);
    setIszigSubNavOpen(false);
    setIstimeSubNavOpen(false);
    setIsstackedSubNavOpen(false);
    setIspieSubNavOpen(false);
  };
  
  const handleGanttClick = () => {
    setIsganttSubNavOpen(!isganttsubNavOpen);
    setIsChartsSubNavOpen(false); 
    setIsareaSubNavOpen(false);
    setIsbulletSubNavOpen(false);
    setIszigSubNavOpen(false);
    setIstimeSubNavOpen(false);
    setIsstackedSubNavOpen(false);
    setIspieSubNavOpen(false);
  };

  const handleZigClick = () => {
    setIszigSubNavOpen(!iszigsubNavOpen);
    setIsareaSubNavOpen(false); 
    setIsbulletSubNavOpen(false);
    setIsganttSubNavOpen(false);
    setIsChartsSubNavOpen(false);
    setIstimeSubNavOpen(false);
    setIsstackedSubNavOpen(false);
    setIspieSubNavOpen(false);
  };

  const handletimeClick = () => {
    setIstimeSubNavOpen(!istimesubNavOpen);
    setIsareaSubNavOpen(false); 
    setIsbulletSubNavOpen(false);
    setIsganttSubNavOpen(false);
    setIsChartsSubNavOpen(false);
    setIszigSubNavOpen(false);
    setIsstackedSubNavOpen(false);
    setIspieSubNavOpen(false);
  };

  const handlestackedClick = () => {
    setIsstackedSubNavOpen(!isstackedsubNavOpen);
    setIsareaSubNavOpen(false); 
    setIsbulletSubNavOpen(false);
    setIsganttSubNavOpen(false);
    setIsChartsSubNavOpen(false);
    setIszigSubNavOpen(false);
    setIstimeSubNavOpen(false);
    setIspieSubNavOpen(false);
  };


  const handlepieClick = () => {
    setIspieSubNavOpen(!ispieSubNavOpen);
    setIsareaSubNavOpen(false); 
    setIsbulletSubNavOpen(false);
    setIsganttSubNavOpen(false);
    setIszigSubNavOpen(false);
    setIstimeSubNavOpen(false);
    setIsstackedSubNavOpen(false);
  };

  return (
    <div className="sidenav">
      <h2>Dashboard</h2>
      <ul>
        <li><a href="#/overview">Overview</a></li>
        <li>
          <a href="#/visualizations">Visualizations</a>
          <ul className="subnav">
            <li><Link to="/areasector" onClick={handleareaMapClick}>•  Area By Sector</Link></li>
            <li><Link to="/bulletgraph" onClick={handleBulletClick}>• Bullet Graph</Link></li>
            <li><Link to="/ganttchart" onClick={handleGanttClick}>• Gantt Chart</Link></li>
            <li><Link to="/zigzag" onClick={handleZigClick}>• Zig Zag Chart</Link></li>
            <li><Link to="/timegrid" onClick={handletimeClick}>• Timeline</Link></li>
            <li><Link to="/stackedchart" onClick={handlestackedClick}>• Stacked Bar Chart</Link></li>
            <li><Link to="/piechart" onClick={handlepieClick}>• Pie Chart</Link></li>
            <li><Link to="/heatmap">• Heatmap</Link></li>
          </ul>
        </li>
        <li><a href="#/settings">Settings</a></li>
      </ul>
    </div>
  );
};

export default SideNav;
