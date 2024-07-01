import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './PieChart.css';

const PieChart = ({ data }) => {
  const pieChartRef = useRef();

  useEffect(() => {
    if (data.length) {
      drawPieChart();
    }
  }, [data]);

  const drawPieChart = () => {
    d3.select(pieChartRef.current).select('svg').remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(pieChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.intensity)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const tooltip = d3.select(pieChartRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .on('mouseover', function(event, d) {
        const [x, y] = arc.centroid(d);
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`${d.data.topic}<br>Intensity: ${d.data.intensity}`)
          .style('left', `${x + width / 2}px`)
          .style('top', `${y + height / 2}px`);
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  };

  return <div ref={pieChartRef} className="pie-chart" />;
};

export default PieChart;
