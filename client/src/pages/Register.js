import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'url("https://source.unsplash.com/1600x900/?blue,abstract")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', opacity: 0.95 }}>
        <Typography variant="h5" align="center" mb={2}>Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleRegister}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}
          >
            Register
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
