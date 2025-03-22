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
  Slider,
  Tooltip
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
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
import TuneIcon from '@mui/icons-material/Tune';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

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

const CapacityPlanning = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [forecastPeriod, setForecastPeriod] = useState('3months');
  const [markets, setMarkets] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [planningData, setPlanningData] = useState(null);
  
  // Capacity planning parameters
  const [avgHoursPerJob, setAvgHoursPerJob] = useState(3);
  const [avgHoursPerWeek, setAvgHoursPerWeek] = useState(40);
  const [expectedGrowthRate, setExpectedGrowthRate] = useState(5);
  const [efficiencyFactor, setEfficiencyFactor] = useState(80);
  const [vacationPercentage, setVacationPercentage] = useState(10);
  const [trainingHours, setTrainingHours] = useState(4);

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
      generateCapacityPlan();
    }
  }, [
    loading, 
    selectedMarket, 
    forecastPeriod, 
    tabValue, 
    avgHoursPerJob, 
    avgHoursPerWeek, 
    expectedGrowthRate, 
    efficiencyFactor,
    vacationPercentage,
    trainingHours
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarketChange = (event) => {
    setSelectedMarket(event.target.value);
  };

  const handleForecastPeriodChange = (event) => {
    setForecastPeriod(event.target.value);
  };

  const generateCapacityPlan = () => {
    // In a real app, this would fetch capacity planning data from the API
    // For now, we'll generate mock data
    
    // Generate time periods based on forecast period
    let periods = [];
    const today = new Date();
    
    switch (forecastPeriod) {
      case '1month':
        periods = Array.from({ length: 4 }, (_, i) => {
          const date = addWeeks(today, i);
          return {
            label: `Week ${i + 1}`,
            startDate: format(date, 'MMM d'),
            endDate: format(addDays(date, 6), 'MMM d')
          };
        });
        break;
      case '3months':
        periods = Array.from({ length: 12 }, (_, i) => {
          const date = addWeeks(today, i);
          return {
            label: `Week ${i + 1}`,
            startDate: format(date, 'MMM d'),
            endDate: format(addDays(date, 6), 'MMM d')
          };
        });
        break;
      case '6months':
        periods = Array.from({ length: 6 }, (_, i) => {
          const date = addMonths(today, i);
          return {
            label: format(date, 'MMM yyyy'),
            startDate: format(date, 'MMM d'),
            endDate: format(addDays(addMonths(date, 1), -1), 'MMM d')
          };
        });
        break;
      case '1year':
        periods = Array.from({ length: 12 }, (_, i) => {
          const date = addMonths(today, i);
          return {
            label: format(date, 'MMM yyyy'),
            startDate: format(date, 'MMM d'),
            endDate: format(addDays(addMonths(date, 1), -1), 'MMM d')
          };
        });
        break;
      default:
        periods = Array.from({ length: 12 }, (_, i) => {
          const date = addWeeks(today, i);
          return {
            label: `Week ${i + 1}`,
            startDate: format(date, 'MMM d'),
            endDate: format(addDays(date, 6), 'MMM d')
          };
        });
    }
    
    // Generate mock data based on the selected tab
    let mockData;
    
    switch (tabValue) {
      case 0: // Workload Forecast
        // Generate workload forecast data
        const baseJobVolume = selectedMarket === '1' ? 45 : 35; // Different base volume for different markets
        const workloadForecast = periods.map((period, i) => {
          // Apply growth rate to job volume
          const growthFactor = 1 + (expectedGrowthRate / 100) * (i / periods.length);
          const jobVolume = Math.round(baseJobVolume * growthFactor);
          
          // Calculate hours needed based on job volume and avg hours per job
          const hoursNeeded = jobVolume * avgHoursPerJob;
          
          // Calculate staff needed based on hours needed and avg hours per week
          // Adjust for efficiency factor
          const effectiveHoursPerWeek = avgHoursPerWeek * (efficiencyFactor / 100);
          const staffNeeded = Math.ceil(hoursNeeded / effectiveHoursPerWeek);
          
          // Adjust for vacation and training
          const adjustedStaffNeeded = Math.ceil(staffNeeded * (1 + vacationPercentage / 100) + (trainingHours / avgHoursPerWeek));
          
          return {
            period: period.label,
            jobVolume,
            hoursNeeded,
            staffNeeded: adjustedStaffNeeded
          };
        });
        
        mockData = {
          workloadForecast,
          workloadChartData: {
            labels: periods.map(p => p.label),
            datasets: [
              {
                label: 'Job Volume',
                data: workloadForecast.map(w => w.jobVolume),
                backgroundColor: '#4C8AC3',
                yAxisID: 'y'
              },
              {
                label: 'Staff Needed',
                data: workloadForecast.map(w => w.staffNeeded),
                backgroundColor: '#f44336',
                yAxisID: 'y1'
              }
            ]
          },
          hoursChartData: {
            labels: periods.map(p => p.label),
            datasets: [
              {
                label: 'Hours Needed',
                data: workloadForecast.map(w => w.hoursNeeded),
                backgroundColor: '#4C8AC3'
              }
            ]
          },
          currentCapacity: {
            currentStaff: selectedMarket === '1' ? 8 : 6,
            avgProductivity: (avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob).toFixed(1),
            maxWeeklyCapacity: Math.floor((selectedMarket === '1' ? 8 : 6) * avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob),
            utilizationRate: Math.min(100, Math.round((baseJobVolume / Math.floor((selectedMarket === '1' ? 8 : 6) * avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob)) * 100)) + '%'
          },
          capacityGap: workloadForecast.map((w, i) => {
            const currentCapacity = Math.floor((selectedMarket === '1' ? 8 : 6) * avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob);
            return {
              period: w.period,
              jobVolume: w.jobVolume,
              capacity: currentCapacity,
              gap: w.jobVolume - currentCapacity,
              gapPercentage: Math.round(((w.jobVolume - currentCapacity) / currentCapacity) * 100) + '%'
            };
          })
        };
        break;
        
      case 1: // Staffing Plan
        // Generate staffing plan data
        const baseStaff = selectedMarket === '1' ? 8 : 6;
        const currentReviewers = reviewers.filter(r => r.markets.some(m => m._id === selectedMarket));
        
        // Calculate baseline productivity
        const baselineProductivity = avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob;
        
        // Generate staffing plan for each period
        const staffingPlan = periods.map((period, i) => {
          // Apply growth rate to job volume
          const growthFactor = 1 + (expectedGrowthRate / 100) * (i / periods.length);
          const jobVolume = Math.round((selectedMarket === '1' ? 45 : 35) * growthFactor);
          
          // Calculate required staff
          const requiredStaff = Math.ceil(jobVolume / baselineProductivity);
          
          // Adjust for vacation and training
          const adjustedRequiredStaff = Math.ceil(requiredStaff * (1 + vacationPercentage / 100) + (trainingHours / avgHoursPerWeek));
          
          // Calculate staffing gap
          const staffingGap = adjustedRequiredStaff - baseStaff;
          
          return {
            period: period.label,
            jobVolume,
            requiredStaff: adjustedRequiredStaff,
            currentStaff: baseStaff,
            staffingGap,
            action: staffingGap > 0 ? 'Hire' : staffingGap < 0 ? 'Optimize' : 'Maintain'
          };
        });
        
        // Generate hiring plan
        const hiringPlan = [];
        let cumulativeHires = 0;
        
        staffingPlan.forEach((plan, i) => {
          if (plan.staffingGap > 0 && i > 0) {
            // Only add to hiring plan if there's a gap and not the first period
            const previousPlan = hiringPlan[hiringPlan.length - 1] || { cumulativeHires: 0 };
            const newHires = Math.max(0, plan.staffingGap - previousPlan.cumulativeHires);
            
            if (newHires > 0) {
              cumulativeHires += newHires;
              hiringPlan.push({
                period: plan.period,
                newHires,
                cumulativeHires,
                startDate: periods[i].startDate,
                jobVolume: plan.jobVolume
              });
            }
          }
        });
        
        mockData = {
          staffingPlan,
          staffingChartData: {
            labels: periods.map(p => p.label),
            datasets: [
              {
                label: 'Required Staff',
                data: staffingPlan.map(s => s.requiredStaff),
                backgroundColor: '#4C8AC3'
              },
              {
                label: 'Current Staff',
                data: staffingPlan.map(s => s.currentStaff),
                backgroundColor: '#f44336',
                borderWidth: 0
              }
            ]
          },
          staffingGapChartData: {
            labels: periods.map(p => p.label),
            datasets: [
              {
                label: 'Staffing Gap',
                data: staffingPlan.map(s => s.staffingGap),
                backgroundColor: staffingPlan.map(s => s.staffingGap > 0 ? '#f44336' : s.staffingGap < 0 ? '#4caf50' : '#ff9800')
              }
            ]
          },
          currentTeam: {
            totalReviewers: currentReviewers.length,
            avgProductivity: baselineProductivity.toFixed(1) + ' jobs/week',
            utilizationRate: Math.min(100, Math.round(((selectedMarket === '1' ? 45 : 35) / (baseStaff * baselineProductivity)) * 100)) + '%',
            reviewers: currentReviewers.map(r => r.name).join(', ')
          },
          hiringPlan,
          costAnalysis: {
            currentAnnualCost: baseStaff * 75000, // Assuming $75k per reviewer
            projectedAnnualCost: (baseStaff + (hiringPlan.length > 0 ? hiringPlan[hiringPlan.length - 1].cumulativeHires : 0)) * 75000,
            costPerJob: ((baseStaff * 75000) / ((selectedMarket === '1' ? 45 : 35) * 52)).toFixed(2),
            roi: '125%' // Mock ROI
          }
        };
        break;
        
      case 2: // Scenario Planning
        // Generate scenario planning data
        const baseScenarioJobVolume = selectedMarket === '1' ? 45 : 35;
        
        // Define scenarios
        const scenarios = [
          {
            name: 'Base Case',
            growthRate: expectedGrowthRate,
            efficiencyFactor: efficiencyFactor,
            color: '#4C8AC3'
          },
          {
            name: 'High Growth',
            growthRate: expectedGrowthRate * 1.5,
            efficiencyFactor: efficiencyFactor,
            color: '#f44336'
          },
          {
            name: 'Efficiency Improvement',
            growthRate: expectedGrowthRate,
            efficiencyFactor: Math.min(100, efficiencyFactor * 1.2),
            color: '#4caf50'
          },
          {
            name: 'Worst Case',
            growthRate: expectedGrowthRate * 2,
            efficiencyFactor: efficiencyFactor * 0.9,
            color: '#ff9800'
          }
        ];
        
        // Generate data for each scenario
        const scenarioData = scenarios.map(scenario => {
          return periods.map((period, i) => {
            // Apply growth rate to job volume
            const growthFactor = 1 + (scenario.growthRate / 100) * (i / periods.length);
            const jobVolume = Math.round(baseScenarioJobVolume * growthFactor);
            
            // Calculate required staff based on scenario parameters
            const effectiveHoursPerWeek = avgHoursPerWeek * (scenario.efficiencyFactor / 100);
            const baselineProductivity = effectiveHoursPerWeek / avgHoursPerJob;
            const requiredStaff = Math.ceil(jobVolume / baselineProductivity);
            
            // Adjust for vacation and training
            const adjustedRequiredStaff = Math.ceil(requiredStaff * (1 + vacationPercentage / 100) + (trainingHours / avgHoursPerWeek));
            
            return {
              period: period.label,
              jobVolume,
              requiredStaff: adjustedRequiredStaff
            };
          });
        });
        
        // Prepare chart data for scenarios
        const scenarioChartData = {
          labels: periods.map(p => p.label),
          datasets: scenarios.map((scenario, i) => ({
            label: scenario.name,
            data: scenarioData[i].map(d => d.requiredStaff),
            backgroundColor: scenario.color,
            borderColor: scenario.color,
            borderWidth: 2,
            fill: false,
            tension: 0.1
          }))
        };
        
        // Generate contingency plans
        const contingencyPlans = [
          {
            trigger: 'Job volume exceeds base case by 20%',
            actions: [
              'Implement overtime for existing staff',
              'Accelerate hiring plan by 30 days',
              'Cross-train team members from other markets'
            ],
            timeline: '2 weeks',
            impact: 'Can handle up to 30% volume increase'
          },
          {
            trigger: 'Efficiency drops below 70%',
            actions: [
              'Conduct targeted training sessions',
              'Review and optimize workflows',
              'Implement temporary support from senior staff'
            ],
            timeline: '1 month',
            impact: 'Restore efficiency to at least 80%'
          },
          {
            trigger: 'Staff turnover exceeds 15%',
            actions: [
              'Implement retention incentives',
              'Accelerate recruitment pipeline',
              'Develop knowledge transfer protocols'
            ],
            timeline: '3 months',
            impact: 'Minimize productivity impact of turnover'
          }
        ];
        
        mockData = {
          scenarios,
          scenarioData,
          scenarioChartData,
          scenarioComparison: scenarios.map((scenario, i) => {
            const peakStaff = Math.max(...scenarioData[i].map(d => d.requiredStaff));
            const endStaff = scenarioData[i][scenarioData[i].length - 1].requiredStaff;
            const baseScenarioPeakStaff = Math.max(...scenarioData[0].map(d => d.requiredStaff));
            
            return {
              scenario: scenario.name,
              peakStaffNeeded: peakStaff,
              endStaffNeeded: endStaff,
              percentDifference: Math.round(((peakStaff - baseScenarioPeakStaff) / baseScenarioPeakStaff) * 100) + '%',
              riskLevel: scenario.name === 'Base Case' ? 'Medium' : 
                         scenario.name === 'High Growth' ? 'High' : 
                         scenario.name === 'Efficiency Improvement' ? 'Low' : 'Very High'
            };
          }),
          contingencyPlans,
          sensitivityAnalysis: [
            {
              factor: 'Growth Rate',
              impact: 'High',
              description: `Each 1% change in growth rate changes staffing needs by approximately ${Math.round(baseScenarioJobVolume * 0.01 / (avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob) * 10) / 10} staff members by end of forecast period.`
            },
            {
              factor: 'Efficiency Factor',
              impact: 'High',
              description: `Each 5% improvement in efficiency reduces staffing needs by approximately ${Math.round(baseScenarioJobVolume / (avgHoursPerWeek * ((efficiencyFactor + 5) / 100) / avgHoursPerJob) - baseScenarioJobVolume / (avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob))} staff members.`
            },
            {
              factor: 'Avg Hours Per Job',
              impact: 'Medium',
              description: `Each 0.5 hour reduction in average processing time increases capacity by approximately ${Math.round((avgHoursPerWeek * (efficiencyFactor / 100) / (avgHoursPerJob - 0.5) - avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob) * baseStaff)} jobs per week.`
            },
            {
              factor: 'Vacation Percentage',
              impact: 'Low',
              description: 'Each 5% increase in vacation time requires approximately 0.4 additional staff members to maintain capacity.'
            }
          ]
        };
        break;
        
      default:
        mockData = {};
    }
    
    setPlanningData(mockData);
  };

  const handleExportPlan = (format) => {
    // In a real app, this would generate and download a capacity plan
    alert(`Capacity plan exported as ${format.toUpperCase()} successfully`);
  };

  const handlePrintPlan = () => {
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
          Capacity Planning
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportPlan('pdf')}
            sx={{ mr: 1 }}
          >
            Export PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => handleExportPlan('excel')}
            sx={{ mr: 1 }}
          >
            Export Excel
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrintPlan}
            className="no-print"
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Planning Type Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          aria-label="planning tabs"
        >
          <Tab icon={<AssignmentIcon />} label="Workload Forecast" />
          <Tab icon={<PeopleIcon />} label="Staffing Plan" />
          <Tab icon={<TuneIcon />} label="Scenario Planning" />
        </Tabs>
      </Paper>

      {/* Filters and Parameters */}
      <Paper sx={{ p: 2, mb: 3 }} className="no-print">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="forecast-period-label">Forecast Period</InputLabel>
                  <Select
                    labelId="forecast-period-label"
                    value={forecastPeriod}
                    onChange={handleForecastPeriodChange}
                    label="Forecast Period"
                  >
                    <MenuItem value="1month">1 Month</MenuItem>
                    <MenuItem value="3months">3 Months</MenuItem>
                    <MenuItem value="6months">6 Months</MenuItem>
                    <MenuItem value="1year">1 Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <TuneIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Capacity Parameters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" gutterBottom>
                  Avg Hours Per Job
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={avgHoursPerJob}
                    onChange={(e, newValue) => setAvgHoursPerJob(newValue)}
                    min={1}
                    max={10}
                    step={0.5}
                    valueLabelDisplay="auto"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2">{avgHoursPerJob}h</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" gutterBottom>
                  Avg Hours Per Week
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={avgHoursPerWeek}
                    onChange={(e, newValue) => setAvgHoursPerWeek(newValue)}
                    min={20}
                    max={50}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2">{avgHoursPerWeek}h</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" gutterBottom>
                  Growth Rate (%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={expectedGrowthRate}
                    onChange={(e, newValue) => setExpectedGrowthRate(newValue)}
                    min={-10}
                    max={30}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2">{expectedGrowthRate}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" gutterBottom>
                  Efficiency Factor (%)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={efficiencyFactor}
                    onChange={(e, newValue) => setEfficiencyFactor(newValue)}
                    min={50}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2">{efficiencyFactor}%</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Additional parameters */}
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Additional Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Vacation/PTO (%)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={vacationPercentage}
                      onChange={(e, newValue) => setVacationPercentage(newValue)}
                      min={0}
                      max={30}
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{ mr: 2 }}
                    />
                    <Typography variant="body2">{vacationPercentage}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Training Hours/Week
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={trainingHours}
                      onChange={(e, newValue) => setTrainingHours(newValue)}
                      min={0}
                      max={10}
                      step={0.5}
                      valueLabelDisplay="auto"
                      sx={{ mr: 2 }}
                    />
                    <Typography variant="body2">{trainingHours}h</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Calculated Productivity Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2" color="text.secondary">
                      Jobs Per Reviewer Per Week
                    </Typography>
                    <Typography variant="h6">
                      {(avgHoursPerWeek * (efficiencyFactor / 100) / avgHoursPerJob).toFixed(1)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2" color="text.secondary">
                      Effective Hours Per Week
                    </Typography>
                    <Typography variant="h6">
                      {(avgHoursPerWeek * (efficiencyFactor / 100)).toFixed(1)}h
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2" color="text.secondary">
                      Adjusted Capacity Factor
                    </Typography>
                    <Typography variant="h6">
                      {(1 - (vacationPercentage / 100) - (trainingHours / avgHoursPerWeek)).toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Planning Header */}
      <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {tabValue === 0 ? 'Workload Forecast' : tabValue === 1 ? 'Staffing Plan' : 'Scenario Planning'}
        </Typography>
        <Typography variant="subtitle1">
          Market: {markets.find(m => m._id === selectedMarket)?.name || 'All Markets'}
        </Typography>
        <Typography variant="subtitle2">
          Forecast Period: {forecastPeriod === '1month' ? '1 Month' : forecastPeriod === '3months' ? '3 Months' : forecastPeriod === '6months' ? '6 Months' : '1 Year'}
        </Typography>
      </Paper>

      {/* Planning Content */}
      {planningData ? (
        <Box>
          {/* Workload Forecast */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Workload and Staffing Forecast
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Bar 
                      data={planningData.workloadChartData} 
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
                              text: 'Period'
                            }
                          },
                          y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                              display: true,
                              text: 'Job Volume'
                            }
                          },
                          y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                              display: true,
                              text: 'Staff Needed'
                            },
                            grid: {
                              drawOnChartArea: false
                            },
                            min: 0,
                            max: Math.max(...planningData.workloadForecast.map(w => w.staffNeeded)) + 2,
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
                    title="Current Capacity" 
                    subheader="Based on current staffing levels"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          Current Staff: {planningData.currentCapacity.currentStaff}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Avg Productivity: {planningData.currentCapacity.avgProductivity} jobs/week
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Max Weekly Capacity: {planningData.currentCapacity.maxWeeklyCapacity} jobs
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Current Utilization: {planningData.currentCapacity.utilizationRate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ height: 150 }}>
                          <Pie 
                            data={{
                              labels: ['Utilized', 'Available'],
                              datasets: [
                                {
                                  data: [
                                    parseInt(planningData.currentCapacity.utilizationRate), 
                                    100 - parseInt(planningData.currentCapacity.utilizationRate)
                                  ],
                                  backgroundColor: ['#4C8AC3', '#e0e0e0'],
                                  borderWidth: 0
                                }
                              ]
                            }} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                }
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Hours Needed by Period
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <Bar 
                      data={planningData.hoursChartData} 
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
                              text: 'Period'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Hours'
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Capacity Gap Analysis
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Forecasted Job Volume</TableCell>
                          <TableCell align="right">Current Capacity</TableCell>
                          <TableCell align="right">Gap</TableCell>
                          <TableCell align="right">Gap %</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {planningData.capacityGap.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.period}</TableCell>
                            <TableCell align="right">{row.jobVolume}</TableCell>
                            <TableCell align="right">{row.capacity}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: row.gap > 0 ? 'error.main' : row.gap < 0 ? 'success.main' : 'warning.main',
                              fontWeight: 'bold'
                            }}>
                              {row.gap > 0 ? `+${row.gap}` : row.gap}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              color: parseInt(row.gapPercentage) > 0 ? 'error.main' : parseInt(row.gapPercentage) < 0 ? 'success.main' : 'warning.main',
                              fontWeight: 'bold'
                            }}>
                              {row.gapPercentage}
                            </TableCell>
                            <TableCell>
                              {row.gap > 0 ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                                  <TrendingUpIcon sx={{ mr: 1 }} />
                                  Understaffed
                                </Box>
                              ) : row.gap < 0 ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                  <TrendingDownIcon sx={{ mr: 1 }} />
                                  Excess Capacity
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
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
                    title="Workload Forecast Recommendations" 
                    subheader="Based on capacity gap analysis"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Short-term Actions
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            {planningData.capacityGap[0].gap > 0 ? (
                              <>
                                <li>Implement overtime for current staff</li>
                                <li>Prioritize critical jobs</li>
                                <li>Consider temporary reassignments from other markets</li>
                              </>
                            ) : planningData.capacityGap[0].gap < 0 ? (
                              <>
                                <li>Reallocate excess capacity to other markets</li>
                                <li>Accelerate job intake if possible</li>
                                <li>Use available time for training and process improvement</li>
                              </>
                            ) : (
                              <>
                                <li>Maintain current staffing levels</li>
                                <li>Monitor job volume closely</li>
                                <li>Prepare contingency plans for volume fluctuations</li>
                              </>
                            )}
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Medium-term Strategy
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            {planningData.capacityGap[Math.floor(planningData.capacityGap.length / 2)].gap > 0 ? (
                              <>
                                <li>Begin recruitment process for {Math.ceil(planningData.capacityGap[Math.floor(planningData.capacityGap.length / 2)].gap)} additional staff</li>
                                <li>Implement process improvements to increase efficiency</li>
                                <li>Consider cross-training team members</li>
                              </>
                            ) : planningData.capacityGap[Math.floor(planningData.capacityGap.length / 2)].gap < 0 ? (
                              <>
                                <li>Plan for resource reallocation</li>
                                <li>Develop strategy for handling additional work types</li>
                                <li>Consider reducing contractor or temporary staff</li>
                              </>
                            ) : (
                              <>
                                <li>Maintain current staffing levels</li>
                                <li>Focus on efficiency improvements</li>
                                <li>Develop flexible capacity management strategy</li>
                              </>
                            )}
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Long-term Planning
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            {planningData.capacityGap[planningData.capacityGap.length - 1].gap > 0 ? (
                              <>
                                <li>Develop comprehensive hiring plan for {Math.ceil(planningData.capacityGap[planningData.capacityGap.length - 1].gap)} additional staff</li>
                                <li>Consider structural changes to team organization</li>
                                <li>Evaluate technology solutions to improve efficiency</li>
                              </>
                            ) : planningData.capacityGap[planningData.capacityGap.length - 1].gap < 0 ? (
                              <>
                                <li>Develop plan for resource optimization</li>
                                <li>Consider expanding service offerings</li>
                                <li>Evaluate natural attrition vs. active reduction</li>
                              </>
                            ) : (
                              <>
                                <li>Focus on continuous improvement</li>
                                <li>Develop career growth paths for team members</li>
                                <li>Implement advanced forecasting models</li>
                              </>
                            )}
                          </ul>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Staffing Plan */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Staffing Requirements Forecast
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Bar 
                      data={planningData.staffingChartData} 
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
                              text: 'Period'
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
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Staffing Gap Analysis
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={planningData.staffingGapChartData} 
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
                              text: 'Period'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Staffing Gap'
                            },
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
                    title="Current Team Capacity" 
                    subheader={`Market: ${markets.find(m => m._id === selectedMarket)?.name}`}
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>
                          Total Reviewers: {planningData.currentTeam.totalReviewers}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Avg Productivity: {planningData.currentTeam.avgProductivity}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Current Utilization: {planningData.currentTeam.utilizationRate}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Team Members: {planningData.currentTeam.reviewers}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Staffing Status
                          </Typography>
                          {parseInt(planningData.currentTeam.utilizationRate) > 90 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                              <TrendingUpIcon sx={{ mr: 1 }} />
                              <Typography variant="body1" fontWeight="bold">
                                At Capacity - Additional Staff Needed
                              </Typography>
                            </Box>
                          ) : parseInt(planningData.currentTeam.utilizationRate) > 70 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                              <Typography variant="body1" fontWeight="bold">
                                Optimal Utilization
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                              <TrendingDownIcon sx={{ mr: 1 }} />
                              <Typography variant="body1" fontWeight="bold">
                                Excess Capacity Available
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            {parseInt(planningData.currentTeam.utilizationRate) > 90 ? 
                              'Team is operating at maximum capacity. Quality and timeliness may be affected without additional resources.' : 
                              parseInt(planningData.currentTeam.utilizationRate) > 70 ? 
                              'Team is operating at optimal capacity with sufficient bandwidth for quality work.' : 
                              'Team has excess capacity that could be utilized for additional work or process improvements.'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Staffing Plan Details
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Job Volume</TableCell>
                          <TableCell align="right">Required Staff</TableCell>
                          <TableCell align="right">Current Staff</TableCell>
                          <TableCell align="right">Gap</TableCell>
                          <TableCell>Recommended Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {planningData.staffingPlan.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.period}</TableCell>
                            <TableCell align="right">{row.jobVolume}</TableCell>
                            <TableCell align="right">{row.requiredStaff}</TableCell>
                            <TableCell align="right">{row.currentStaff}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: row.staffingGap > 0 ? 'error.main' : row.staffingGap < 0 ? 'success.main' : 'warning.main',
                              fontWeight: 'bold'
                            }}>
                              {row.staffingGap > 0 ? `+${row.staffingGap}` : row.staffingGap}
                            </TableCell>
                            <TableCell>
                              {row.action === 'Hire' ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                                  <TrendingUpIcon sx={{ mr: 1 }} />
                                  Hire {row.staffingGap} Staff
                                </Box>
                              ) : row.action === 'Optimize' ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                  <TrendingDownIcon sx={{ mr: 1 }} />
                                  Optimize Resources
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                                  Maintain Current Staff
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
              
              {planningData.hiringPlan.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader 
                      title="Hiring Plan" 
                      subheader="Based on forecasted staffing needs"
                    />
                    <Divider />
                    <CardContent>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Period</TableCell>
                              <TableCell align="right">New Hires</TableCell>
                              <TableCell align="right">Cumulative Hires</TableCell>
                              <TableCell>Start Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {planningData.hiringPlan.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.period}</TableCell>
                                <TableCell align="right">{row.newHires}</TableCell>
                                <TableCell align="right">{row.cumulativeHires}</TableCell>
                                <TableCell>{row.startDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Hiring Timeline
                        </Typography>
                        <Typography variant="body2">
                          Begin recruitment process at least 60 days before the first required start date. Allow 30 days for onboarding and training before new hires are fully productive.
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              <Grid item xs={12} md={planningData.hiringPlan.length > 0 ? 6 : 12}>
                <Card>
                  <CardHeader 
                    title="Cost Analysis" 
                    subheader="Financial impact of staffing plan"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom>
                          Current Annual Cost: ${planningData.costAnalysis.currentAnnualCost.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Projected Annual Cost: ${planningData.costAnalysis.projectedAnnualCost.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Cost Per Job: ${planningData.costAnalysis.costPerJob}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Estimated ROI: {planningData.costAnalysis.roi}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ height: 150 }}>
                          <Pie 
                            data={{
                              labels: ['Current Cost', 'Additional Cost'],
                              datasets: [
                                {
                                  data: [
                                    planningData.costAnalysis.currentAnnualCost, 
                                    Math.max(0, planningData.costAnalysis.projectedAnnualCost - planningData.costAnalysis.currentAnnualCost)
                                  ],
                                  backgroundColor: ['#4C8AC3', '#f44336'],
                                  borderWidth: 0
                                }
                              ]
                            }} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                }
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Staffing Plan Recommendations" 
                    subheader="Strategic actions based on forecast"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Recruitment Strategy
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            {planningData.hiringPlan.length > 0 ? (
                              <>
                                <li>Begin recruitment for {planningData.hiringPlan[0].newHires} new staff members immediately</li>
                                <li>Prioritize candidates with relevant experience to minimize training time</li>
                                <li>Consider internal transfers from other markets if available</li>
                                <li>Develop accelerated onboarding program to reduce time to productivity</li>
                              </>
                            ) : (
                              <>
                                <li>Maintain current staffing levels</li>
                                <li>Focus on retention of existing team members</li>
                                <li>Develop succession plans for key positions</li>
                                <li>Create talent pipeline for future needs</li>
                              </>
                            )}
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Capacity Optimization
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Implement cross-training program to increase team flexibility</li>
                            <li>Review and optimize current workflows to improve efficiency</li>
                            <li>Consider flexible scheduling to match capacity with demand</li>
                            <li>Develop contingency plans for unexpected volume fluctuations</li>
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Long-term Strategy
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Develop career progression paths to improve retention</li>
                            <li>Invest in technology solutions to improve productivity</li>
                            <li>Consider structural changes to team organization</li>
                            <li>Implement regular capacity planning reviews</li>
                          </ul>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Scenario Planning */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Scenario Comparison
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line 
                      data={planningData.scenarioChartData} 
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
                              text: 'Period'
                            }
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Staff Required'
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
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Scenario Analysis
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Scenario</TableCell>
                          <TableCell align="right">Peak Staff Needed</TableCell>
                          <TableCell align="right">End Staff Needed</TableCell>
                          <TableCell align="right">% Difference from Base</TableCell>
                          <TableCell>Risk Level</TableCell>
                          <TableCell>Key Parameters</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {planningData.scenarioComparison.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.scenario}</TableCell>
                            <TableCell align="right">{row.peakStaffNeeded}</TableCell>
                            <TableCell align="right">{row.endStaffNeeded}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: parseInt(row.percentDifference) > 0 ? 'error.main' : parseInt(row.percentDifference) < 0 ? 'success.main' : 'warning.main',
                              fontWeight: 'bold'
                            }}>
                              {row.percentDifference}
                            </TableCell>
                            <TableCell sx={{ 
                              color: row.riskLevel === 'High' || row.riskLevel === 'Very High' ? 'error.main' : 
                                     row.riskLevel === 'Medium' ? 'warning.main' : 'success.main',
                              fontWeight: 'bold'
                            }}>
                              {row.riskLevel}
                            </TableCell>
                            <TableCell>
                              {planningData.scenarios[index].growthRate}% growth, 
                              {planningData.scenarios[index].efficiencyFactor}% efficiency
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Contingency Plans" 
                    subheader="Responses to scenario triggers"
                  />
                  <Divider />
                  <CardContent>
                    {planningData.contingencyPlans.map((plan, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                          Trigger: {plan.trigger}
                        </Typography>
                        <Typography variant="body2" component="div">
                          <strong>Actions:</strong>
                          <ul>
                            {plan.actions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Timeline:</strong> {plan.timeline}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Expected Impact:</strong> {plan.impact}
                        </Typography>
                        {index < planningData.contingencyPlans.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Sensitivity Analysis" 
                    subheader="Impact of parameter changes"
                  />
                  <Divider />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Factor</TableCell>
                            <TableCell>Impact</TableCell>
                            <TableCell>Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {planningData.sensitivityAnalysis.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.factor}</TableCell>
                              <TableCell sx={{ 
                                color: row.impact === 'High' ? 'error.main' : 
                                       row.impact === 'Medium' ? 'warning.main' : 'info.main',
                                fontWeight: row.impact === 'High' ? 'bold' : 'normal'
                              }}>
                                {row.impact}
                              </TableCell>
                              <TableCell>{row.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Scenario Planning Recommendations" 
                    subheader="Strategic approach to uncertainty"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Base Case Strategy
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Implement staffing plan based on base case scenario</li>
                            <li>Monitor key indicators weekly to detect scenario shifts</li>
                            <li>Maintain 10% capacity buffer for unexpected fluctuations</li>
                            <li>Develop flexible resource allocation strategy</li>
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Risk Mitigation
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Develop contractor network for rapid capacity scaling</li>
                            <li>Implement cross-training program to increase flexibility</li>
                            <li>Create early warning system for scenario triggers</li>
                            <li>Establish decision thresholds for contingency activation</li>
                          </ul>
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                          Opportunity Capture
                        </Typography>
                        <Typography variant="body2" component="div">
                          <ul>
                            <li>Identify efficiency improvement opportunities</li>
                            <li>Develop plan to rapidly scale if high growth materializes</li>
                            <li>Create innovation pipeline for process improvements</li>
                            <li>Establish quarterly scenario review process</li>
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
            No capacity planning data available for the selected criteria
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please adjust your filters or select a different market
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CapacityPlanning;
