
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PopularDestinationsChart: React.FC = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

  const data = {
    labels: ['Paris, France', 'Bali, Indonesia', 'Tokyo, Japan', 'Rome, Italy', 'New York, USA', 'Cancun, Mexico'],
    datasets: [
      {
        label: 'Millions of Visitors',
        data: [44, 16, 32, 28, 30, 20], 
        backgroundColor: 'rgba(59, 113, 202, 0.7)', 
        borderColor: 'rgba(59, 113, 202, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-4-strong rounded-5 p-4">
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default PopularDestinationsChart;
