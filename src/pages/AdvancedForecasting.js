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
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, subDays, addDays, differenceInDays } from 'date-fns';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  ChartTooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdvancedForecasting = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(subDays(new Date(), 90)); // Default to last 90 days
  const [endDate, setEndDate] = useState(new Date());
  const [forecastPeriod, setForecastPeriod] = useState(30); // Default to 30 days
  const [selectedMarket, setSelectedMarket] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('medium'); // 'low', 'medium', 'high'
  const [markets, setMarkets] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [forecastData, setForecastData] = useState(null);

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
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && selectedMarket) {
      generateForecast();
    }
  }, [loading, selectedMarket, startDate, endDate, forecastPeriod, tabValue, confidenceLevel]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarketChange = (event) => {
    setSelectedMarket(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
  };

  const handleForecastPeriodChange = (event) => {
    setForecastPeriod(parseInt(event.target.value));
  };

  const handleConfidenceLevelChange = (event) => {
    setConfidenceLevel(event.target.value);
  };

  const generateForecast = () => {
    // In a real app, this would fetch forecast data from the API
    // For now, we'll generate mock data
    
    // Generate date labels for historical data
    const historyDays = differenceInDays(endDate, startDate) + 1;
    const historyLabels = Array.from({ length: Math.min(historyDays, 30) }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return format(date, 'MMM d');
    });
    
    // Generate date labels for forecast data
    const forecastLabels = Array.from({ length: forecastPeriod }, (_, i) => {
      const date = new Date(endDate);
      date.setDate(date.getDate() + i + 1);
      return format(date, 'MMM d');
    });
    
    // Generate combined labels
    const combinedLabels = [...historyLabels, ...forecastLabels];
    
    // Generate mock data based on the selected tab
    let mockData;
    
    switch (tabValue) {
      case 0: // Job Volume Forecast
        // Generate historical job volume data with some randomness
        const historyVolume = historyLabels.map(() => Math.floor(Math.random() * 10) + 5);
        
        // Calculate trend from historical data
        const avgHistoryVolume = historyVolume.reduce((sum, val) => sum + val, 0) / historyVolume.length;
        const trend = (historyVolume[historyVolume.length - 1] - historyVolume[0]) / historyVolume.length;
        
        // Generate forecast data based on trend with increasing uncertainty
        const forecastVolume = forecastLabels.map((_, i) => {
          const baseForecast = avgHistoryVolume + trend * (i + 1);
          const uncertainty = baseForecast * (i + 1) * (confidenceLevel === 'low' ? 0.1 : confidenceLevel === 'medium' ? 0.05 : 0.02);
          return Math.max(0, baseForecast + (Math.random() * 2 - 1) * uncertainty);
        });
        
        // Calculate confidence intervals
        const lowerBound = forecastVolume.map((val, i) => {
          const uncertainty = val * (i + 1) * (confidenceLevel === 'low' ? 0.2 : confidenceLevel === 'medium' ? 0.1 : 0.05);
          return Math.max(0, val - uncertainty);
        });
        
        const upperBound = forecastVolume.map((val, i) => {
          const uncertainty = val * (i + 1) * (confidenceLevel === 'low' ? 0.2 : confidenceLevel === 'medium' ? 0.1 : 0.05);
          return val + uncertainty;
        });
        
        mockData = {
          jobVolumeForecast: {
            labels: combinedLabels,
            datasets: [
              {
                label: 'Historical Job Volume',
                data: [...historyVolume, ...Array(forecastPeriod).fill(null)],
                borderColor: '#4C8AC3',
                backgroundColor: 'rgba(76, 138, 195, 0.2)',
                fill: true,
                tension: 0.1
              },
              {
                label: 'Forecasted Job Volume',
                data: [...Array(historyLabels.length).fill(null), ...forecastVolume],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                fill: true,
                tension: 0.1,
                borderDash: [5, 5]
              },
              {
                label: 'Upper Bound',
                data: [...Array(historyLabels.length).fill(null), ...upperBound],
                borderColor: 'rgba(244, 67, 54, 0.3)',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.1,
                borderDash: [2, 2],
                pointRadius: 0
              },
              {
                label: 'Lower Bound',
                data: [...Array(historyLabels.length).fill(null), ...lowerBound],
                borderColor: 'rgba(244, 67, 54, 0.3)',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.1,
                borderDash: [2, 2],
                pointRadius: 0
              }
            ]
          },
          volumeStatistics: {
            historical: {
              average: avgHistoryVolume.toFixed(2),
              min: Math.min(...historyVolume).toFixed(2),
              max: Math.max(...historyVolume).toFixed(2),
              trend: trend.toFixed(2)
            },
            forecast: {
              average: (forecastVolume.reduce((sum, val) => sum + val, 0) / forecastVolume.length).toFixed(2),
              min: Math.min(...forecastVolume).toFixed(2),
              max: Math.max(...forecastVolume).toFixed(2),
              total: forecastVolume.reduce((sum, val) => sum + val, 0).toFixed(2)
            }
          },
          anomalies: [
            {
              date: format(addDays(endDate, Math.floor(Math.random() * forecastPeriod) + 1), 'MMM d, yyyy'),
              type: 'Spike',
              description: 'Unexpected increase in job volume',
              impact: 'High',
              recommendation: 'Prepare additional resources'
            },
            {
              date: format(addDays(endDate, Math.floor(Math.random() * forecastPeriod) + 1), 'MMM d, yyyy'),
              type: 'Drop',
              description: 'Potential decrease in job volume',
              impact: 'Medium',
              recommendation: 'Monitor closely, adjust staffing if trend continues'
            }
          ]
        };
        break;
        
      case 1: // Resource Needs Forecast
        // Generate historical resource utilization data
        const historyUtilization = historyLabels.map(() => (Math.random() * 30 + 70).toFixed(2));
        
        // Generate forecast data based on job volume forecast
        const forecastUtilization = forecastLabels.map((_, i) => {
          const baseForecast = 80 + (i % 5 === 0 ? 10 : 0) + (Math.random() * 10 - 5);
          return Math.min(100, Math.max(50, baseForecast));
        });
        
        // Calculate required staff based on utilization
        const baseStaff = 5;
        const requiredStaff = forecastUtilization.map(util => 
          Math.ceil(baseStaff * (util / 80))
        );
        
        mockData = {
          utilizationForecast: {
            labels: combinedLabels,
            datasets: [
              {
                label: 'Historical Utilization (%)',
                data: [...historyUtilization, ...Array(forecastPeriod).fill(null)],
                borderColor: '#4C8AC3',
                backgroundColor: 'rgba(76, 138, 195, 0.2)',
                fill: true,
                tension: 0.1
              },
              {
                label: 'Forecasted Utilization (%)',
                data: [...Array(historyLabels.length).fill(null), ...forecastUtilization],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                fill: true,
                tension: 0.1,
                borderDash: [5, 5]
              }
            ]
          },
          staffingForecast: {
            labels: forecastLabels,
            datasets: [
              {
                label: 'Required Staff',
                data: requiredStaff,
                backgroundColor: '#4C8AC3',
              }
            ]
          },
          resourceNeeds: {
            currentStaff: baseStaff,
            averageRequired: (requiredStaff.reduce((sum, val) => sum + val, 0) / requiredStaff.length).toFixed(2),
            maxRequired: Math.max(...requiredStaff),
            minRequired: Math.min(...requiredStaff),
            recommendations: [
              {
                period: 'Week 1',
                staff: Math.ceil(requiredStaff.slice(0, 7).reduce((sum, val) => sum + val, 0) / 7),
                utilization: (forecastUtilization.slice(0, 7).reduce((sum, val) => sum + parseFloat(val), 0) / 7).toFixed(2) + '%',
                action: 'Maintain current staffing'
              },
              {
                period: 'Week 2',
                staff: Math.ceil(requiredStaff.slice(7, 14).reduce((sum, val) => sum + val, 0) / 7),
                utilization: (forecastUtilization.slice(7, 14).reduce((sum, val) => sum + parseFloat(val), 0) / 7).toFixed(2) + '%',
                action: 'Consider adding 1 temporary staff'
              },
              {
                period: 'Week 3-4',
                staff: Math.ceil(requiredStaff.slice(14).reduce((sum, val) => sum + val, 0) / requiredStaff.slice(14).length),
                utilization: (forecastUtilization.slice(14).reduce((sum, val) => sum + parseFloat(val), 0) / forecastUtilization.slice(14).length).toFixed(2) + '%',
                action: 'Evaluate long-term staffing needs'
              }
            ]
          }
        };
        break;
        
      case 2: // Completion Time Forecast
        // Generate historical completion time data
        const historyCompletionTime = historyLabels.map(() => (Math.random() * 3 + 2).toFixed(2));
        
        // Generate forecast data with seasonal pattern
        const forecastCompletionTime = forecastLabels.map((_, i) => {
          const seasonalFactor = 1 + 0.2 * Math.sin(i / 7 * Math.PI); // Weekly seasonality
          const baseForecast = 3 * seasonalFactor;
          const uncertainty = baseForecast * (i + 1) * (confidenceLevel === 'low' ? 0.1 : confidenceLevel === 'medium' ? 0.05 : 0.02);
          return Math.max(1, baseForecast + (Math.random() * 2 - 1) * uncertainty);
        });
        
        // Calculate expected completion dates for new jobs
        const completionDates = Array.from({ length: 5 }, (_, i) => {
          const startDate = new Date();
          const processingTime = forecastCompletionTime[Math.floor(Math.random() * forecastCompletionTime.length)];
          const businessDays = Math.ceil(processingTime * 1.5); // Convert processing time to business days
          
          // Add business days to start date
          let currentDate = new Date(startDate);
          let daysAdded = 0;
          while (daysAdded < businessDays) {
            currentDate.setDate(currentDate.getDate() + 1);
            // Skip weekends
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
              daysAdded++;
            }
          }
          
          return {
            jobId: `D-HCS${500 + i}`,
            startDate: format(startDate, 'MMM d, yyyy'),
            estimatedCompletionDate: format(currentDate, 'MMM d, yyyy'),
            processingTime: processingTime.toFixed(2),
            confidence: confidenceLevel === 'low' ? 'Low (±30%)' : confidenceLevel === 'medium' ? 'Medium (±15%)' : 'High (±5%)'
          };
        });
        
        mockData = {
          completionTimeForecast: {
            labels: combinedLabels,
            datasets: [
              {
                label: 'Historical Completion Time (days)',
                data: [...historyCompletionTime, ...Array(forecastPeriod).fill(null)],
                borderColor: '#4C8AC3',
                backgroundColor: 'rgba(76, 138, 195, 0.2)',
                fill: true,
                tension: 0.1
              },
              {
                label: 'Forecasted Completion Time (days)',
                data: [...Array(historyLabels.length).fill(null), ...forecastCompletionTime],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                fill: true,
                tension: 0.1,
                borderDash: [5, 5]
              }
            ]
          },
          completionTimeStatistics: {
            historical: {
              average: (historyCompletionTime.reduce((sum, val) => sum + parseFloat(val), 0) / historyCompletionTime.length).toFixed(2),
              min: Math.min(...historyCompletionTime.map(v => parseFloat(v))).toFixed(2),
              max: Math.max(...historyCompletionTime.map(v => parseFloat(v))).toFixed(2)
            },
            forecast: {
              average: (forecastCompletionTime.reduce((sum, val) => sum + val, 0) / forecastCompletionTime.length).toFixed(2),
              min: Math.min(...forecastCompletionTime).toFixed(2),
              max: Math.max(...forecastCompletionTime).toFixed(2),
              trend: forecastCompletionTime[forecastCompletionTime.length - 1] > forecastCompletionTime[0] ? 'Increasing' : 'Decreasing'
            }
          },
          completionDates: completionDates,
          seasonalPatterns: [
            { day: 'Monday', factor: '+15%', impact: 'Longer completion times at week start' },
            { day: 'Friday', factor: '-10%', impact: 'Shorter completion times before weekend' },
            { period: 'Month End', factor: '+20%', impact: 'Significant increase in processing time' }
          ]
        };
        break;
        
      default:
        mockData = {};
    }
    
    setForecastData(mockData);
  };

  const handleExportForecast = (format) => {
    // In a real app, this would generate and download a forecast report
    alert(`Forecast exported as ${format.toUpperCase()} successfully`);
  };

  const handlePrintForecast = () => {
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
          Advanced Forecasting
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportForecast('pdf')}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportForecast('excel')}
            sx={{ mr: 1 }}
          >
            Export Excel
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrintForecast}
            className="no-print"
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Forecast Type Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          aria-label="forecast tabs"
        >
          <Tab label="Job Volume Forecast" />
          <Tab label="Resource Needs Forecast" />
          <Tab label="Completion Time Forecast" />
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
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="History Start"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="History End"
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel id="forecast-period-label">Forecast Period</InputLabel>
              <Select
                labelId="forecast-period-label"
                value={forecastPeriod}
                onChange={handleForecastPeriodChange}
                label="Forecast Period"
              >
                <MenuItem value={7}>7 Days</MenuItem>
                <MenuItem value={14}>14 Days</MenuItem>
                <MenuItem value={30}>30 Days</MenuItem>
                <MenuItem value={60}>60 Days</MenuItem>
                <MenuItem value={90}>90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="confidence-level-label">Confidence Level</InputLabel>
              <Select
                labelId="confidence-level-label"
                value={confidenceLevel}
                onChange={handleConfidenceLevelChange}
                label="Confidence Level"
              >
                <MenuItem value="low">Low (±30%)</MenuItem>
                <MenuItem value="medium">Medium (±15%)</MenuItem>
                <MenuItem value="high">High (±5%)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Forecast Header */}
      <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {tabValue === 0 ? 'Job Volume Forecast' : tabValue === 1 ? 'Resource Needs Forecast' : 'Completion Time Forecast'}
        </Typography>
        <Typography variant="subtitle1">
          Historical Data: {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
        </Typography>
        <Typography variant="subtitle2">
          Forecast Period: {format(addDays(endDate, 1), 'MMMM d, yyyy')} - {format(addDays(endDate, forecastPeriod), 'MMMM d, yyyy')} ({forecastPeriod} days)
        </Typography>
      </Paper>

      {/* Forecast Content */}
      {forecastData ? (
        <Box>
          {/* Job Volume Forecast */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Job Volume Forecast
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line 
                      data={forecastData.jobVolumeForecast} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                  label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                  label += context.parsed.y.toFixed(2);
                                }
                                return label;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Job Volume'
                            },
                            min: 0
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Volume Statistics" 
                    subheader="Historical vs. Forecast Comparison"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          Historical Data
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Average Volume: {forecastData.volumeStatistics.historical.average} jobs/day
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Min Volume: {forecastData.volumeStatistics.historical.min} jobs/day
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Max Volume: {forecastData.volumeStatistics.historical.max} jobs/day
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          Trend: {forecastData.volumeStatistics.historical.trend} 
                          {parseFloat(forecastData.volumeStatistics.historical.trend) > 0 ? (
                            <TrendingUpIcon color="success" sx={{ ml: 1 }} />
                          ) : parseFloat(forecastData.volumeStatistics.historical.trend) < 0 ? (
                            <TrendingDownIcon color="error" sx={{ ml: 1 }} />
                          ) : (
                            <TrendingFlatIcon color="info" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          Forecast Data
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Average Volume: {forecastData.volumeStatistics.forecast.average} jobs/day
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Min Volume: {forecastData.volumeStatistics.forecast.min} jobs/day
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Max Volume: {forecastData.volumeStatistics.forecast.max} jobs/day
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Total Forecasted Jobs: {forecastData.volumeStatistics.forecast.total}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Anomaly Detection" 
                    subheader="Potential volume anomalies in forecast period"
                  />
                  <Divider />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Impact</TableCell>
                            <TableCell>Recommendation</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {forecastData.anomalies.map((anomaly, index) => (
                            <TableRow key={index}>
                              <TableCell>{anomaly.date}</TableCell>
                              <TableCell>
                                {anomaly.type === 'Spike' ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingUpIcon color="error" sx={{ mr: 1 }} />
                                    {anomaly.type}
                                  </Box>
                                ) : (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TrendingDownIcon color="warning" sx={{ mr: 1 }} />
                                    {anomaly.type}
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell>{anomaly.description}</TableCell>
                              <TableCell align="right" sx={{ 
                                color: anomaly.impact === 'High' ? 'error.main' : anomaly.impact === 'Medium' ? 'warning.main' : 'info.main',
                                fontWeight: anomaly.impact === 'High' ? 'bold' : 'normal'
                              }}>
                                {anomaly.impact}
                              </TableCell>
                              <TableCell>{anomaly.recommendation}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Forecast Interpretation
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Short-term Outlook (7 days)
                      </Typography>
                      <Typography variant="body2" paragraph>
                        The short-term forecast indicates {parseFloat(forecastData.volumeStatistics.forecast.average) > parseFloat(forecastData.volumeStatistics.historical.average) ? 'an increase' : 'a decrease'} in job volume compared to historical averages. Expect approximately {(parseFloat(forecastData.volumeStatistics.forecast.average) * 7).toFixed(0)} jobs in the next week.
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {parseFloat(forecastData.volumeStatistics.forecast.average) > parseFloat(forecastData.volumeStatistics.historical.average) * 1.1 ? (
                          <WarningIcon color="warning" sx={{ mr: 1 }} />
                        ) : parseFloat(forecastData.volumeStatistics.forecast.average) < parseFloat(forecastData.volumeStatistics.historical.average) * 0.9 ? (
                          <InfoIcon color="info" sx={{ mr: 1 }} />
                        ) : (
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {parseFloat(forecastData.volumeStatistics.forecast.average) > parseFloat(forecastData.volumeStatistics.historical.average) * 1.1 ? 
                            'Prepare for increased workload' : 
                            parseFloat(forecastData.volumeStatistics.forecast.average) < parseFloat(forecastData.volumeStatistics.historical.average) * 0.9 ? 
                            'Potential resource underutilization' : 
                            'Workload within normal range'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Medium-term Outlook (30 days)
                      </Typography>
                      <Typography variant="body2" paragraph>
                        The 30-day forecast shows a {parseFloat(forecastData.volumeStatistics.historical.trend) > 0 ? 'continuing upward' : 'stabilizing'} trend in job volume. Total expected volume is approximately {forecastData.volumeStatistics.forecast.total} jobs over the forecast period.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Confidence level is {confidenceLevel === 'low' ? 'low' : confidenceLevel === 'medium' ? 'moderate' : 'high'}, with potential variation of {confidenceLevel === 'low' ? '±30%' : confidenceLevel === 'medium' ? '±15%' : '±5%'} in actual volumes.
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Recommendations
                      </Typography>
                      <Typography variant="body2" component="div">
                        <ul>
                          <li>Monitor actual volumes against forecast daily</li>
                          <li>Adjust staffing based on short-term forecast</li>
                          <li>Pay special attention to identified anomaly dates</li>
                          <li>Update forecast weekly with new data</li>
                          <li>Consider {parseFloat(forecastData.volumeStatistics.historical.trend) > 0 ? 'increasing capacity' : 'optimizing resource allocation'} for the forecast period</li>
                        </ul>
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Resource Needs Forecast */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Resource Utilization Forecast
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line 
                      data={forecastData.utilizationForecast} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Utilization (%)'
                            },
                            min: 50,
                            max: 100
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
                    Staffing Requirements Forecast
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={forecastData.staffingForecast} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Staff Count'
                            },
                            min: 0,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Resource Needs Summary" 
                    subheader="Based on forecasted utilization"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          Current Staff: {forecastData.resourceNeeds.currentStaff}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Average Required: {forecastData.resourceNeeds.averageRequired}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Maximum Required: {forecastData.resourceNeeds.maxRequired}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Minimum Required: {forecastData.resourceNeeds.minRequired}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom sx={{ 
                          color: forecastData.resourceNeeds.maxRequired > forecastData.resourceNeeds.currentStaff ? 'error.main' : 'success.main',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {forecastData.resourceNeeds.maxRequired > forecastData.resourceNeeds.currentStaff ? (
                            <>
                              <WarningIcon sx={{ mr: 1 }} />
                              Staffing Shortage Predicted
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon sx={{ mr: 1 }} />
                              Adequate Staffing
                            </>
                          )}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Staffing Gap: {Math.max(0, forecastData.resourceNeeds.maxRequired - forecastData.resourceNeeds.currentStaff)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Confidence Level: {confidenceLevel === 'low' ? 'Low (±30%)' : confidenceLevel === 'medium' ? 'Medium (±15%)' : 'High (±5%)'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Staffing Recommendations by Period
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Required Staff</TableCell>
                          <TableCell align="right">Avg. Utilization</TableCell>
                          <TableCell>Recommended Action</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {forecastData.resourceNeeds.recommendations.map((rec, index) => (
                          <TableRow key={index}>
                            <TableCell>{rec.period}</TableCell>
                            <TableCell align="right">{rec.staff}</TableCell>
                            <TableCell align="right">{rec.utilization}</TableCell>
                            <TableCell>{rec.action}</TableCell>
                            <TableCell>
                              {rec.staff > forecastData.resourceNeeds.currentStaff ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                                  <WarningIcon sx={{ mr: 1 }} />
                                  Understaffed
                                </Box>
                              ) : rec.staff < forecastData.resourceNeeds.currentStaff ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'info.main' }}>
                                  <InfoIcon sx={{ mr: 1 }} />
                                  Overstaffed
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                  <CheckCircleIcon sx={{ mr: 1 }} />
                                  Optimal
                                </Box>
                              )}
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
                  <CardHeader 
                    title="Resource Optimization Strategies" 
                    subheader="Based on forecast analysis"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Short-term Strategies
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Adjust daily work assignments based on forecasted volume</li>
                            <li>Implement flexible scheduling for peak periods</li>
                            <li>Cross-train team members for versatility</li>
                            <li>Prioritize critical jobs during high-volume periods</li>
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Medium-term Strategies
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Consider temporary staff for predicted peak periods</li>
                            <li>Implement process improvements to increase efficiency</li>
                            <li>Develop contingency plans for unexpected volume spikes</li>
                            <li>Adjust capacity planning based on weekly forecast updates</li>
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Long-term Strategies
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Evaluate permanent staffing needs based on trend analysis</li>
                            <li>Invest in automation for routine tasks</li>
                            <li>Develop advanced forecasting models with machine learning</li>
                            <li>Implement continuous improvement processes</li>
                          </ul>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Completion Time Forecast */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Completion Time Forecast
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line 
                      data={forecastData.completionTimeForecast} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Date'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Completion Time (days)'
                            },
                            min: 0
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Completion Time Statistics" 
                    subheader="Historical vs. Forecast Comparison"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          Historical Data
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Average Time: {forecastData.completionTimeStatistics.historical.average} days
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Min Time: {forecastData.completionTimeStatistics.historical.min} days
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Max Time: {forecastData.completionTimeStatistics.historical.max} days
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          Forecast Data
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Average Time: {forecastData.completionTimeStatistics.forecast.average} days
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Min Time: {forecastData.completionTimeStatistics.forecast.min} days
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Max Time: {forecastData.completionTimeStatistics.forecast.max} days
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          Trend: {forecastData.completionTimeStatistics.forecast.trend} 
                          {forecastData.completionTimeStatistics.forecast.trend === 'Increasing' ? (
                            <TrendingUpIcon color="error" sx={{ ml: 1 }} />
                          ) : (
                            <TrendingDownIcon color="success" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Seasonal Patterns
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Time Period</TableCell>
                          <TableCell align="right">Impact Factor</TableCell>
                          <TableCell>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {forecastData.seasonalPatterns.map((pattern, index) => (
                          <TableRow key={index}>
                            <TableCell>{pattern.day || pattern.period}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: pattern.factor.startsWith('+') ? 'error.main' : 'success.main',
                              fontWeight: 'bold'
                            }}>
                              {pattern.factor}
                            </TableCell>
                            <TableCell>{pattern.impact}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Estimated Completion Dates for New Jobs
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Job ID</TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>Estimated Completion</TableCell>
                          <TableCell align="right">Processing Time</TableCell>
                          <TableCell>Confidence</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {forecastData.completionDates.map((job) => (
                          <TableRow key={job.jobId}>
                            <TableCell>{job.jobId}</TableCell>
                            <TableCell>{job.startDate}</TableCell>
                            <TableCell>{job.estimatedCompletionDate}</TableCell>
                            <TableCell align="right">{job.processingTime} days</TableCell>
                            <TableCell>{job.confidence}</TableCell>
                            <TableCell>
                              <Tooltip title="This is an estimated date based on historical data and forecasted processing times. Actual completion may vary.">
                                <IconButton size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
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
                  <CardHeader 
                    title="Completion Time Optimization" 
                    subheader="Strategies to improve processing times"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Process Improvements
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Standardize review procedures to reduce variability</li>
                            <li>Implement parallel processing for independent review steps</li>
                            <li>Reduce handoff delays between process stages</li>
                            <li>Automate routine quality checks</li>
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Resource Allocation
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Allocate additional resources during high-volume periods</li>
                            <li>Implement priority-based processing for urgent jobs</li>
                            <li>Balance workload across team members</li>
                            <li>Develop specialized teams for complex jobs</li>
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Client Communication
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Set realistic expectations based on forecast data</li>
                            <li>Provide regular status updates for in-progress jobs</li>
                            <li>Implement early notification for potential delays</li>
                            <li>Develop expedited process for critical jobs</li>
                          </ul>
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
            No forecast data available for the selected criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please adjust your filters or select a different market
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AdvancedForecasting;
