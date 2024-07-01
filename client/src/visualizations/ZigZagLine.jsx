import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import "./ZigzagLine.css"; 
import "../pages/Sidenav.css"; 

import Sidenav from "../pages/SideNav";


const API_BASE_URL = 'http://localhost:5000/api/data'; 

const ZigzagLineChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState('pestle'); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const fetchedData = response.data.map(item => ({
        intensity: item.intensity,
        sector: item.sector,
        topic: item.topic,
        insight: item.insight,
        url: item.url,
        region: item.region,
        added: item.added,
        published: item.published,
        country: item.country,
        relevance: item.relevance,
        pestle: item.pestle,
        source: item.source,
        title: item.title,
        likelihood: item.likelihood
      }));
      setData(fetchedData);
      setFilteredData(fetchedData); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setSelectedParameter(value); 
    filterData(value); 
  };

  const filterData = (parameter) => {
    if (parameter === 'All') {
      setFilteredData(data); 
    } else {
      const filtered = data.filter(item => item[parameter]); 
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    if (filteredData.length > 0) {
      drawChart(filteredData);
    }
  }, [filteredData]);

  const drawChart = (data) => {
    // Clear existing SVG before drawing new chart
    d3.select('#zigzag-line-chart svg').remove();

    const margin = { top: 50, right: 50, bottom: 50, left: 50 }; 
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select('#zigzag-line-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[selectedParameter])) 
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain([...new Set(data.map(d => d.pestle))]);

    const line = d3.line()
      .x(d => x(d[selectedParameter])) 
      .y(d => y(d.intensity)) 
      .curve(d3.curveStepAfter);

    svg.selectAll('.line')
      .data(data)
      .enter().append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d.pestle))
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d[selectedParameter])) 
      .attr('cy', d => y(d.intensity)) 
      .attr('r', 5)
      .style('fill', d => colorScale(d.pestle));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    const legend = svg.selectAll('.legend')
      .data(colorScale.domain())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend.append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', colorScale);

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(d => d);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .attr('text-anchor', 'middle')
      .text(selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)); 

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text('Intensity');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - (margin.top / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('text-decoration', 'underline')
      .text('Zigzag Line Chart');
  };

  return (
    <div className="chart-container">
      <Sidenav /> 
      <div id="filter" className="filter-container">
        <label htmlFor="parameterFilter">Select Parameter:</label>
        <select id="parameterFilter" name="parameter" onChange={handleFilterChange}>
          <option value="pestle">PESTLE</option>
          <option value="intensity">Intensity</option>
          
        </select>
      </div>
      <div id="zigzag-line-chart" className="chart"></div>
    </div>
  );
};

export default ZigzagLineChart;
