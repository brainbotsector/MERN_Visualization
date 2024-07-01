import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const StackedBarChart = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (filteredData.length > 0) {
      createStackedBarChart(filteredData);
    }
  }, [filteredData]);

  const createStackedBarChart = (filteredData) => {
    d3.select('#stacked-bar-chart').select('svg').remove();

    const container = d3.select('#stacked-bar-chart').node();
    const containerWidth = container.getBoundingClientRect().width;
    const svg = d3.select('#stacked-bar-chart')
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', 400);

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain([...new Set(filteredData.map(d => d.sector))])
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d3.sum(d.topics, t => t.intensity))])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const stackedData = d3.stack()
      .keys([...new Set(filteredData.flatMap(d => d.topics.map(t => t.topic)))])
      .value((d, key) => d.topics.find(t => t.topic === key)?.intensity || 0)
      (filteredData);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    const barGroups = g.selectAll('.bar-group')
      .data(stackedData)
      .enter().append('g')
      .attr('fill', d => color(d.key));

    barGroups.selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => x(d.data.sector))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());
  };

  return (
    <div id="stacked-bar-chart"></div>
  );
};

export default StackedBarChart;
