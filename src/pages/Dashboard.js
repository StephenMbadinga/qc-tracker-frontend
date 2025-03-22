import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Paper,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    inProgressJobs: 0,
    completedJobs: 0,
    rejectedJobs: 0,
    reviewers: 0,
    firstTimeApprovals: 0,
    resubmissionApprovals: 0
  });

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalJobs: 156,
        inProgressJobs: 42,
        completedJobs: 98,
        rejectedJobs: 16,
        reviewers: 15,
        firstTimeApprovals: 78,
        resubmissionApprovals: 20
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Pie chart data for job statuses
  const statusData = {
    labels: ['In Progress', 'Completed', 'Rejected'],
    datasets: [
      {
        data: [stats.inProgressJobs, stats.completedJobs, stats.rejectedJobs],
        backgroundColor: ['#2196f3', '#4caf50', '#f44336'],
        borderColor: ['#1976d2', '#388e3c', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for approvals
  const approvalData = {
    labels: ['First-Time Approvals', 'Resubmission Approvals'],
    datasets: [
      {
        label: 'Number of Jobs',
        data: [stats.firstTimeApprovals, stats.resubmissionApprovals],
        backgroundColor: ['#4C8AC3', '#ff9800'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Approval Types',
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  {stats.totalJobs}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Total Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  {stats.reviewers}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Active Reviewers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 40, mr: 2, color: '#4caf50' }} />
                <Typography variant="h5" component="div">
                  {stats.completedJobs}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Completed Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="dashboard-card" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ErrorIcon sx={{ fontSize: 40, mr: 2, color: '#f44336' }} />
                <Typography variant="h5" component="div">
                  {stats.rejectedJobs}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                Rejected Jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Job Status Distribution
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={statusData} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Approval Types
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 300 }}>
              <Bar options={barOptions} data={approvalData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary">
              Add New Job
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary">
              Generate Daily Report
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary">
              View Daily Planning
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
