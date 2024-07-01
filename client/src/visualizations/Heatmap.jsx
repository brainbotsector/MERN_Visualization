import React, { useState, useEffect } from "react";
import axios from "axios";
import * as d3 from "d3";
import "../visualizations/Heatmap.css"; 
import "../pages/Sidenav.css"; 
import "../pages/Topnav.css";  
import Sidenav from "../pages/SideNav"; 
import Topnav from "../pages/TopNav";   

const Heatmap = () => {
  const [data, setData] = useState([]);
  const [endYears, setEndYears] = useState([]);
  const [selectedEndYear, setSelectedEndYear] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/data/")
      .then((response) => {
        const fetchedData = response.data;
        setData(fetchedData);

        const uniqueEndYears = [
          ...new Set(fetchedData.map((d) => d.end_year)),
        ].sort();
        setEndYears(uniqueEndYears);

        const uniqueTopics = [...new Set(fetchedData.map((d) => d.topic))].sort();
        setTopics(uniqueTopics);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
   
    createHeatmap();
  }, [data, selectedEndYear, selectedTopic]);

  const createHeatmap = () => {
    d3.select("#heatmap-container").select("svg").remove();

    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const width = 900 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select("#heatmap-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const sectors = [...new Set(data.map((d) => d.sector))];
    const regions = [...new Set(data.map((d) => d.region))];

    const xScale = d3.scaleBand().domain(sectors).range([0, width]).padding(0.05);

    const yScale = d3.scaleBand().domain(regions).range([height, 0]).padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolatePlasma).domain([0, d3.max(data, (d) => d.intensity)]);

    const tooltip = d3
      .select("#heatmap-container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.sector))
      .attr("y", (d) => yScale(d.region))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.intensity))
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Sector: ${d.sector}<br>Region: ${d.region}<br>Intensity: ${d.intensity}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale)).selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)")
      .style("font-size", "12px");

    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "12px");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Sectors");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Regions");
  };

  const handleEndYearChange = (e) => setSelectedEndYear(e.target.value);
  const handleTopicChange = (e) => setSelectedTopic(e.target.value);

  return (
    <div className="heatmap">
      <Topnav />
      <Sidenav />
      <div className="content">
        <h2>Heatmap - Intensity Distribution</h2>
        <div className="filters">
          <label></label>

          <select value={selectedEndYear} onChange={handleEndYearChange}>
            <option value="">All Years</option>
            {endYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
          <select value={selectedTopic} onChange={handleTopicChange}>
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <div id="heatmap-container" className="heatmap-container"></div>
      </div>
    </div>
  );
};

export default Heatmap;
