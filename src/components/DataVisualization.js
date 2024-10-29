import React, { useEffect, useState, useRef } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement } from 'chart.js';  
import api from './../api';  
import { ToastContainer, toast } from 'react-toastify';
import { Grid, Paper, Typography } from '@mui/material';  

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement);

const DataVisualization = () => {
  const [logs, setLogs] = useState([]);
  const socket = useRef(null);

  const fetchLogs = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await api.get('/api/logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        setLogs(response.data.logs);
      } else {
        toast.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Error fetching logs');
    }
  };

  useEffect(() => {
    fetchLogs();

    // Set up WebSocket connection
    socket.current = new WebSocket('ws://localhost:3001'); // Replace with your WebSocket server URL
    socket.current.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      setLogs(prevLogs => [...prevLogs, newLog]); // Append new log to existing logs
      toast.success('New log entry received');
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const moodCounts = {
    verysad: 0,
    sad: 0,
    happy: 0,
    "very-happy": 0,
  };

  logs.forEach(log => {
    if (log.mood) {
      moodCounts[log.mood]++;
    }
  });

  const moodData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: 'Mood Distribution',
        data: Object.values(moodCounts),
        backgroundColor: [
          'rgba(75,192,192,0.5)',
          'rgba(255,99,132,0.5)',
          'rgba(255,206,86,0.5)',
          'rgba(54,162,235,0.5)',
        ],
        borderColor: [
          'rgba(75,192,192,1)',
          'rgba(255,99,132,1)',
          'rgba(255,206,86,1)',
          'rgba(54,162,235,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const levelsData = {
    labels: logs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Anxiety Levels',
        data: logs.map(log => log.anxiety_level),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
      {
        label: 'Stress Levels',
        data: logs.map(log => log.stress_level),
        borderColor: 'rgba(255,159,64,1)',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Data Visualization
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Mood Distribution (Pie Chart)
            </Typography>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Pie data={moodData} options={{ responsive: true }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Anxiety and Stress Levels Over Time (Line Chart)
            </Typography>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Line data={levelsData} />
            </div>
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default DataVisualization;
