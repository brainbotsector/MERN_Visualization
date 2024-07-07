import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../pages/Sidenav.css';
import '../pages/Topnav.css';
import Sidenav from '../pages/SideNav';
import '../visualizations/Stacked.css';

// Register the required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StackedBarChart = () => {
  const [chartData, setChartData] = useState({});
  const [pestleChartData, setPestleChartData] = useState({});
  const [countries, setCountries] = useState([]);
  const [pestles, setPestles] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPestle, setSelectedPestle] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedCountry, selectedPestle]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      const data = response.data;

      const filteredData = selectedCountry 
        ? data.filter(item => item.country === selectedCountry)
        : data;

      // Data processing for Sectors by Region
      const regions = [...new Set(filteredData.map(item => item.region))];
      const sectors = [...new Set(filteredData.map(item => item.sector))];

      const sectorDatasets = sectors.map(sector => ({
        label: sector,
        data: regions.map(region => filteredData.filter(item => item.region === region && item.sector === sector).length),
        backgroundColor: getRandomColor(),
      }));

      setChartData({
        labels: regions,
        datasets: sectorDatasets
      });

      // Data processing for Pestle by Country
      const countries = [...new Set(data.map(item => item.country))];
      const pestles = [...new Set(data.map(item => item.pestle))];
      
      const pestleFilteredData = selectedPestle 
        ? data.filter(item => item.pestle === selectedPestle)
        : data;

      const pestleDatasets = pestles.map(pestle => ({
        label: pestle,
        data: countries.map(country => pestleFilteredData.filter(item => item.country === country && item.pestle === pestle).length),
        backgroundColor: getRandomColor(),
      }));

      setPestleChartData({
        labels: countries,
        datasets: pestleDatasets
      });

      setCountries(countries);
      setPestles(pestles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handlePestleChange = (event) => {
    setSelectedPestle(event.target.value);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="main-container">
      <Sidenav />
      <div className="content-container">
        
        <div className="chart-content">
          <h2>Stacked Bar Chart of Sectors by Region</h2>
          <label htmlFor="country-select">Select Country: </label>
          <select id="country-select" onChange={handleCountryChange}>
            <option value="">All</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {chartData.labels && chartData.datasets && (
            <div className="chart-container">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  scales: {
                    x: { 
                      stacked: true,
                      type: 'category',
                    },
                    y: { 
                      stacked: true 
                    },
                  }
                }}
              />
            </div>
          )}

          <div className="chart-spacing"></div>

          <h2>Stacked Bar Chart of Pestle by Country</h2>
          <label htmlFor="pestle-select">Select PESTLE: </label>
          <select id="pestle-select" onChange={handlePestleChange}>
            <option value="">All</option>
            {pestles.map(pestle => (
              <option key={pestle} value={pestle}>{pestle}</option>
            ))}
          </select>
          {pestleChartData.labels && pestleChartData.datasets && (
            <div className="chart-container">
              <Bar
                data={pestleChartData}
                options={{
                  responsive: true,
                  scales: {
                    x: { 
                      stacked: true,
                      type: 'category',
                    },
                    y: { 
                      stacked: true 
                    },
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackedBarChart;
