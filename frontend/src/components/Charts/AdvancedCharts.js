import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import './AdvancedCharts.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdvancedCharts = ({ priceData, volumeData }) => {
  const [chartType, setChartType] = useState('line');
  const [timeFrame, setTimeFrame] = useState('7d');

  // Sample data for demonstration
  const samplePriceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    prices: [40000, 42000, 38000, 45000, 48000, 46000, 50000],
  };

  const sampleVolumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    volumes: [1000000, 1200000, 900000, 1500000, 1800000, 1600000, 2000000],
  };

  const priceChartData = {
    labels: samplePriceData.labels,
    datasets: [
      {
        label: 'Price (USD)',
        data: samplePriceData.prices,
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const volumeChartData = {
    labels: sampleVolumeData.labels,
    datasets: [
      {
        label: 'Volume (24h)',
        data: sampleVolumeData.volumes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cryptocurrency Price Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const volumeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Trading Volume',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="advanced-charts">
      <div className="chart-controls">
        <h2>Advanced Charts</h2>
        <div className="control-group">
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="chart-select"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
          <select 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
            className="time-select"
          >
            <option value="24h">24H</option>
            <option value="7d">7D</option>
            <option value="30d">30D</option>
            <option value="90d">90D</option>
            <option value="1y">1Y</option>
          </select>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          {chartType === 'line' ? (
            <Line data={priceChartData} options={chartOptions} />
          ) : (
            <Bar data={priceChartData} options={chartOptions} />
          )}
        </div>

        <div className="chart-card">
          <Bar data={volumeChartData} options={volumeOptions} />
        </div>
      </div>

      <div className="technical-indicators">
        <h3>Technical Indicators</h3>
        <div className="indicators-grid">
          <div className="indicator">
            <span className="indicator-label">RSI</span>
            <span className="indicator-value">62.5</span>
          </div>
          <div className="indicator">
            <span className="indicator-label">MACD</span>
            <span className="indicator-value">+125.8</span>
          </div>
          <div className="indicator">
            <span className="indicator-label">Bollinger Bands</span>
            <span className="indicator-value">±2.5%</span>
          </div>
          <div className="indicator">
            <span className="indicator-label">Moving Average</span>
            <span className="indicator-value">50-day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
