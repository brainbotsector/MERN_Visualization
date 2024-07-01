import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './BulletGraph.css';
import "../pages/Sidenav.css"; // Corrected path
import "../pages/Topnav.css";  // Corrected path
import Sidenav from "../pages/SideNav"; // Import Sidenav component
import Topnav from "../pages/TopNav";   // Import Topnav component

const API_BASE_URL = 'http://localhost:5000/api';

const BulletGraph = () => {
  const [data, setData] = useState([]);
  const [endYears, setEndYears] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedEndYear, setSelectedEndYear] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data`);
      const data = response.data;

      setData(data);

      // Extract unique end years and regions for filters
      const uniqueEndYears = [...new Set(data.map(d => d.end_year))].sort();
      const uniqueRegions = [...new Set(data.map(d => d.region))].sort();

      setEndYears(uniqueEndYears);
      setRegions(uniqueRegions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEndYearChange = (e) => {
    setSelectedEndYear(e.target.value);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const filteredData = data.filter(d => {
    return (
      (selectedEndYear === '' || d.end_year === selectedEndYear) &&
      (selectedRegion === '' || d.region === selectedRegion)
    );
  });

  useEffect(() => {
    drawChart(filteredData);
  }, [filteredData]);

  const drawChart = (data) => {
    const width = 1000;
    const height = 700;
    const margin = { top: 60, right: 30, bottom: 40, left: 60 };

    // Clear existing chart
    d3.select('#bullet-graph').selectAll('*').remove();

    const svg = d3.select('#bullet-graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relevance)]).nice()
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.likelihood)]).nice()
      .range([height, 0]);

    const size = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([0, 40]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.relevance))
      .attr('cy', d => y(d.likelihood))
      .attr('r', d => size(d.intensity))
      .attr('fill', d => color(d.sector))
      .attr('opacity', 0.7)
      .append('title')
      .text(d => `Sector: ${d.sector}\nRelevance: ${d.relevance}\nLikelihood: ${d.likelihood}\nIntensity: ${d.intensity}`);
  };

  return (
    <div className="bullet-graph-container">
      <Topnav />
      <Sidenav />
      <div className="filters">
        <label>
          End Year:
          <select value={selectedEndYear} onChange={handleEndYearChange}>
            <option value="">All</option>
            {endYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
        <label>
          Region:
          <select value={selectedRegion} onChange={handleRegionChange}>
            <option value="">All</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </label>
      </div>
      <div id="bullet-graph"></div>
    </div>
  );
};

export default BulletGraph;
