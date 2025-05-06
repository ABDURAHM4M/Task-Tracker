// src/pages/Tasks.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../api';  // make sure this matches your file name

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tasks')                // GET /api/v1/tasks
      .then(({ data }) => setTasks(data.tasks))
      .catch((err) => {
        console.error('Failed to fetch tasks:', err);
        // you can navigate to login on 401 if desired
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    try {
      const { data: created } = await api.post(
        '/tasks/task/create',         // POST /api/v1/tasks/task/create
        {
          title: text,
          description: text,
        }
      );
      setTasks((prev) => [...prev, created]);
      setNewTask('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/task/${id}`); // DELETE /api/v1/tasks/task/:id
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">My Tasks</Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate('/analytics')}>
            Analytics
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Box>

      <List>
        {tasks.map((task) => (
          <React.Fragment key={task._id}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(task._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={task.title} secondary={task.description} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}

export default Tasks;
