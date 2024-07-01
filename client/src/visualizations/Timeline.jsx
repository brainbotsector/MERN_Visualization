import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker, Select } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../pages/Sidenav.css'; 
import '../pages/Topnav.css'; 
import Sidenav from '../pages/SideNav'; 
import Topnav from '../pages/TopNav'; 
import '../visualizations/Timeline.css'
const { Option } = Select;

const API_BASE_URL = 'http://localhost:5000/api/data';

const Timeline = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedtitle, setSelectedtitle] = useState('');
  const [titles, settitles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setData(response.data);
        // Extract unique titles from data
        const uniquetitles = [...new Set(response.data.map(item => item.title))];
        settitles(uniquetitles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handletitleChange = (value) => {
    setSelectedtitle(value);
    filterData(value);
  };

  const filterData = (title) => {
    if (title === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.title === title);
      setFilteredData(filtered);
    }
  };

  return (
    <div className="timeline-container">
      <Sidenav />
      <Topnav />
      <div className="timeline-content">
        <h2>Timeline of Published Dates</h2>
        <div className="timeline-filters">
          <Select
            placeholder="Select a title"
            style={{ width: 200 }}
            onChange={handletitleChange}
            value={selectedtitle}
          >
            <Option value="">All titles</Option>
            {titles.map(title => (
              <Option key={title} value={title}>{title}</Option>
            ))}
          </Select>
        </div>
        <div className="timeline-chart">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="published" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Timeline;