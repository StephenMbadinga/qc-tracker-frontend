import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(subDays(new Date(), 7)); // Default to last 7 days
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll simulate loading data
    const timer = setTimeout(() => {
      setMarkets([
        { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
        { _id: '2', marketId: '11/12', name: 'Brevard & Volusia' }
      ]);
      
      setReviewers([
        { _id: '1', name: 'Harold', markets: [{ _id: '1' }] },
        { _id: '2', name: 'Chris', markets: [{ _id: '1' }] },
        { _id: '3', name: 'Jeff', markets: [{ _id: '1' }] },
        { _id: '4', name: 'Leonora', markets: [{ _id: '1' }] },
        { _id: '5', name: 'Arlene', markets: [{ _id: '2' }] },
        { _id: '6', name: 'Devin', markets: [{ _id: '2' }] }
      ]);
      
      setSelectedMarket('1'); // Default to first market
      setSelectedReviewers(['1', '2', '3']); // Default to first three reviewers
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && selectedMarket && selectedReviewers.length > 0) {
      generateReport();
    }
  }, [loading, selectedMarket, selectedReviewers, startDate, endDate, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarketChange = (event) => {
    setSelectedMarket(event.target.value);
    // Reset selected reviewers when market changes
    setSelectedReviewers([]);
  };

  const handleReviewerChange = (event) => {
    setSelectedReviewers(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  const handleDateRangePreset = (preset) => {
    const today = new Date();
    
    switch (preset) {
      case 'today':
        setStartDate(today);
        setEndDate(today);
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case 'last7days':
        setStartDate(subDays(today, 6));
        setEndDate(today);
        break;
      case 'thisWeek':
        setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
        setEndDate(today);
        break;
      case 'lastWeek':
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 1 });
        setStartDate(lastWeekStart);
        setEndDate(lastWeekEnd);
        break;
      case 'thisMonth':
        setStartDate(startOfMonth(today));
        setEndDate(today);
        break;
      case 'lastMonth':
        const lastMonthStart = startOfMonth(subDays(startOfMonth(today), 1));
        const lastMonthEnd = endOfMonth(lastMonthStart);
        setStartDate(lastMonthStart);
        setEndDate(lastMonthEnd);
        break;
      default:
        break;
    }
  };

  const generateReport = () => {
    // In a real app, this would fetch report data from the API
    // For now, we'll generate mock data
    
    // Get selected reviewer names
    const selectedReviewerNames = reviewers
      .filter(reviewer => selectedReviewers.includes(reviewer._id))
      .map(reviewer => reviewer.name);
    
    // Generate mock data based on the selected tab
    let mockData;
    
    switch (tabValue) {
      case 0: // Productivity Report
        mockData = {
          jobCounts: {
            labels: selectedReviewerNames,
            datasets: [
              {
                label: 'Total Jobs',
                data: selectedReviewerNames.map(() => Math.floor(Math.random() * 30) + 10),
                backgroundColor: '#4C8AC3',
              },
              {
                label: 'First-Time Approvals',
                data: selectedReviewerNames.map(() => Math.floor(Math.random() * 20) + 5),
                backgroundColor: '#4caf50',
              },
              {
                label: 'Resubmission Approvals',
                data: selectedReviewerNames.map(() => Math.floor(Math.random() * 10) + 2),
                backgroundColor: '#ff9800',
              }
            ]
          },
          processingTimes: {
            labels: selectedReviewerNames,
            datasets: [
              {
                label: 'Average Processing Time (hours)',
                data: selectedReviewerNames.map(() => (Math.random() * 4 + 1).toFixed(2)),
                backgroundColor: '#4C8AC3',
              }
            ]
          },
          statusDistribution: {
            labels: ['Submitted for QC', 'In QC', 'Approved', 'Rejected', 'Resubmitted', 'Send to Client'],
            datasets: [
              {
                data: [10, 15, 25, 8, 12, 30],
                backgroundColor: ['#ffeb3b', '#2196f3', '#4caf50', '#f44336', '#ff9800', '#9c27b0'],
                borderColor: ['#f0db0b', '#0b7dda', '#3c9f40', '#e42618', '#e08800', '#7a1ea1'],
              }
            ]
          },
          comparisonData: selectedReviewerNames.map(name => ({
            name,
            jobsPerDay: (Math.random() * 5 + 2).toFixed(2),
            avgProcessingTime: (Math.random() * 4 + 1).toFixed(2),
            firstTimeApprovalRate: (Math.random() * 30 + 60).toFixed(2) + '%',
            comparisonToAvg: (Math.random() * 40 - 20).toFixed(2) + '%'
          }))
        };
        break;
        
      case 1: // Time Analysis Report
        mockData = {
          timeByStatus: {
            labels: ['Submitted to In QC', 'In QC to Approved/Rejected', 'Rejected to Resubmitted', 'Resubmitted to Approved', 'Approved to Send to Client'],
            datasets: selectedReviewerNames.map((name, index) => ({
              label: name,
              data: [
                (Math.random() * 2 + 0.5).toFixed(2),
                (Math.random() * 4 + 1).toFixed(2),
                (Math.random() * 8 + 4).toFixed(2),
                (Math.random() * 3 + 1).toFixed(2),
                (Math.random() * 2 + 0.5).toFixed(2)
              ],
              backgroundColor: index === 0 ? '#4C8AC3' : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
            }))
          },
          timeByDay: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: selectedReviewerNames.map((name, index) => ({
              label: name,
              data: [
                (Math.random() * 4 + 1).toFixed(2),
                (Math.random() * 4 + 1).toFixed(2),
                (Math.random() * 4 + 1).toFixed(2),
                (Math.random() * 4 + 1).toFixed(2),
                (Math.random() * 4 + 1).toFixed(2)
              ],
              borderColor: index === 0 ? '#4C8AC3' : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              tension: 0.1
            }))
          },
          timeComparison: selectedReviewerNames.map(name => ({
            name,
            avgTimeToApproval: (Math.random() * 8 + 4).toFixed(2) + ' hours',
            avgTimeToResubmit: (Math.random() * 12 + 6).toFixed(2) + ' hours',
            comparisonToAvg: (Math.random() * 40 - 20).toFixed(2) + '%'
          }))
        };
        break;
        
      case 2: // Other Work Report
        mockData = {
          otherWorkCounts: {
            labels: ['Transmittals', 'Team Meetings', 'Training', 'Administrative', 'Other'],
            datasets: [
              {
                data: [15, 8, 5, 12, 3],
                backgroundColor: ['#4C8AC3', '#f44336', '#4caf50', '#ff9800', '#9c27b0'],
                borderColor: ['#3a78b1', '#e42618', '#3c9f40', '#e08800', '#7a1ea1'],
              }
            ]
          },
          otherWorkByReviewer: {
            labels: selectedReviewerNames,
            datasets: [
              {
                label: 'Transmittals',
                data: selectedReviewerNames.map(() => Math.floor(Math.random() * 5) + 1),
                backgroundColor: '#4C8AC3',
              },
              {
                label: 'Team Meetings',
                data: selectedReviewerNames.map(() => Math.floor(Math.random() * 3) + 1),
                backgroundColor: '#f44336',
              },
              {
                label: 'Training',
                data: selectedReviewerNames.map(() => Math.floor(Math.random() * 2) + 1),
                backgroundColor: '#4caf50',
              },
              {
                label: 'Administrative',
                data: selectedReviewerNames.map(() => Math.floor(Math.random() * 4) + 1),
                backgroundColor: '#ff9800',
              }
            ]
          },
          otherWorkTime: {
            labels: selectedReviewerNames,
            datasets: [
              {
                label: 'Hours Spent on Other Work',
                data: selectedReviewerNames.map(() => (Math.random() * 10 + 5).toFixed(2)),
                backgroundColor: '#4C8AC3',
              }
            ]
          }
        };
        break;
        
      default:
        mockData = {};
    }
    
    setReportData(mockData);
  };

  const handleExportReport = (format) => {
    // In a real app, this would generate and download a report file
    // For now, we'll just show a notification
    setSnackbar({
      open: true,
      message: `Report exported as ${format.toUpperCase()} successfully`,
      severity: 'success'
    });
  };

  const handlePrintReport = () => {
    // In a real app, this would open the print dialog
    // For now, we'll just show a notification
    window.print();
    setSnackbar({
      open: true,
      message: 'Print dialog opened',
      severity: 'info'
    });
  };

  const handleShareReport = () => {
    // In a real app, this would open a share dialog
    // For now, we'll just show a notification
    setSnackbar({
      open: true,
      message: 'Report sharing functionality would be implemented here',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Reports
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportReport('pdf')}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportReport('excel')}
            sx={{ mr: 1 }}
          >
            Export Excel
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrintReport}
            sx={{ mr: 1 }}
            className="no-print"
          >
            Print
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={handleShareReport}
            className="no-print"
          >
            Share
          </Button>
        </Box>
      </Box>

      {/* Report Type Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          aria-label="report tabs"
        >
          <Tab label="Productivity Report" />
          <Tab label="Time Analysis Report" />
          <Tab label="Other Work Report" />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }} className="no-print">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="market-filter-label">Market</InputLabel>
              <Select
                labelId="market-filter-label"
                value={selectedMarket}
                onChange={handleMarketChange}
                label="Market"
              >
                {markets.map((market) => (
                  <MenuItem key={market._id} value={market._id}>
                    {market.marketId} - {market.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="reviewer-filter-label">Reviewers</InputLabel>
              <Select
                labelId="reviewer-filter-label"
                multiple
                value={selectedReviewers}
                onChange={handleReviewerChange}
                label="Reviewers"
                renderValue={(selected) => {
                  const selectedNames = reviewers
                    .filter(reviewer => selected.includes(reviewer._id))
                    .map(reviewer => reviewer.name)
                    .join(', ');
                  return selectedNames;
                }}
              >
                {reviewers
                  .filter(reviewer => !selectedMarket || reviewer.markets.some(m => m._id === selectedMarket))
                  .map((reviewer) => (
                    <MenuItem key={reviewer._id} value={reviewer._id}>
                      {reviewer.name}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        
        {/* Date range presets */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('today')}>Today</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('yesterday')}>Yesterday</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('last7days')}>Last 7 Days</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('thisWeek')}>This Week</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('lastWeek')}>Last Week</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('thisMonth')}>This Month</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('lastMonth')}>Last Month</Button>
        </Box>
      </Paper>

      {/* Report Header */}
      <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {tabValue === 0 ? 'Productivity Report' : tabValue === 1 ? 'Time Analysis Report' : 'Other Work Report'}
        </Typography>
        <Typography variant="subtitle1">
          {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
        </Typography>
        <Typography variant="subtitle2">
          Market: {markets.find(m => m._id === selectedMarket)?.name || 'All Markets'}
        </Typography>
      </Paper>

      {/* Report Content */}
      {reportData ? (
        <Box>
          {/* Productivity Report */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Job Counts by Reviewer
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={reportData.jobCounts} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Average Processing Time (hours)
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={reportData.processingTimes} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Status Distribution
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <Pie 
                      data={reportData.statusDistribution} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Reviewer Comparison
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reviewer</TableCell>
                          <TableCell align="right">Jobs/Day</TableCell>
                          <TableCell align="right">Avg. Time (h)</TableCell>
                          <TableCell align="right">First-Time Approval</TableCell>
                          <TableCell align="right">vs. Average</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.comparisonData.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.jobsPerDay}</TableCell>
                            <TableCell align="right">{row.avgProcessingTime}</TableCell>
                            <TableCell align="right">{row.firstTimeApprovalRate}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: row.comparisonToAvg.startsWith('-') ? 'error.main' : 'success.main' 
                            }}>
                              {row.comparisonToAvg.startsWith('-') ? '' : '+'}{row.comparisonToAvg}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Time Analysis Report */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Average Time by Status (hours)
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Bar 
                      data={reportData.timeByStatus} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Average Processing Time by Day of Week
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line 
                      data={reportData.timeByDay} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Time Comparison by Reviewer
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reviewer</TableCell>
                          <TableCell align="right">Avg. Time to Approval</TableCell>
                          <TableCell align="right">Avg. Time to Resubmit</TableCell>
                          <TableCell align="right">vs. Average</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.timeComparison.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.avgTimeToApproval}</TableCell>
                            <TableCell align="right">{row.avgTimeToResubmit}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: row.comparisonToAvg.startsWith('-') ? 'success.main' : 'error.main' 
                            }}>
                              {row.comparisonToAvg.startsWith('-') ? '' : '+'}{row.comparisonToAvg}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Other Work Report */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Other Work Distribution
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <Pie 
                      data={reportData.otherWorkCounts} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Hours Spent on Other Work
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={reportData.otherWorkTime} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Other Work by Reviewer
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Bar 
                      data={reportData.otherWorkByReviewer} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            No data available for the selected criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please adjust your filters or select different reviewers
          </Typography>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports;
