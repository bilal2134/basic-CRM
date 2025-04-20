import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CustomersPage from './pages/CustomersPage';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f6fb',
      paper: '#fff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: Array(25).fill('0px 4px 20px 0px rgba(0,0,0,0.08)'),
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/add" element={<CustomersPage mode="add" />} />
            <Route path="/customers/edit/:id" element={<CustomersPage mode="edit" />} />
            <Route path="/customers/delete/:id" element={<CustomersPage mode="delete" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
