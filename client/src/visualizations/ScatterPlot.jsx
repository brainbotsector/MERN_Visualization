import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ScatterPlot.css';

const ScatterPlot = ({ data }) => {
  const scatterPlotRef = useRef();

  useEffect(() => {
    if (data.length) {
      drawScatterPlot();
    }
  }, [data]);

  const drawScatterPlot = () => {
    d3.select(scatterPlotRef.current).select('svg').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(scatterPlotRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relevance)])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select(scatterPlotRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    svg.selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.intensity))
      .attr('cy', d => y(d.relevance))
      .attr('r', 5)
      .attr('fill', 'blue')
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`${d.topic}<br>Intensity: ${d.intensity}<br>Relevance: ${d.relevance}`)
          .style('left', `${x(d.intensity) + margin.left}px`)
          .style('top', `${y(d.relevance) + margin.top - 10}px`);
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  };

  return <div ref={scatterPlotRef} className="scatter-plot" />;
};

export default ScatterPlot;
