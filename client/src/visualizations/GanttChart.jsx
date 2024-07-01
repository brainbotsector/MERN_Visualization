import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './GanttChart.css';
import "../pages/Sidenav.css"; // Corrected path

import Sidenav from "../pages/SideNav"; // Import Sidenav component

const API_BASE_URL = 'http://localhost:5000/api'; // Update this to your actual API base URL

const GanttChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    sector: 'All'
  });

  const tooltipRef = useRef(null); // Ref for the tooltip

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data`);
      const data = response.data.map(d => ({
        ...d,
        start_year: d.start_year || '2017', // Default start year if not provided
        end_year: d.end_year || '2018' // Default end year if not provided
      }));
      setData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterData = () => {
    let filtered = data;

    if (filters.sector !== 'All') {
      filtered = filtered.filter(d => d.sector === filters.sector);
    }

    setFilteredData(filtered);
    drawChart(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const drawChart = (data) => {
    const margin = { top: 50, right: 30, bottom: 30, left: 150 }; // Adjusted left margin for labels
    const width = 1500 - margin.left - margin.right; // Increased width
    const height = 700 - margin.top - margin.bottom; // Increased height
  
    d3.select('#gantt-chart').selectAll('*').remove();
  
    const svg = d3.select('#gantt-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleTime()
      .domain([new Date(d3.min(data, d => d.start_year)), new Date(d3.max(data, d => d.end_year))])
      .range([0, width]);
  
    const y = d3.scaleBand()
      .domain(data.map(d => d.source))
      .range([0, height])
      .padding(0.1);
  
    // Define a custom color scale for sectors
    const color = d3.scaleOrdinal(d3.schemePastel2); // Use a categorical color scheme
  
    // Y-axis label
    svg.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .style('text-anchor', 'middle')
      .text('Source');
  
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll("text") // Ensure labels are fully visible
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");
  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)));
  
    // Tooltip setup
    const tooltip = d3.select('#gantt-chart')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.75)')
      .style('color', '#fff')
      .style('padding', '5px')
      .style('border-radius', '3px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('display', 'none'); // Initially hide the tooltip
  
    // Draw bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(new Date(d.start_year)))
      .attr('y', d => y(d.source))
      .attr('width', d => x(new Date(d.end_year)) - x(new Date(d.start_year)))
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.sector)) // Color based on sector
      .attr('opacity', 0.7) // Adjust opacity for better visibility
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1); // Increase opacity on hover
        tooltip.style('display', 'block').html(`<strong>Title:</strong> ${d.title}<br/><strong>Insight:</strong> ${d.insight}`);
      })
      .on('mousemove', function(event) {
        tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY + 10}px`); // Position tooltip near the mouse pointer
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7); // Restore original opacity
        tooltip.style('display', 'none'); // Hide the tooltip on mouseout
      });
  
    svg.selectAll('text.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(new Date(d.start_year)) + 5)
      .attr('y', d => y(d.source) + y.bandwidth() / 2)
      .attr('dy', '.35em')
      .text(d => d.intensity)
      .style('fill', '#000') // Label color
      .style('writing-mode', 'vertical-rl') // Rotate labels vertically
      .style('text-anchor', 'start'); // Adjust text anchor
  };

  const uniqueSectors = [...new Set(data.map(d => d.sector))].filter(Boolean);

  return (
    <div className="gantt-chart-container">
      <Sidenav />
      <div className="filter-container">
        <label>
          Sector:
          <select name="sector" onChange={handleFilterChange} value={filters.sector}>
            <option value="All">All</option>
            {uniqueSectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
          </select>
        </label>
      </div>
      <div id="gantt-chart"></div>
    </div>
  );
};

export default GanttChart;
