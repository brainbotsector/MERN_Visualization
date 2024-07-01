import * as d3 from 'd3';

export const drawBoxPlot = (data, svgRef) => {
  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove(); // Clear any existing content

  const margin = { top: 10, right: 30, bottom: 30, left: 40 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const g = svg.append("g")
               .attr("transform", `translate(${margin.left},${margin.top})`);

  const intensityValues = data.map(d => d.intensity);

  const x = d3.scaleBand()
              .range([0, width])
              .domain(["Intensity"])
              .paddingInner(1)
              .paddingOuter(0.5);

  const y = d3.scaleLinear()
              .domain([0, d3.max(intensityValues)])
              .range([height, 0]);

  g.append("g")
   .attr("transform", `translate(0,${height})`)
   .call(d3.axisBottom(x));

  g.append("g")
   .call(d3.axisLeft(y));

  const sumstat = d3.nest()
                    .key(d => d.intensity)
                    .rollup(d => {
                      const q1 = d3.quantile(d.map(g => g.intensity).sort(d3.ascending), .25);
                      const median = d3.quantile(d.map(g => g.intensity).sort(d3.ascending), .5);
                      const q3 = d3.quantile(d.map(g => g.intensity).sort(d3.ascending), .75);
                      const interQuantileRange = q3 - q1;
                      const min = q1 - 1.5 * interQuantileRange;
                      const max = q3 + 1.5 * interQuantileRange;
                      return { q1, median, q3, interQuantileRange, min, max };
                    })
                    .entries(data);

  g.selectAll("vertLines")
   .data(sumstat)
   .enter()
   .append("line")
   .attr("x1", d => x(d.key))
   .attr("x2", d => x(d.key))
   .attr("y1", d => y(d.value.min))
   .attr("y2", d => y(d.value.max))
   .attr("stroke", "black");

  g.selectAll("boxes")
   .data(sumstat)
   .enter()
   .append("rect")
   .attr("x", d => x(d.key) - 30)
   .attr("y", d => y(d.value.q3))
   .attr("height", d => y(d.value.q1) - y(d.value.q3))
   .attr("width", 60)
   .attr("stroke", "black")
   .style("fill", "#69b3a2");

  g.selectAll("medianLines")
   .data(sumstat)
   .enter()
   .append("line")
   .attr("x1", d => x(d.key) - 30)
   .attr("x2", d => x(d.key) + 30)
   .attr("y1", d => y(d.value.median))
   .attr("y2", d => y(d.value.median))
   .attr("stroke", "black");
};
