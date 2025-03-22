// Basic React component structure for the QC Team Productivity Tracker

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Reviewers from './pages/Reviewers';
import Jobs from './pages/Jobs';
import DailyPlanning from './pages/DailyPlanning';
import NextDayPlanning from './pages/NextDayPlanning';
import Reports from './pages/Reports';
import Forecasting from './pages/Forecasting';
import Settings from './pages/Settings';

// Import components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Create theme with primary color #4C8AC3
const theme = createTheme({
  palette: {
    primary: {
      main: '#4C8AC3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/markets" element={<PrivateRoute><Layout><Markets /></Layout></PrivateRoute>} />
          <Route path="/reviewers" element={<PrivateRoute><Layout><Reviewers /></Layout></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><Layout><Jobs /></Layout></PrivateRoute>} />
          <Route path="/daily-planning" element={<PrivateRoute><Layout><DailyPlanning /></Layout></PrivateRoute>} />
          <Route path="/next-day-planning" element={<PrivateRoute><Layout><NextDayPlanning /></Layout></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />
          <Route path="/forecasting" element={<PrivateRoute><Layout><Forecasting /></Layout></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
