import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChart from '../visualizations/BarChart';
import PieChart from '../visualizations/PieChart';
import ScatterPlot from '../visualizations/ScatterPlot';
import TopNav from './TopNav';
import SideNav from './SideNav';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [scatterPlotData, setScatterPlotData] = useState([]);
  const [endYears, setEndYears] = useState([]);
  const [selectedEndYear, setSelectedEndYear] = useState('');
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  // const [pestle, setpestle] = useState([]);
  // const [selectedpestle, setSelectedPestle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/data/')
      .then(response => {
        const fetchedData = response.data;
        setData(fetchedData);

        const uniqueEndYears = [...new Set(fetchedData.map(d => d.end_year))].sort();
        setEndYears(uniqueEndYears);

        const uniqueSectors = [...new Set(fetchedData.map(d => d.sector))].sort();
        setSectors(uniqueSectors);

        const uniqueRegions = [...new Set(fetchedData.map(d => d.region))].sort();
        setRegions(uniqueRegions);

        const uniqueTopics = [...new Set(fetchedData.map(d => d.topic))].sort();
        setTopics(uniqueTopics);

       

      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const filteredBarChartData = data.filter(d => !selectedEndYear || d.end_year === selectedEndYear);
    setBarChartData(filteredBarChartData);
  }, [selectedEndYear, data]);

  useEffect(() => {
    const filteredPieChartData = data.filter(d => !selectedSector || d.sector === selectedSector);
    setPieChartData(filteredPieChartData);
  }, [selectedSector, data]);

  useEffect(() => {
    const filteredScatterPlotData = data.filter(d => 
      (!selectedRegion || d.region === selectedRegion) && 
      (!selectedTopic || d.topic === selectedTopic)
    );
    setScatterPlotData(filteredScatterPlotData);
  }, [selectedRegion, selectedTopic, data]);



  const handleEndYearChange = (e) => setSelectedEndYear(e.target.value);
  const handleSectorChange = (e) => setSelectedSector(e.target.value);
  const handleRegionChange = (e) => setSelectedRegion(e.target.value);
  const handleTopicChange = (e) => setSelectedTopic(e.target.value);

  return (
    <div className="dashboard">
      <TopNav />
      <SideNav />
      <div className="main-content">
        <div className="filters">
          <div className="filter-container">
            <label>End Year:</label>
            <select value={selectedEndYear} onChange={handleEndYearChange}>
              <option value="">All Years</option>
              {endYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="filter-container">
            <label>Sector:</label>
            <select value={selectedSector} onChange={handleSectorChange}>
              <option value="">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          <div className="filter-container">
            <label>Region:</label>
            <select value={selectedRegion} onChange={handleRegionChange}>
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="filter-container">
            <label>Topic:</label>
            <select value={selectedTopic} onChange={handleTopicChange}>
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="visualizations">
          <div className="">
            <h3>Bar Chart</h3>
            <BarChart data={barChartData} />
          </div>
          <div>
            <h3>Pie Chart</h3>
            <PieChart data={pieChartData} />
          </div>
          <div>
            <h3>Scatter Plot</h3>
            <ScatterPlot data={scatterPlotData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
