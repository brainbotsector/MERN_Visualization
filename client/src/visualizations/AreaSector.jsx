import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../pages/Sidenav.css'; 
import '../pages/Topnav.css'; 
import Sidenav from '../pages/SideNav'; 
import Topnav from '../pages/TopNav'; 
import "../visualizations/AreaSector.css"

const API_BASE_URL = 'http://localhost:5000/api/data'; 
const AreaChartBySector = () => {
  const [data, setData] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setData(response.data);
      const uniqueSectors = [...new Set(response.data.map((d) => d.sector))].sort();
      setSectors(uniqueSectors);
      setFilteredData(response.data); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSectorChange = (e) => {
    const sector = e.target.value;
    setSelectedSector(sector);
    const filtered = sector ? data.filter((item) => item.sector === sector) : data;
    setFilteredData(filtered);
  };

  const renderTooltipContent = (data) => {
    if (!data.payload || data.payload.length === 0) {
      return null;
    }
    const payload = data.payload[0]; 
    return (
      <div className="custom-tooltip">
        <p>{`Intensity: ${payload.value}`}</p>
      </div>
    );
  };

  return (
    <div className="area-chart-container">
      <Topnav />
      <Sidenav />
      <div className="main-content">
        <div className="filters">
          
          
          <select value={selectedSector} onChange={handleSectorChange}>
            <option value="">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div className="chart">
          <ResponsiveContainer width="100%" height={600}>
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="end_year" />
              <YAxis />
              <Tooltip content={renderTooltipContent} />
              {sectors.map((sector, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey="intensity"
                  stackId={sector}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AreaChartBySector;


