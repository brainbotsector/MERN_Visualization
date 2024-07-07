import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Dashboard from "./pages/Dashboard";
import Heatmap from './visualizations/Heatmap';
import AreaSector from './visualizations/AreaSector'; 
import BulletGraph from './visualizations/BulletGraph'; 
import GanttChart from './visualizations/GanttChart'; 
import ZigZagLine from './visualizations/ZigZagLine'; 
import Timeline from './visualizations/Timeline'
import Stackedbar from  './visualizations/Stackedbar'
import ChartStyling from './visualizations/ChartStyling'
import  SideNav from "./pages/SideNav";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sidenav" element={<SideNav />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/areasector" element={<AreaSector />} />
        <Route path="/bulletgraph" element={<BulletGraph />} />
        <Route path="/ganttchart" element={<GanttChart />} />
        <Route path="/zigzag" element={<ZigZagLine/>} />
        <Route path="/timegrid" element={<Timeline/>} />
        <Route path="/stackedchart" element={<Stackedbar/>} />
        <Route path="/chart" element={<ChartStyling/>} />
      </Routes>
    </Router>
  );
};

export default App;

