import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import Sidenav from '../pages/SideNav'; 
import '../visualizations/chart.css'; 
const PieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedSlice, setSelectedSlice] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      const data = response.data;
      const topicData = data.reduce((acc, item) => {
        acc[item.topic] = (acc[item.topic] || 0) + 1;
        return acc;
      }, {});

      const formattedData = {
        labels: Object.keys(topicData),
        datasets: [{
          data: Object.values(topicData),
          backgroundColor: getRandomColors(Object.keys(topicData).length),
          hoverBackgroundColor: getRandomColors(Object.keys(topicData).length),
        }],
      };

      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSliceClick = (event, pieChartElements) => {
    if (pieChartElements.length > 0) {
      const clickedSlice = pieChartElements[0];
      setSelectedSlice(clickedSlice);
    }
  };

  const getRandomColors = (numColors) => {
    const letters = '0123456789ABCDEF';
    let colors = [];
    for (let i = 0; i < numColors; i++) {
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }
    return colors;
  };

  return (
    <div className="chart-container">
      
      <Sidenav /> 
      <h2>Pie Chart of Topics Distribution</h2>
      <div style={{ width: '900px', height: '0px' }}>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
                },
              },
            },
          }}
          onElementsClick={handleSliceClick}
        />
      </div>
    </div>
  );
};

export default PieChart;
