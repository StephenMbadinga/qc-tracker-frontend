import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  Switch,
  FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TodayIcon from '@mui/icons-material/Today';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { addDays, format } from 'date-fns';

const NextDayPlanning = () => {
  const [dailyPlannings, setDailyPlannings] = useState([]);
  const [nextDayPlannings, setNextDayPlannings] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1)); // Default to tomorrow
  const [selectedMarket, setSelectedMarket] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlanning, setEditingPlanning] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [formData, setFormData] = useState({
    reviewerId: '',
    marketId: '',
    jobs: [],
    otherWorkItems: [],
    totalEstimatedHours: 0,
    notes: ''
  });
  const [newOtherWork, setNewOtherWork] = useState({
    description: '',
    estimatedHours: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showCompletedJobs, setShowCompletedJobs] = useState(false);

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
      
      setJobs([
        { 
          _id: '1', 
          jobId: 'D-HCS509', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '1', name: 'Harold' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
        },
        { 
          _id: '2', 
          jobId: 'D-HCS537', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '1', name: 'Harold' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
        },
        { 
          _id: '3', 
          jobId: 'D-HCS538', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '2', name: 'Chris' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
        },
        { 
          _id: '4', 
          jobId: 'D-HCS526', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '2', name: 'Chris' },
          currentStatus: { _id: '3', name: 'Approved', color: '#4caf50' }
        },
        { 
          _id: '5', 
          jobId: 'D-HBR246', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '3', name: 'Jeff' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
        }
      ]);
      
      // Create sample daily planning data (today)
      const today = new Date();
      const sampleDailyPlannings = [
        {
          _id: '1',
          date: today.toISOString(),
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '1', name: 'Harold' },
          jobs: [
            { 
              _id: '1', 
              jobId: 'D-HCS509', 
              currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
            },
            { 
              _id: '2', 
              jobId: 'D-HCS537', 
              currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
            }
          ],
          otherWorkItems: [
            {
              description: 'Team meeting',
              estimatedHours: 1
            }
          ],
          totalEstimatedHours: 8,
          actualHours: 7.5,
          notes: 'Off for PM'
        },
        {
          _id: '2',
          date: today.toISOString(),
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '2', name: 'Chris' },
          jobs: [
            { 
              _id: '3', 
              jobId: 'D-HCS538', 
              currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
            },
            { 
              _id: '4', 
              jobId: 'D-HCS526', 
              currentStatus: { _id: '3', name: 'Approved', color: '#4caf50' }
            }
          ],
          otherWorkItems: [],
          totalEstimatedHours: 8,
          actualHours: 8,
          notes: ''
        },
        {
          _id: '3',
          date: today.toISOString(),
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '3', name: 'Jeff' },
          jobs: [
            { 
              _id: '5', 
              jobId: 'D-HBR246', 
              currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
            }
          ],
          otherWorkItems: [],
          totalEstimatedHours: 8,
          actualHours: 8,
          notes: ''
        }
      ];
      
      // Create sample next day planning data (tomorrow)
      const tomorrow = addDays(today, 1);
      const sampleNextDayPlannings = [
        {
          _id: '4',
          date: tomorrow.toISOString(),
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '1', name: 'Harold' },
          jobs: [
            { 
              _id: '1', 
              jobId: 'D-HCS509', 
              currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' }
            }
          ],
          otherWorkItems: [],
          totalEstimatedHours: 8,
          notes: 'Carried forward from today'
        }
      ];
      
      setDailyPlannings(sampleDailyPlannings);
      setNextDayPlannings(sampleNextDayPlannings);
      setSelectedMarket('1'); // Default to first market
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter next day plannings based on selected date and market
  const filteredPlannings = nextDayPlannings.filter(planning => {
    const planningDate = new Date(planning.date);
    const selected = new Date(selectedDate);
    
    return (
      planningDate.getDate() === selected.getDate() &&
      planningDate.getMonth() === selected.getMonth() &&
      planningDate.getFullYear() === selected.getFullYear() &&
      (!selectedMarket || planning.marketId._id === selectedMarket)
    );
  });

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleMarketChange = (event) => {
    setSelectedMarket(event.target.value);
  };

  const handleOpenDialog = (reviewer = null) => {
    setSelectedReviewer(reviewer);
    
    if (reviewer) {
      // Find existing planning for this reviewer on selected date
      const existingPlanning = nextDayPlannings.find(planning => 
        planning.reviewerId._id === reviewer._id &&
        new Date(planning.date).toDateString() === selectedDate.toDateString() &&
        planning.marketId._id === selectedMarket
      );
      
      if (existingPlanning) {
        setEditingPlanning(existingPlanning);
        setFormData({
          reviewerId: existingPlanning.reviewerId._id,
          marketId: existingPlanning.marketId._id,
          jobs: existingPlanning.jobs.map(job => job._id),
          otherWorkItems: existingPlanning.otherWorkItems,
          totalEstimatedHours: existingPlanning.totalEstimatedHours,
          notes: existingPlanning.notes
        });
      } else {
        setEditingPlanning(null);
        setFormData({
          reviewerId: reviewer._id,
          marketId: selectedMarket,
          jobs: [],
          otherWorkItems: [],
          totalEstimatedHours: 8, // Default to 8 hours
          notes: ''
        });
      }
    } else {
      setEditingPlanning(null);
      setFormData({
        reviewerId: '',
        marketId: selectedMarket,
        jobs: [],
        otherWorkItems: [],
        totalEstimatedHours: 8,
        notes: ''
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReviewer(null);
    setNewOtherWork({
      description: '',
      estimatedHours: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobToggle = (jobId) => {
    setFormData(prev => {
      const jobIndex = prev.jobs.indexOf(jobId);
      if (jobIndex === -1) {
        // Add job
        return {
          ...prev,
          jobs: [...prev.jobs, jobId]
        };
      } else {
        // Remove job
        return {
          ...prev,
          jobs: prev.jobs.filter(id => id !== jobId)
        };
      }
    });
  };

  const handleOtherWorkChange = (e) => {
    const { name, value } = e.target;
    setNewOtherWork(prev => ({
      ...prev,
      [name]: name === 'estimatedHours' ? Number(value) : value
    }));
  };

  const handleAddOtherWork = () => {
    if (!newOtherWork.description) {
      setSnackbar({
        open: true,
        message: 'Please enter a description for the other work',
        severity: 'error'
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      otherWorkItems: [...prev.otherWorkItems, { ...newOtherWork }]
    }));
    
    setNewOtherWork({
      description: '',
      estimatedHours: 0
    });
  };

  const handleRemoveOtherWork = (index) => {
    setFormData(prev => ({
      ...prev,
      otherWorkItems: prev.otherWorkItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.reviewerId || !formData.marketId) {
      setSnackbar({
        open: true,
        message: 'Reviewer and Market are required',
        severity: 'error'
      });
      return;
    }

    // Get full objects for the selected IDs
    const market = markets.find(m => m._id === formData.marketId);
    const reviewer = reviewers.find(r => r._id === formData.reviewerId);
    const selectedJobs = jobs.filter(job => formData.jobs.includes(job._id));

    // In a real app, this would send data to the API
    if (editingPlanning) {
      // Update existing planning
      const updatedPlannings = nextDayPlannings.map(planning => 
        planning._id === editingPlanning._id 
          ? { 
              ...planning, 
              marketId: market,
              reviewerId: reviewer,
              jobs: selectedJobs,
              otherWorkItems: formData.otherWorkItems,
              totalEstimatedHours: formData.totalEstimatedHours,
              notes: formData.notes
            } 
          : planning
      );
      setNextDayPlannings(updatedPlannings);
      setSnackbar({
        open: true,
        message: 'Next-day planning updated successfully',
        severity: 'success'
      });
    } else {
      // Add new planning
      const newPlanning = {
        _id: Date.now().toString(), // Temporary ID
        date: selectedDate.toISOString(),
        marketId: market,
        reviewerId: reviewer,
        jobs: selectedJobs,
        otherWorkItems: formData.otherWorkItems,
        totalEstimatedHours: formData.totalEstimatedHours,
        notes: formData.notes
      };
      setNextDayPlannings([...nextDayPlannings, newPlanning]);
      setSnackbar({
        open: true,
        message: 'Next-day planning added successfully',
        severity: 'success'
      });
    }

    handleCloseDialog();
  };

  const handleCarryForward = (reviewerId) => {
    // Find today's planning for this reviewer
    const todayPlanning = dailyPlannings.find(planning => 
      planning.reviewerId._id === reviewerId &&
      planning.marketId._id === selectedMarket
    );
    
    if (!todayPlanning) {
      setSnackbar({
        open: true,
        message: 'No current day planning found for this reviewer',
        severity: 'error'
      });
      return;
    }
    
    // Filter for in-progress jobs only if not showing completed jobs
    const jobsToCarry = showCompletedJobs 
      ? todayPlanning.jobs 
      : todayPlanning.jobs.filter(job => 
          job.currentStatus.name !== 'Send to Client' && 
          job.currentStatus.name !== 'Approved'
        );
    
    // Check if next day planning already exists
    const existingPlanning = nextDayPlannings.find(planning => 
      planning.reviewerId._id === reviewerId &&
      new Date(planning.date).toDateString() === selectedDate.toDateString() &&
      planning.marketId._id === selectedMarket
    );
    
    if (existingPlanning) {
      // Update existing planning
      const updatedPlannings = nextDayPlannings.map(planning => 
        planning._id === existingPlanning._id 
          ? { 
              ...planning, 
              jobs: jobsToCarry,
              otherWorkItems: todayPlanning.otherWorkItems,
              notes: `Carried forward from ${new Date(todayPlanning.date).toLocaleDateString()}`
            } 
          : planning
      );
      setNextDayPlannings(updatedPlannings);
    } else {
      // Create new planning
      const newPlanning = {
        _id: Date.now().toString(), // Temporary ID
        date: selectedDate.toISOString(),
        marketId: todayPlanning.marketId,
        reviewerId: todayPlanning.reviewerId,
        jobs: jobsToCarry,
        otherWorkItems: todayPlanning.otherWorkItems,
        totalEstimatedHours: todayPlanning.totalEstimatedHours,
        notes: `Carried forward from ${new Date(todayPlanning.date).toLocaleDateString()}`
      };
      setNextDayPlannings([...nextDayPlannings, newPlanning]);
    }
    
    setSnackbar({
      open: true,
      message: 'Planning carried forward successfully',
      severity: 'success'
    });
  };

  const handleMoveToCurrentDay = (planning) => {
    // In a real app, this would send a request to the API
    // For now, we'll simulate moving to current day
    
    // Add to daily plannings
    const newDailyPlanning = {
      ...planning,
      _id: Date.now().toString(), // New ID
      date: new Date().toISOString(), // Today's date
      actualHours: 0, // Reset actual hours
      notes: planning.notes ? `${planning.notes} (Moved from next-day planning)` : 'Moved from next-day planning'
    };
    
    setDailyPlannings([...dailyPlannings, newDailyPlanning]);
    
    // Remove from next day plannings
    const updatedNextDayPlannings = nextDayPlannings.filter(p => p._id !== planning._id);
    setNextDayPlannings(updatedNextDayPlannings);
    
    setSnackbar({
      open: true,
      message: 'Planning moved to current day successfully',
      severity: 'success'
    });
  };

  const handleDelete = (id) => {
    // In a real app, this would send a delete request to the API
    const updatedPlannings = nextDayPlannings.filter(planning => planning._id !== id);
    setNextDayPlannings(updatedPlannings);
    setSnackbar({
      open: true,
      message: 'Planning deleted successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Group plannings by reviewer
  const planningsByReviewer = {};
  filteredPlannings.forEach(planning => {
    const reviewerId = planning.reviewerId._id;
    if (!planningsByReviewer[reviewerId]) {
      planningsByReviewer[reviewerId] = {
        reviewer: planning.reviewerId,
        planning: planning
      };
    }
  });

  // Get reviewers without planning for the selected date and market
  const reviewersWithoutPlanning = reviewers.filter(reviewer => {
    return (
      (!selectedMarket || reviewer.markets.some(m => m._id === selectedMarket)) &&
      !planningsByReviewer[reviewer._id]
    );
  });

  // Get reviewers with current day planning but no next day planning
  const reviewersWithCurrentDayOnly = reviewers.filter(reviewer => {
    return (
      (!selectedMarket || reviewer.markets.some(m => m._id === selectedMarket)) &&
      !planningsByReviewer[reviewer._id] &&
      dailyPlannings.some(planning => 
        planning.reviewerId._id === reviewer._id &&
        planning.marketId._id === selectedMarket
      )
    );
  });

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
          Next-Day Planning
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Planning
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
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
            <FormControlLabel
              control={
                <Switch
                  checked={showCompletedJobs}
                  onChange={(e) => setShowCompletedJobs(e.target.checked)}
                  color="primary"
                />
              }
              label="Include Completed Jobs"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">
              Planning for {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Reviewer Cards */}
      <Grid container spacing={3}>
        {Object.values(planningsByReviewer).map(({ reviewer, planning }) => (
          <Grid item xs={12} md={6} lg={4} key={reviewer._id}>
            <Card>
              <CardHeader
                title={reviewer.name}
                subheader={`${planning.jobs.length} Jobs, ${planning.otherWorkItems.length} Other Tasks`}
                action={
                  <Box>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(reviewer)}
                      title="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      onClick={() => handleMoveToCurrentDay(planning)}
                      title="Move to Current Day"
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(planning._id)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Jobs:
                </Typography>
                {planning.jobs.length > 0 ? (
                  <Box sx={{ mb: 2 }}>
                    {planning.jobs.map(job => (
                      <Chip 
                        key={job._id} 
                        label={job.jobId} 
                        sx={{ 
                          mr: 0.5, 
                          mb: 0.5,
                          backgroundColor: job.currentStatus.color,
                          color: ['#ffeb3b', '#ff9800'].includes(job.currentStatus.color) ? '#000' : '#fff'
                        }} 
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No jobs assigned
                  </Typography>
                )}
                
                <Typography variant="subtitle1" gutterBottom>
                  Other Work:
                </Typography>
                {planning.otherWorkItems.length > 0 ? (
                  <Box sx={{ mb: 2 }}>
                    {planning.otherWorkItems.map((item, index) => (
                      <Chip 
                        key={index} 
                        label={`${item.description} (${item.estimatedHours}h)`} 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No other work assigned
                  </Typography>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Estimated Hours: {planning.totalEstimatedHours}
                    </Typography>
                  </Grid>
                </Grid>
                
                {planning.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Notes:</Typography>
                    <Typography variant="body2">{planning.notes}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {/* Reviewers with current day planning but no next day planning */}
        {reviewersWithCurrentDayOnly.map(reviewer => (
          <Grid item xs={12} md={6} lg={4} key={reviewer._id}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardHeader
                title={reviewer.name}
                subheader="Has current day planning"
                action={
                  <Box>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleCarryForward(reviewer._id)}
                      title="Carry Forward from Current Day"
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      onClick={() => handleOpenDialog(reviewer)}
                      title="Create New"
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                }
              />
              <Divider />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<ArrowForwardIcon />}
                    onClick={() => handleCarryForward(reviewer._id)}
                  >
                    Carry Forward from Current Day
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {/* Reviewers without any planning */}
        {reviewersWithoutPlanning
          .filter(reviewer => !reviewersWithCurrentDayOnly.some(r => r._id === reviewer._id))
          .map(reviewer => (
            <Grid item xs={12} md={6} lg={4} key={reviewer._id}>
              <Card sx={{ bgcolor: '#f5f5f5' }}>
                <CardHeader
                  title={reviewer.name}
                  subheader="No planning for this date"
                  action={
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(reviewer)}
                      title="Add Planning"
                    >
                      <AddIcon />
                    </IconButton>
                  }
                />
                <Divider />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<TodayIcon />}
                      onClick={() => handleOpenDialog(reviewer)}
                    >
                      Create Planning
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
        
        {Object.keys(planningsByReviewer).length === 0 && 
         reviewersWithCurrentDayOnly.length === 0 && 
         reviewersWithoutPlanning.filter(reviewer => !reviewersWithCurrentDayOnly.some(r => r._id === reviewer._id)).length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                No reviewers available for the selected market
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please select a different market or add reviewers to this market
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Planning Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPlanning ? 'Edit Planning' : 'Add New Planning'}
          {selectedReviewer && ` for ${selectedReviewer.name}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Reviewer selection (only if not pre-selected) */}
            {!selectedReviewer && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="reviewer-label">Reviewer</InputLabel>
                  <Select
                    labelId="reviewer-label"
                    name="reviewerId"
                    value={formData.reviewerId}
                    onChange={handleInputChange}
                    required
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
            )}
            
            {/* Market selection */}
            <Grid item xs={12} md={selectedReviewer ? 6 : 6}>
              <FormControl fullWidth>
                <InputLabel id="market-label">Market</InputLabel>
                <Select
                  labelId="market-label"
                  name="marketId"
                  value={formData.marketId}
                  onChange={handleInputChange}
                  required
                  disabled={!!selectedMarket} // Disable if market is pre-selected
                >
                  {markets.map((market) => (
                    <MenuItem key={market._id} value={market._id}>
                      {market.marketId} - {market.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Hours */}
            <Grid item xs={12} md={6}>
              <TextField
                name="totalEstimatedHours"
                label="Estimated Hours"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.totalEstimatedHours}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, max: 24, step: 0.5 } }}
              />
            </Grid>
            
            {/* Notes */}
            <Grid item xs={12} md={6}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                variant="outlined"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
            
            {/* Job selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Assign Jobs:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                {jobs
                  .filter(job => 
                    (!selectedMarket || job.marketId._id === selectedMarket) &&
                    (!selectedReviewer || job.reviewerId._id === selectedReviewer._id)
                  )
                  .map(job => (
                    <Chip 
                      key={job._id} 
                      label={job.jobId} 
                      sx={{ 
                        mr: 0.5, 
                        mb: 0.5,
                        backgroundColor: formData.jobs.includes(job._id) 
                          ? job.currentStatus.color 
                          : 'transparent',
                        color: formData.jobs.includes(job._id) 
                          ? (['#ffeb3b', '#ff9800'].includes(job.currentStatus.color) ? '#000' : '#fff')
                          : 'text.primary',
                        border: formData.jobs.includes(job._id) 
                          ? 'none' 
                          : '1px solid rgba(0, 0, 0, 0.23)'
                      }} 
                      onClick={() => handleJobToggle(job._id)}
                      clickable
                    />
                  ))
                }
                {jobs.filter(job => 
                  (!selectedMarket || job.marketId._id === selectedMarket) &&
                  (!selectedReviewer || job.reviewerId._id === selectedReviewer._id)
                ).length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No jobs available for this reviewer/market
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            {/* Other work items */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Other Work Items:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {formData.otherWorkItems.map((item, index) => (
                  <Chip 
                    key={index} 
                    label={`${item.description} (${item.estimatedHours}h)`} 
                    sx={{ mr: 0.5, mb: 0.5 }} 
                    color="secondary"
                    onDelete={() => handleRemoveOtherWork(index)}
                  />
                ))}
                {formData.otherWorkItems.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No other work items added
                  </Typography>
                )}
              </Box>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    value={newOtherWork.description}
                    onChange={handleOtherWorkChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    name="estimatedHours"
                    label="Hours"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={newOtherWork.estimatedHours}
                    onChange={handleOtherWorkChange}
                    InputProps={{ inputProps: { min: 0, max: 24, step: 0.5 } }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button 
                    variant="contained" 
                    onClick={handleAddOtherWork}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPlanning ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default NextDayPlanning;
