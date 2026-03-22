
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 1. Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PopularDestinationsChart: React.FC = () => {
  // 2. Define the configuration options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Most Popular Holiday Destinations (2026)',
      },
    },
  };

  // 3. Define the data and styling
  const data = {
    labels: ['Paris, France', 'Bali, Indonesia', 'Tokyo, Japan', 'Rome, Italy', 'New York, USA', 'Cancun, Mexico'],
    datasets: [
      {
        label: 'Millions of Visitors',
        data: [44, 16, 32, 28, 30, 20], // Replace with your actual data
        backgroundColor: 'rgba(59, 113, 202, 0.7)', // MDB Primary Blue
        borderColor: 'rgba(59, 113, 202, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-4-strong rounded-5 p-4">
        {/* The Bar component automatically renders the canvas */}
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default PopularDestinationsChart;
