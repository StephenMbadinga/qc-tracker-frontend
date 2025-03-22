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
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement
);

const Forecasting = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [markets, setMarkets] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [jobVolume, setJobVolume] = useState(100);
  const [avgHoursPerJob, setAvgHoursPerJob] = useState(2);
  const [avgHoursPerWeek, setAvgHoursPerWeek] = useState(40);
  const [startDate, setStartDate] = useState(new Date());
  const [reviewerCount, setReviewerCount] = useState(5);
  const [forecastResults, setForecastResults] = useState(null);
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
        { _id: '1', name: 'Harold', markets: [{ _id: '1' }], isActive: true },
        { _id: '2', name: 'Chris', markets: [{ _id: '1' }], isActive: true },
        { _id: '3', name: 'Jeff', markets: [{ _id: '1' }], isActive: true },
        { _id: '4', name: 'Leonora', markets: [{ _id: '1' }], isActive: true },
        { _id: '5', name: 'Arlene', markets: [{ _id: '2' }], isActive: true },
        { _id: '6', name: 'Devin', markets: [{ _id: '2' }], isActive: true }
      ]);
      
      setSelectedMarket('1'); // Default to first market
      setReviewerCount(4); // Default to 4 reviewers
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      calculateForecast();
    }
  }, [loading, tabValue, jobVolume, avgHoursPerJob, avgHoursPerWeek, reviewerCount, startDate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarketChange = (event) => {
    setSelectedMarket(event.target.value);
  };

  const handleJobVolumeChange = (event, newValue) => {
    setJobVolume(newValue);
  };

  const handleAvgHoursPerJobChange = (event, newValue) => {
    setAvgHoursPerJob(newValue);
  };

  const handleAvgHoursPerWeekChange = (event, newValue) => {
    setAvgHoursPerWeek(newValue);
  };

  const handleReviewerCountChange = (event, newValue) => {
    setReviewerCount(newValue);
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const calculateForecast = () => {
    // In a real app, this would call the API to calculate forecasts
    // For now, we'll generate mock data
    
    // Calculate total hours needed
    const totalHoursNeeded = jobVolume * avgHoursPerJob;
    
    // Calculate working days needed based on reviewer count and hours per week
    const hoursPerDay = reviewerCount * (avgHoursPerWeek / 5); // Assuming 5-day work week
    const workingDaysNeeded = Math.ceil(totalHoursNeeded / hoursPerDay);
    
    // Calculate completion date
    const completionDate = new Date(startDate);
    let daysAdded = 0;
    while (daysAdded < workingDaysNeeded) {
      completionDate.setDate(completionDate.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (completionDate.getDay() !== 0 && completionDate.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    // Calculate staffing needs for different timeframes
    const staffingNeeds = {
      day: Math.ceil(totalHoursNeeded / 8), // Assuming 8-hour workday
      week: Math.ceil(totalHoursNeeded / avgHoursPerWeek),
      month: Math.ceil(totalHoursNeeded / (avgHoursPerWeek * 4)) // Assuming 4 weeks in a month
    };
    
    // Generate forecast data based on the selected tab
    let forecastData;
    
    switch (tabValue) {
      case 0: // Completion Date Forecast
        forecastData = {
          completionDate: completionDate,
          workingDaysNeeded: workingDaysNeeded,
          totalHoursNeeded: totalHoursNeeded,
          dailyCapacity: hoursPerDay,
          timeline: {
            labels: Array.from({ length: 5 }, (_, i) => {
              const date = new Date(startDate);
              date.setDate(date.getDate() + i * Math.ceil(workingDaysNeeded / 4));
              return format(date, 'MMM d');
            }),
            datasets: [
              {
                label: 'Projected Completion (%)',
                data: [0, 25, 50, 75, 100],
                borderColor: '#4C8AC3',
                backgroundColor: 'rgba(76, 138, 195, 0.2)',
                fill: true,
              }
            ]
          },
          jobsPerDay: {
            labels: ['Current Rate', 'Required Rate', 'Optimal Rate'],
            datasets: [
              {
                label: 'Jobs Per Day',
                data: [
                  (reviewerCount * avgHoursPerWeek / 5) / avgHoursPerJob, // Current rate
                  jobVolume / workingDaysNeeded, // Required rate
                  (reviewerCount * avgHoursPerWeek / 5) / (avgHoursPerJob * 0.9) // Optimal rate (10% efficiency improvement)
                ],
                backgroundColor: ['#4C8AC3', '#f44336', '#4caf50'],
              }
            ]
          }
        };
        break;
        
      case 1: // Staffing Needs Forecast
        forecastData = {
          staffingNeeds: staffingNeeds,
          currentReviewers: reviewerCount,
          optimalReviewers: Math.ceil(totalHoursNeeded / (avgHoursPerWeek * (workingDaysNeeded / 5))),
          staffingByTimeframe: {
            labels: ['Daily', 'Weekly', 'Monthly'],
            datasets: [
              {
                label: 'Reviewers Needed',
                data: [staffingNeeds.day, staffingNeeds.week, staffingNeeds.month],
                backgroundColor: '#4C8AC3',
              }
            ]
          },
          staffingScenarios: {
            labels: ['Current Staff', '+1 Reviewer', '+2 Reviewers', '+3 Reviewers'],
            datasets: [
              {
                label: 'Days to Complete',
                data: [
                  workingDaysNeeded,
                  Math.ceil(totalHoursNeeded / ((reviewerCount + 1) * (avgHoursPerWeek / 5))),
                  Math.ceil(totalHoursNeeded / ((reviewerCount + 2) * (avgHoursPerWeek / 5))),
                  Math.ceil(totalHoursNeeded / ((reviewerCount + 3) * (avgHoursPerWeek / 5)))
                ],
                backgroundColor: '#4C8AC3',
              }
            ]
          }
        };
        break;
        
      case 2: // Capacity Planning
        // Generate capacity data for next 12 weeks
        const weeklyLabels = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i * 7);
          return `Week ${i+1}`;
        });
        
        // Generate random job volumes with an upward trend
        const weeklyJobVolumes = Array.from({ length: 12 }, (_, i) => 
          Math.floor(jobVolume * (1 + i * 0.05) * (0.9 + Math.random() * 0.2))
        );
        
        // Calculate capacity with current staff
        const weeklyCapacity = Array.from({ length: 12 }, () => 
          reviewerCount * avgHoursPerWeek / avgHoursPerJob
        );
        
        // Calculate optimal staff for each week
        const optimalStaff = weeklyJobVolumes.map(volume => 
          Math.ceil((volume * avgHoursPerJob) / avgHoursPerWeek)
        );
        
        forecastData = {
          weeklyCapacity: {
            labels: weeklyLabels,
            datasets: [
              {
                label: 'Projected Job Volume',
                data: weeklyJobVolumes,
                borderColor: '#f44336',
                backgroundColor: 'transparent',
                type: 'line',
                yAxisID: 'y',
              },
              {
                label: 'Current Capacity',
                data: weeklyCapacity,
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                type: 'line',
                yAxisID: 'y',
              }
            ]
          },
          optimalStaffing: {
            labels: weeklyLabels,
            datasets: [
              {
                label: 'Optimal Staff Count',
                data: optimalStaff,
                backgroundColor: '#4C8AC3',
              }
            ]
          },
          capacityGap: weeklyJobVolumes.map((volume, i) => ({
            week: `Week ${i+1}`,
            jobVolume: volume,
            capacity: weeklyCapacity[i],
            gap: volume - weeklyCapacity[i],
            additionalStaffNeeded: Math.max(0, Math.ceil((volume - weeklyCapacity[i]) * avgHoursPerJob / avgHoursPerWeek))
          }))
        };
        break;
        
      default:
        forecastData = {};
    }
    
    setForecastResults(forecastData);
  };

  const handleRecalculate = () => {
    calculateForecast();
    setSnackbar({
      open: true,
      message: 'Forecast recalculated successfully',
      severity: 'success'
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
          Forecasting & Capacity Planning
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<CalculateIcon />}
          onClick={handleRecalculate}
        >
          Recalculate
        </Button>
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
          <Tab icon={<EventIcon />} label="Completion Date" />
          <Tab icon={<PeopleIcon />} label="Staffing Needs" />
          <Tab icon={<TrendingUpIcon />} label="Capacity Planning" />
        </Tabs>
      </Paper>

      {/* Parameters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Forecast Parameters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="market-label">Market</InputLabel>
              <Select
                labelId="market-label"
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
            
            <Box sx={{ mb: 2 }}>
              <Typography id="job-volume-slider" gutterBottom>
                Job Volume: {jobVolume}
              </Typography>
              <Slider
                value={jobVolume}
                onChange={handleJobVolumeChange}
                aria-labelledby="job-volume-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={500}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography id="hours-per-job-slider" gutterBottom>
                Average Hours Per Job: {avgHoursPerJob}
              </Typography>
              <Slider
                value={avgHoursPerJob}
                onChange={handleAvgHoursPerJobChange}
                aria-labelledby="hours-per-job-slider"
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={0.5}
                max={8}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography id="hours-per-week-slider" gutterBottom>
                Average Hours Per Week: {avgHoursPerWeek}
              </Typography>
              <Slider
                value={avgHoursPerWeek}
                onChange={handleAvgHoursPerWeekChange}
                aria-labelledby="hours-per-week-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={20}
                max={50}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography id="reviewer-count-slider" gutterBottom>
                Number of Reviewers: {reviewerCount}
              </Typography>
              <Slider
                value={reviewerCount}
                onChange={handleReviewerCountChange}
                aria-labelledby="reviewer-count-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={20}
              />
            </Box>
            
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
        </Grid>
      </Paper>

      {/* Forecast Results */}
      {forecastResults ? (
        <Box>
          {/* Completion Date Forecast */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Completion Date Forecast" 
                    subheader={`For ${jobVolume} jobs with ${reviewerCount} reviewers`}
                  />
                  <Divider />
                  <CardContent>
                    <Typography variant="h5" color="primary" gutterBottom>
                      Estimated Completion: {format(forecastResults.completionDate, 'MMMM d, yyyy')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Working Days Required: {forecastResults.workingDaysNeeded} days
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Total Hours Needed: {forecastResults.totalHoursNeeded} hours
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Daily Capacity: {forecastResults.dailyCapacity.toFixed(1)} hours ({(forecastResults.dailyCapacity / avgHoursPerJob).toFixed(1)} jobs)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Based on {reviewerCount} reviewers working {avgHoursPerWeek} hours per week with an average of {avgHoursPerJob} hours per job.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Completion Timeline
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line 
                      data={forecastResults.timeline} 
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
                    Jobs Per Day Analysis
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={forecastResults.jobsPerDay} 
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
                    What-If Scenarios
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Scenario</TableCell>
                          <TableCell align="right">Completion Date</TableCell>
                          <TableCell align="right">Working Days</TableCell>
                          <TableCell align="right">Change</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Current Plan</TableCell>
                          <TableCell align="right">{format(forecastResults.completionDate, 'MMM d, yyyy')}</TableCell>
                          <TableCell align="right">{forecastResults.workingDaysNeeded}</TableCell>
                          <TableCell align="right">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Add 1 Reviewer</TableCell>
                          <TableCell align="right">
                            {format(
                              addDays(
                                startDate, 
                                Math.ceil(forecastResults.totalHoursNeeded / ((reviewerCount + 1) * (avgHoursPerWeek / 5))) * 1.4
                              ), 
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {Math.ceil(forecastResults.totalHoursNeeded / ((reviewerCount + 1) * (avgHoursPerWeek / 5)))}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'success.main' }}>
                            {`-${Math.round((1 - (forecastResults.totalHoursNeeded / ((reviewerCount + 1) * (avgHoursPerWeek / 5))) / forecastResults.workingDaysNeeded) * 100)}%`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Increase Hours/Week by 10%</TableCell>
                          <TableCell align="right">
                            {format(
                              addDays(
                                startDate, 
                                Math.ceil(forecastResults.totalHoursNeeded / (reviewerCount * ((avgHoursPerWeek * 1.1) / 5))) * 1.4
                              ), 
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {Math.ceil(forecastResults.totalHoursNeeded / (reviewerCount * ((avgHoursPerWeek * 1.1) / 5)))}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'success.main' }}>
                            {`-${Math.round((1 - (forecastResults.totalHoursNeeded / (reviewerCount * ((avgHoursPerWeek * 1.1) / 5))) / forecastResults.workingDaysNeeded) * 100)}%`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Reduce Hours/Job by 10%</TableCell>
                          <TableCell align="right">
                            {format(
                              addDays(
                                startDate, 
                                Math.ceil((forecastResults.totalHoursNeeded * 0.9) / (reviewerCount * (avgHoursPerWeek / 5))) * 1.4
                              ), 
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {Math.ceil((forecastResults.totalHoursNeeded * 0.9) / (reviewerCount * (avgHoursPerWeek / 5)))}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'success.main' }}>
                            {`-${Math.round((1 - ((forecastResults.totalHoursNeeded * 0.9) / (reviewerCount * (avgHoursPerWeek / 5))) / forecastResults.workingDaysNeeded) * 100)}%`}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Staffing Needs Forecast */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Staffing Needs Forecast" 
                    subheader={`For ${jobVolume} jobs at ${avgHoursPerJob} hours per job`}
                  />
                  <Divider />
                  <CardContent>
                    <Typography variant="h5" color="primary" gutterBottom>
                      Optimal Staff Count: {forecastResults.optimalReviewers} reviewers
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Current Staff: {forecastResults.currentReviewers} reviewers
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Staff Gap: {Math.max(0, forecastResults.optimalReviewers - forecastResults.currentReviewers)} additional reviewers needed
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Total Hours Needed: {forecastResults.totalHoursNeeded} hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Based on reviewers working {avgHoursPerWeek} hours per week with an average of {avgHoursPerJob} hours per job.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Staffing Needs by Timeframe
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={forecastResults.staffingByTimeframe} 
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
                    Completion Time by Staffing Level
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={forecastResults.staffingScenarios} 
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
                    Staffing Scenarios
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Scenario</TableCell>
                          <TableCell align="right">Staff Count</TableCell>
                          <TableCell align="right">Jobs Per Day</TableCell>
                          <TableCell align="right">Days to Complete</TableCell>
                          <TableCell align="right">Completion Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Current Staff</TableCell>
                          <TableCell align="right">{reviewerCount}</TableCell>
                          <TableCell align="right">{((reviewerCount * avgHoursPerWeek / 5) / avgHoursPerJob).toFixed(1)}</TableCell>
                          <TableCell align="right">{Math.ceil(jobVolume / ((reviewerCount * avgHoursPerWeek / 5) / avgHoursPerJob))}</TableCell>
                          <TableCell align="right">
                            {format(
                              addDays(
                                startDate, 
                                Math.ceil(jobVolume / ((reviewerCount * avgHoursPerWeek / 5) / avgHoursPerJob)) * 1.4
                              ), 
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Optimal Staff</TableCell>
                          <TableCell align="right">{forecastResults.optimalReviewers}</TableCell>
                          <TableCell align="right">{((forecastResults.optimalReviewers * avgHoursPerWeek / 5) / avgHoursPerJob).toFixed(1)}</TableCell>
                          <TableCell align="right">{Math.ceil(jobVolume / ((forecastResults.optimalReviewers * avgHoursPerWeek / 5) / avgHoursPerJob))}</TableCell>
                          <TableCell align="right">
                            {format(
                              addDays(
                                startDate, 
                                Math.ceil(jobVolume / ((forecastResults.optimalReviewers * avgHoursPerWeek / 5) / avgHoursPerJob)) * 1.4
                              ), 
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Minimum Staff (1 month)</TableCell>
                          <TableCell align="right">{forecastResults.staffingNeeds.month}</TableCell>
                          <TableCell align="right">{((forecastResults.staffingNeeds.month * avgHoursPerWeek / 5) / avgHoursPerJob).toFixed(1)}</TableCell>
                          <TableCell align="right">{Math.ceil(jobVolume / ((forecastResults.staffingNeeds.month * avgHoursPerWeek / 5) / avgHoursPerJob))}</TableCell>
                          <TableCell align="right">
                            {format(
                              addDays(
                                startDate, 
                                Math.ceil(jobVolume / ((forecastResults.staffingNeeds.month * avgHoursPerWeek / 5) / avgHoursPerJob)) * 1.4
                              ), 
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Maximum Efficiency</TableCell>
                          <TableCell align="right">{Math.ceil(forecastResults.optimalReviewers * 1.2)}</TableCell>
                          <TableCell align="right">{((Math.ceil(forecastResults.optimalReviewers * 1.2) * avgHoursPerWeek / 5) / avgHoursPerJob).toFixed(1)}</TableCell>
                          <TableCell align="right">{Math.ceil(jobVolume / ((Math.ceil(forecastResults.optimalReviewers * 1.2) * avgHoursPerWeek / 5) / avgHoursPerJob))}</TableCell>
                          <TableCell align="right">
                            {format(
                              addDays(
                                startDate, 
                                Math.ceil(jobVolume / ((Math.ceil(forecastResults.optimalReviewers * 1.2) * avgHoursPerWeek / 5) / avgHoursPerJob)) * 1.4
                              ), 
                              'MMM d, yyyy'
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Capacity Planning */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    12-Week Capacity Forecast
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Bar 
                      data={forecastResults.weeklyCapacity} 
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
                          y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                              display: true,
                              text: 'Job Count'
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
                    Optimal Staffing by Week
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={forecastResults.optimalStaffing} 
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
                    Capacity Gap Analysis
                  </Typography>
                  <TableContainer sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Job Volume</TableCell>
                          <TableCell align="right">Capacity</TableCell>
                          <TableCell align="right">Gap</TableCell>
                          <TableCell align="right">Additional Staff</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {forecastResults.capacityGap.map((row) => (
                          <TableRow key={row.week}>
                            <TableCell component="th" scope="row">
                              {row.week}
                            </TableCell>
                            <TableCell align="right">{row.jobVolume}</TableCell>
                            <TableCell align="right">{row.capacity.toFixed(1)}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: row.gap > 0 ? 'error.main' : 'success.main',
                              fontWeight: row.gap > 0 ? 'bold' : 'normal'
                            }}>
                              {row.gap > 0 ? `+${row.gap.toFixed(1)}` : row.gap.toFixed(1)}
                            </TableCell>
                            <TableCell align="right">
                              {row.additionalStaffNeeded > 0 ? row.additionalStaffNeeded : '-'}
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
                    title="Capacity Planning Summary" 
                    subheader={`Based on current parameters and projected job volumes`}
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                          Short-term (4 weeks)
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Average Weekly Volume: {Math.round(forecastResults.capacityGap.slice(0, 4).reduce((sum, row) => sum + row.jobVolume, 0) / 4)} jobs
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Current Capacity: {Math.round(reviewerCount * avgHoursPerWeek / avgHoursPerJob)} jobs/week
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ 
                          color: forecastResults.capacityGap.slice(0, 4).some(row => row.gap > 0) ? 'error.main' : 'success.main',
                          fontWeight: 'bold'
                        }}>
                          Status: {forecastResults.capacityGap.slice(0, 4).some(row => row.gap > 0) ? 'Understaffed' : 'Adequate'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                          Mid-term (8 weeks)
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Average Weekly Volume: {Math.round(forecastResults.capacityGap.slice(4, 8).reduce((sum, row) => sum + row.jobVolume, 0) / 4)} jobs
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Recommended Staff: {Math.max(reviewerCount, Math.ceil(forecastResults.capacityGap.slice(4, 8).reduce((max, row) => Math.max(max, row.jobVolume * avgHoursPerJob / avgHoursPerWeek), 0)))}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Hiring Needed: {Math.max(0, Math.ceil(forecastResults.capacityGap.slice(4, 8).reduce((max, row) => Math.max(max, row.jobVolume * avgHoursPerJob / avgHoursPerWeek), 0)) - reviewerCount)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                          Long-term (12 weeks)
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Average Weekly Volume: {Math.round(forecastResults.capacityGap.slice(8, 12).reduce((sum, row) => sum + row.jobVolume, 0) / 4)} jobs
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Recommended Staff: {Math.max(reviewerCount, Math.ceil(forecastResults.capacityGap.slice(8, 12).reduce((max, row) => Math.max(max, row.jobVolume * avgHoursPerJob / avgHoursPerWeek), 0)))}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          Hiring Needed: {Math.max(0, Math.ceil(forecastResults.capacityGap.slice(8, 12).reduce((max, row) => Math.max(max, row.jobVolume * avgHoursPerJob / avgHoursPerWeek), 0)) - reviewerCount)}
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
            No forecast data available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please adjust your parameters and click Recalculate
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

export default Forecasting;
