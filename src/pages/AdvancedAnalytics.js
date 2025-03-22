import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from '@mui/material';
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
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

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
  LineElement,
  RadialLinearScale,
  Filler
);

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30)); // Default to last 30 days
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('reviewers'); // 'reviewers', 'markets', 'periods'
  const [comparisonPeriod, setComparisonPeriod] = useState('previous'); // 'previous', 'custom'
  const [comparisonStartDate, setComparisonStartDate] = useState(subDays(new Date(), 60));
  const [comparisonEndDate, setComparisonEndDate] = useState(subDays(new Date(), 31));
  const [markets, setMarkets] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

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
      generateAnalytics();
    }
  }, [loading, selectedMarket, selectedReviewers, startDate, endDate, tabValue, comparisonMode, comparisonPeriod, comparisonStartDate, comparisonEndDate]);

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

  const handleComparisonModeChange = (event) => {
    setComparisonMode(event.target.value);
  };

  const handleComparisonPeriodChange = (event) => {
    setComparisonPeriod(event.target.value);
    
    // If switching to previous period, automatically set the comparison dates
    if (event.target.value === 'previous') {
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      setComparisonStartDate(subDays(startDate, duration));
      setComparisonEndDate(subDays(startDate, 1));
    }
  };

  const handleComparisonStartDateChange = (newDate) => {
    setComparisonStartDate(newDate);
  };

  const handleComparisonEndDateChange = (newDate) => {
    setComparisonEndDate(newDate);
  };

  const handleDateRangePreset = (preset) => {
    const today = new Date();
    
    switch (preset) {
      case 'last7days':
        setStartDate(subDays(today, 6));
        setEndDate(today);
        break;
      case 'last30days':
        setStartDate(subDays(today, 29));
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

  const generateAnalytics = () => {
    // In a real app, this would fetch analytics data from the API
    // For now, we'll generate mock data
    
    // Get selected reviewer names
    const selectedReviewerNames = reviewers
      .filter(reviewer => selectedReviewers.includes(reviewer._id))
      .map(reviewer => reviewer.name);
    
    // Generate mock data based on the selected tab
    let mockData;
    
    switch (tabValue) {
      case 0: // Performance Analytics
        mockData = {
          // Current period data
          currentPeriod: {
            jobCompletionRate: {
              labels: selectedReviewerNames,
              datasets: [
                {
                  label: 'Jobs Completed Per Day',
                  data: selectedReviewerNames.map(() => (Math.random() * 3 + 2).toFixed(2)),
                  backgroundColor: '#4C8AC3',
                }
              ]
            },
            processingTime: {
              labels: selectedReviewerNames,
              datasets: [
                {
                  label: 'Average Processing Time (hours)',
                  data: selectedReviewerNames.map(() => (Math.random() * 4 + 1).toFixed(2)),
                  backgroundColor: '#4C8AC3',
                }
              ]
            },
            approvalRate: {
              labels: selectedReviewerNames,
              datasets: [
                {
                  label: 'First-Time Approval Rate (%)',
                  data: selectedReviewerNames.map(() => (Math.random() * 30 + 60).toFixed(2)),
                  backgroundColor: '#4C8AC3',
                }
              ]
            },
            performanceMetrics: selectedReviewerNames.map(name => ({
              name,
              jobsPerDay: (Math.random() * 3 + 2).toFixed(2),
              avgProcessingTime: (Math.random() * 4 + 1).toFixed(2),
              firstTimeApprovalRate: (Math.random() * 30 + 60).toFixed(2) + '%',
              resubmissionRate: (Math.random() * 20 + 10).toFixed(2) + '%',
              otherWorkHours: (Math.random() * 10 + 5).toFixed(2)
            }))
          },
          
          // Comparison period data (if applicable)
          comparisonPeriod: {
            jobCompletionRate: {
              labels: selectedReviewerNames,
              datasets: [
                {
                  label: 'Jobs Completed Per Day (Previous)',
                  data: selectedReviewerNames.map(() => (Math.random() * 3 + 1.5).toFixed(2)),
                  backgroundColor: '#f44336',
                }
              ]
            },
            processingTime: {
              labels: selectedReviewerNames,
              datasets: [
                {
                  label: 'Average Processing Time (hours) (Previous)',
                  data: selectedReviewerNames.map(() => (Math.random() * 4 + 1.5).toFixed(2)),
                  backgroundColor: '#f44336',
                }
              ]
            },
            approvalRate: {
              labels: selectedReviewerNames,
              datasets: [
                {
                  label: 'First-Time Approval Rate (%) (Previous)',
                  data: selectedReviewerNames.map(() => (Math.random() * 30 + 55).toFixed(2)),
                  backgroundColor: '#f44336',
                }
              ]
            },
            performanceMetrics: selectedReviewerNames.map(name => ({
              name,
              jobsPerDay: (Math.random() * 3 + 1.5).toFixed(2),
              avgProcessingTime: (Math.random() * 4 + 1.5).toFixed(2),
              firstTimeApprovalRate: (Math.random() * 30 + 55).toFixed(2) + '%',
              resubmissionRate: (Math.random() * 20 + 15).toFixed(2) + '%',
              otherWorkHours: (Math.random() * 10 + 4).toFixed(2)
            }))
          },
          
          // Comparison results
          comparison: {
            performanceComparison: selectedReviewerNames.map(name => {
              const currentMetrics = mockData?.currentPeriod.performanceMetrics.find(m => m.name === name);
              const previousMetrics = mockData?.comparisonPeriod.performanceMetrics.find(m => m.name === name);
              
              // Calculate percentage differences
              const jobsPerDayDiff = ((parseFloat(currentMetrics.jobsPerDay) - parseFloat(previousMetrics.jobsPerDay)) / parseFloat(previousMetrics.jobsPerDay) * 100).toFixed(2);
              const avgProcessingTimeDiff = ((parseFloat(currentMetrics.avgProcessingTime) - parseFloat(previousMetrics.avgProcessingTime)) / parseFloat(previousMetrics.avgProcessingTime) * 100).toFixed(2);
              const firstTimeApprovalRateDiff = ((parseFloat(currentMetrics.firstTimeApprovalRate) - parseFloat(previousMetrics.firstTimeApprovalRate)) / parseFloat(previousMetrics.firstTimeApprovalRate) * 100).toFixed(2);
              
              return {
                name,
                jobsPerDayDiff: jobsPerDayDiff + '%',
                avgProcessingTimeDiff: avgProcessingTimeDiff + '%',
                firstTimeApprovalRateDiff: firstTimeApprovalRateDiff + '%',
                overallPerformanceDiff: ((parseFloat(jobsPerDayDiff) - parseFloat(avgProcessingTimeDiff) + parseFloat(firstTimeApprovalRateDiff)) / 3).toFixed(2) + '%'
              };
            })
          }
        };
        break;
        
      case 1: // Trend Analysis
        // Generate data for trend over time
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const dateLabels = Array.from({ length: Math.min(days, 14) }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          return format(date, 'MMM d');
        });
        
        mockData = {
          jobVolumeOverTime: {
            labels: dateLabels,
            datasets: selectedReviewerNames.map((name, index) => ({
              label: name,
              data: dateLabels.map(() => Math.floor(Math.random() * 5) + 1),
              borderColor: index === 0 ? '#4C8AC3' : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              tension: 0.1
            }))
          },
          processingTimeOverTime: {
            labels: dateLabels,
            datasets: selectedReviewerNames.map((name, index) => ({
              label: name,
              data: dateLabels.map(() => (Math.random() * 4 + 1).toFixed(2)),
              borderColor: index === 0 ? '#4C8AC3' : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              tension: 0.1
            }))
          },
          approvalRateOverTime: {
            labels: dateLabels,
            datasets: selectedReviewerNames.map((name, index) => ({
              label: name,
              data: dateLabels.map(() => (Math.random() * 30 + 60).toFixed(2)),
              borderColor: index === 0 ? '#4C8AC3' : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              tension: 0.1
            }))
          },
          trendAnalysis: selectedReviewerNames.map(name => ({
            name,
            trend: Math.random() > 0.5 ? 'Improving' : 'Declining',
            consistency: (Math.random() * 30 + 70).toFixed(2) + '%',
            volatility: (Math.random() * 20).toFixed(2) + '%',
            peakDay: dateLabels[Math.floor(Math.random() * dateLabels.length)]
          }))
        };
        break;
        
      case 2: // Efficiency Analysis
        mockData = {
          efficiencyRadar: {
            labels: ['Speed', 'Accuracy', 'Volume', 'Consistency', 'Quality'],
            datasets: selectedReviewerNames.map((name, index) => ({
              label: name,
              data: [
                (Math.random() * 40 + 60).toFixed(2), // Speed
                (Math.random() * 30 + 70).toFixed(2), // Accuracy
                (Math.random() * 50 + 50).toFixed(2), // Volume
                (Math.random() * 20 + 80).toFixed(2), // Consistency
                (Math.random() * 25 + 75).toFixed(2)  // Quality
              ],
              backgroundColor: `rgba(76, 138, 195, ${index === 0 ? 0.7 : 0.3})`,
              borderColor: index === 0 ? '#4C8AC3' : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
            }))
          },
          timeDistribution: {
            labels: ['In QC', 'Waiting for Resubmission', 'Client Review', 'Other'],
            datasets: [
              {
                data: [40, 25, 20, 15],
                backgroundColor: ['#4C8AC3', '#f44336', '#4caf50', '#ff9800'],
                borderColor: ['#3a78b1', '#e42618', '#3c9f40', '#e08800'],
              }
            ]
          },
          bottlenecks: [
            { stage: 'Waiting for Resubmission', avgTime: '2.5 days', impact: 'High' },
            { stage: 'Client Review', avgTime: '1.8 days', impact: 'Medium' },
            { stage: 'Initial QC', avgTime: '0.8 days', impact: 'Low' }
          ],
          efficiencyMetrics: selectedReviewerNames.map(name => ({
            name,
            throughputRate: (Math.random() * 3 + 2).toFixed(2) + ' jobs/day',
            cycleTime: (Math.random() * 3 + 1).toFixed(2) + ' days',
            qualityScore: (Math.random() * 20 + 80).toFixed(2) + '%',
            utilizationRate: (Math.random() * 15 + 85).toFixed(2) + '%',
            efficiencyScore: (Math.random() * 25 + 75).toFixed(2) + '%'
          }))
        };
        break;
        
      default:
        mockData = {};
    }
    
    setAnalyticsData(mockData);
  };

  const handleExportAnalytics = (format) => {
    // In a real app, this would generate and download an analytics report
    alert(`Analytics exported as ${format.toUpperCase()} successfully`);
  };

  const handlePrintAnalytics = () => {
    // In a real app, this would open the print dialog
    window.print();
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
          Advanced Analytics
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportAnalytics('pdf')}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportAnalytics('excel')}
            sx={{ mr: 1 }}
          >
            Export Excel
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrintAnalytics}
            className="no-print"
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Analytics Type Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          aria-label="analytics tabs"
        >
          <Tab label="Performance Analytics" />
          <Tab label="Trend Analysis" />
          <Tab label="Efficiency Analysis" />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }} className="no-print">
        <Grid container spacing={2}>
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
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('last7days')}>Last 7 Days</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('last30days')}>Last 30 Days</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('thisWeek')}>This Week</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('lastWeek')}>Last Week</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('thisMonth')}>This Month</Button>
          <Button size="small" variant="outlined" onClick={() => handleDateRangePreset('lastMonth')}>Last Month</Button>
        </Box>
        
        {/* Comparison Controls */}
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CompareArrowsIcon sx={{ mr: 1 }} /> Comparison Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="comparison-mode-label">Compare By</InputLabel>
                <Select
                  labelId="comparison-mode-label"
                  value={comparisonMode}
                  onChange={handleComparisonModeChange}
                  label="Compare By"
                >
                  <MenuItem value="reviewers">Reviewers</MenuItem>
                  <MenuItem value="markets">Markets</MenuItem>
                  <MenuItem value="periods">Time Periods</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {comparisonMode === 'periods' && (
              <>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="comparison-period-label">Comparison Period</InputLabel>
                    <Select
                      labelId="comparison-period-label"
                      value={comparisonPeriod}
                      onChange={handleComparisonPeriodChange}
                      label="Comparison Period"
                    >
                      <MenuItem value="previous">Previous Period</MenuItem>
                      <MenuItem value="custom">Custom Period</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {comparisonPeriod === 'custom' && (
                  <>
                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Comparison Start"
                          value={comparisonStartDate}
                          onChange={handleComparisonStartDateChange}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Comparison End"
                          value={comparisonEndDate}
                          onChange={handleComparisonEndDateChange}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        </Box>
      </Paper>

      {/* Analytics Header */}
      <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {tabValue === 0 ? 'Performance Analytics' : tabValue === 1 ? 'Trend Analysis' : 'Efficiency Analysis'}
        </Typography>
        <Typography variant="subtitle1">
          {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
        </Typography>
        <Typography variant="subtitle2">
          Market: {markets.find(m => m._id === selectedMarket)?.name || 'All Markets'}
        </Typography>
      </Paper>

      {/* Analytics Content */}
      {analyticsData ? (
        <Box>
          {/* Performance Analytics */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Performance Comparison
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reviewer</TableCell>
                          <TableCell align="right">Jobs/Day</TableCell>
                          <TableCell align="right">Avg. Processing Time (h)</TableCell>
                          <TableCell align="right">First-Time Approval Rate</TableCell>
                          <TableCell align="right">Overall Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.comparison.performanceComparison.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              color: parseFloat(row.jobsPerDayDiff) >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {parseFloat(row.jobsPerDayDiff) >= 0 ? '+' : ''}{row.jobsPerDayDiff}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              color: parseFloat(row.avgProcessingTimeDiff) <= 0 ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {parseFloat(row.avgProcessingTimeDiff) >= 0 ? '+' : ''}{row.avgProcessingTimeDiff}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              color: parseFloat(row.firstTimeApprovalRateDiff) >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {parseFloat(row.firstTimeApprovalRateDiff) >= 0 ? '+' : ''}{row.firstTimeApprovalRateDiff}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              color: parseFloat(row.overallPerformanceDiff) >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {parseFloat(row.overallPerformanceDiff) >= 0 ? '+' : ''}{row.overallPerformanceDiff}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Job Completion Rate
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={{
                        labels: analyticsData.currentPeriod.jobCompletionRate.labels,
                        datasets: [
                          ...analyticsData.currentPeriod.jobCompletionRate.datasets,
                          ...(comparisonMode === 'periods' ? analyticsData.comparisonPeriod.jobCompletionRate.datasets : [])
                        ]
                      }} 
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
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Processing Time
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={{
                        labels: analyticsData.currentPeriod.processingTime.labels,
                        datasets: [
                          ...analyticsData.currentPeriod.processingTime.datasets,
                          ...(comparisonMode === 'periods' ? analyticsData.comparisonPeriod.processingTime.datasets : [])
                        ]
                      }} 
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
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    First-Time Approval Rate
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={{
                        labels: analyticsData.currentPeriod.approvalRate.labels,
                        datasets: [
                          ...analyticsData.currentPeriod.approvalRate.datasets,
                          ...(comparisonMode === 'periods' ? analyticsData.comparisonPeriod.approvalRate.datasets : [])
                        ]
                      }} 
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
                    Detailed Performance Metrics
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reviewer</TableCell>
                          <TableCell align="right">Jobs/Day</TableCell>
                          <TableCell align="right">Avg. Processing Time (h)</TableCell>
                          <TableCell align="right">First-Time Approval Rate</TableCell>
                          <TableCell align="right">Resubmission Rate</TableCell>
                          <TableCell align="right">Other Work Hours</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.currentPeriod.performanceMetrics.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.jobsPerDay}</TableCell>
                            <TableCell align="right">{row.avgProcessingTime}</TableCell>
                            <TableCell align="right">{row.firstTimeApprovalRate}</TableCell>
                            <TableCell align="right">{row.resubmissionRate}</TableCell>
                            <TableCell align="right">{row.otherWorkHours}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Trend Analysis */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Job Volume Over Time
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line 
                      data={analyticsData.jobVolumeOverTime} 
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
                    Processing Time Over Time
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line 
                      data={analyticsData.processingTimeOverTime} 
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
                    Approval Rate Over Time
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line 
                      data={analyticsData.approvalRateOverTime} 
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
                    Trend Analysis Summary
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reviewer</TableCell>
                          <TableCell align="right">Overall Trend</TableCell>
                          <TableCell align="right">Consistency</TableCell>
                          <TableCell align="right">Volatility</TableCell>
                          <TableCell align="right">Peak Performance Day</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.trendAnalysis.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              color: row.trend === 'Improving' ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {row.trend}
                            </TableCell>
                            <TableCell align="right">{row.consistency}</TableCell>
                            <TableCell align="right">{row.volatility}</TableCell>
                            <TableCell align="right">{row.peakDay}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Efficiency Analysis */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Efficiency Radar
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Radar 
                      data={analyticsData.efficiencyRadar} 
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
                        scales: {
                          r: {
                            min: 0,
                            max: 100,
                            ticks: {
                              stepSize: 20
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Time Distribution
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <Pie 
                      data={analyticsData.timeDistribution} 
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
                    Process Bottlenecks
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Process Stage</TableCell>
                          <TableCell align="right">Average Time</TableCell>
                          <TableCell align="right">Impact</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.bottlenecks.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {row.stage}
                            </TableCell>
                            <TableCell align="right">{row.avgTime}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: row.impact === 'High' ? 'error.main' : row.impact === 'Medium' ? 'warning.main' : 'success.main',
                              fontWeight: row.impact === 'High' ? 'bold' : 'normal'
                            }}>
                              {row.impact}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Efficiency Metrics
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reviewer</TableCell>
                          <TableCell align="right">Throughput Rate</TableCell>
                          <TableCell align="right">Cycle Time</TableCell>
                          <TableCell align="right">Efficiency Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.efficiencyMetrics.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.throughputRate}</TableCell>
                            <TableCell align="right">{row.cycleTime}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: parseFloat(row.efficiencyScore) >= 85 ? 'success.main' : parseFloat(row.efficiencyScore) >= 75 ? 'warning.main' : 'error.main',
                              fontWeight: parseFloat(row.efficiencyScore) >= 85 ? 'bold' : 'normal'
                            }}>
                              {row.efficiencyScore}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Efficiency Improvement Recommendations" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Short-term Improvements
                        </Typography>
                        <Typography variant="body2" paragraph>
                          1. Reduce waiting time between status changes by implementing automatic notifications.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          2. Standardize review processes to reduce variability in processing times.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          3. Implement daily stand-up meetings to identify and address bottlenecks quickly.
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Medium-term Improvements
                        </Typography>
                        <Typography variant="body2" paragraph>
                          1. Develop specialized teams for different types of jobs to improve efficiency.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          2. Implement a training program to improve first-time approval rates.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          3. Optimize resource allocation based on historical performance data.
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Long-term Improvements
                        </Typography>
                        <Typography variant="body2" paragraph>
                          1. Invest in automation tools to reduce manual processing time.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          2. Develop predictive models to anticipate workload fluctuations.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          3. Implement continuous improvement processes with regular efficiency reviews.
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            No analytics data available for the selected criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please adjust your filters or select different reviewers
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AdvancedAnalytics;
