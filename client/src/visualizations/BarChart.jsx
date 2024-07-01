import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

const BarChart = ({ data }) => {
  useEffect(() => {
    const createBarChart = () => {
      console.log('Data received by BarChart:', data);

      // Remove existing SVG if any
      d3.select('#bar-chart').select('svg').remove();

      // Check if data is empty
      if (!data || data.length === 0) {
        console.warn('No data provided to BarChart component');
        return;
      }

      // Select the container
      const container = d3.select('#bar-chart').node();
      const containerWidth = container.getBoundingClientRect().width;

      // Set up SVG dimensions and margins
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = containerWidth - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create SVG element
      const svg = d3.select('#bar-chart')
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', 400);

      // Create scales
      const x = d3.scaleBand()
        .domain(data.map(d => d.end_year))
        .range([margin.left, width + margin.left])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.intensity)])
        .nice()
        .range([height, 0]);

      // Create main group element
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Append axes
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));

      // Append bars
      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.end_year))
        .attr('y', d => y(d.intensity))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.intensity))
        .attr('fill', 'steelblue');
    };

    createBarChart();
  }, [data]);

  return <div id="bar-chart" className="bar-chart"></div>;
};

export default BarChart;
