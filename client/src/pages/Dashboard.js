import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Dashboard() {
  // start rates as null so we can show a loading state
  const [rates, setRates] = useState(null);
  const [pos, setPos] = useState(null);

  // fetch exchange rates
  useEffect(() => {
    fetch('https://api.exchangerate.host/latest?base=USD')
      .then(r => r.json())
      .then(d => setRates(d.rates))
      .catch(console.error);
  }, []);

  // get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPos([coords.latitude, coords.longitude]),
      () => {}
    );
  }, []);

  const currencies = ['EUR', 'GBP', 'JPY', 'CAD'];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6">USD Exchange Rates</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Currency</TableCell>
              <TableCell>Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rates
              ? currencies.map(cur => (
                  <TableRow key={cur}>
                    <TableCell>{cur}</TableCell>
                    <TableCell>
                      {rates[cur] != null ? rates[cur].toFixed(4) : '—'}
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Loading rates…
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </Paper>

      {pos && (
        <Paper sx={{ height: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>Your Location</Typography>
          <MapContainer center={pos} zoom={13} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={pos}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        </Paper>
      )}
    </Box>
  );
}
