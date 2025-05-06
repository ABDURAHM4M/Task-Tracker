import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../axios';

const COLORS = ['#82ca9d','#ffc658','#ff7f7f'];

export default function Analytics() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks')
      .then(({ data }) => setTasks(data.tasks))
      .catch(console.error);
  }, []);

  // prepare line chart data: count by date
  const lineData = Object.entries(
    tasks.reduce((acc, t) => {
      const d = new Date(t.createdAt).toLocaleDateString();
      acc[d] = (acc[d]||0)+1; return acc;
    }, {})
  ).map(([date,count]) => ({ date, count }));

  // prepare pie chart data: priority distribution
  const priorityCount = tasks.reduce((acc,t) => {
    acc[t.priority] = (acc[t.priority]||0)+1; return acc;
  }, {});
  const pieData = ['low','medium','high'].map((key,i) => ({
    name: key,
    value: priorityCount[key] || 0
  }));

  return (
    <Box sx={{ p:4 }}>
      <Typography variant="h4" gutterBottom>Analytics</Typography>

      <Paper sx={{ p:2, mb:4 }}>
        <Typography variant="h6">Tasks Created Over Time</Typography>
        <LineChart width={600} height={250} data={lineData}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false}/>
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1976d2" />
        </LineChart>
      </Paper>

      <Paper sx={{ p:2 }}>
        <Typography variant="h6">Priority Distribution</Typography>
        <PieChart width={400} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%" cy="50%"
            innerRadius={50}
            outerRadius={80}
            label
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </Paper>
    </Box>
  );
}
