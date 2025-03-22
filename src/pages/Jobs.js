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
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    jobId: '',
    marketId: '',
    reviewerId: '',
    currentStatus: '',
    isOtherWork: false,
    otherWorkType: ''
  });
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
      
      setStatuses([
        { _id: '1', name: 'Submitted for QC', color: '#ffeb3b', order: 1 },
        { _id: '2', name: 'In QC', color: '#2196f3', order: 2 },
        { _id: '3', name: 'Approved', color: '#4caf50', order: 3 },
        { _id: '4', name: 'Rejected', color: '#f44336', order: 4 },
        { _id: '5', name: 'Resubmitted', color: '#ff9800', order: 5 },
        { _id: '6', name: 'Send to Client', color: '#9c27b0', order: 6 }
      ]);
      
      setJobs([
        { 
          _id: '1', 
          jobId: 'D-HCS509', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '1', name: 'Harold' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' },
          isResubmission: true,
          isFirstTimeApproval: false,
          isOtherWork: false,
          createdAt: '2025-03-13T10:00:00Z',
          updatedAt: '2025-03-13T10:34:00Z'
        },
        { 
          _id: '2', 
          jobId: 'D-HCS537', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '1', name: 'Harold' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' },
          isResubmission: false,
          isFirstTimeApproval: false,
          isOtherWork: false,
          createdAt: '2025-03-12T15:02:00Z',
          updatedAt: '2025-03-13T11:07:00Z'
        },
        { 
          _id: '3', 
          jobId: 'D-HCS538', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '2', name: 'Chris' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' },
          isResubmission: false,
          isFirstTimeApproval: false,
          isOtherWork: false,
          createdAt: '2025-03-12T14:09:00Z',
          updatedAt: '2025-03-13T09:37:00Z'
        },
        { 
          _id: '4', 
          jobId: 'D-HCS526', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '2', name: 'Chris' },
          currentStatus: { _id: '4', name: 'Rejected', color: '#f44336' },
          isResubmission: true,
          isFirstTimeApproval: false,
          isOtherWork: false,
          createdAt: '2025-03-13T09:47:00Z',
          updatedAt: '2025-03-13T11:23:00Z'
        },
        { 
          _id: '5', 
          jobId: 'Transmittals', 
          marketId: { _id: '1', marketId: '9/10', name: 'Broward & Dade' },
          reviewerId: { _id: '4', name: 'Leonora' },
          currentStatus: { _id: '3', name: 'Approved', color: '#4caf50' },
          isResubmission: false,
          isFirstTimeApproval: true,
          isOtherWork: true,
          otherWorkType: 'Transmittals',
          createdAt: '2025-03-13T08:33:00Z',
          updatedAt: '2025-03-13T09:01:00Z'
        }
      ]);
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        jobId: job.jobId,
        marketId: job.marketId._id,
        reviewerId: job.reviewerId._id,
        currentStatus: job.currentStatus._id,
        isOtherWork: job.isOtherWork,
        otherWorkType: job.otherWorkType || ''
      });
    } else {
      setEditingJob(null);
      setFormData({
        jobId: '',
        marketId: '',
        reviewerId: '',
        currentStatus: '',
        isOtherWork: false,
        otherWorkType: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenHistoryDialog = (job) => {
    setSelectedJob(job);
    
    // In a real app, this would fetch job history from the API
    // For now, we'll create mock history data
    const mockHistory = [
      {
        _id: '1',
        statusId: { _id: '1', name: 'Submitted for QC', color: '#ffeb3b' },
        timestamp: new Date(job.createdAt).toLocaleString(),
        durationFromPrevious: 0,
        notes: 'Initial submission'
      },
      {
        _id: '2',
        statusId: { _id: '2', name: 'In QC', color: '#2196f3' },
        timestamp: new Date(new Date(job.createdAt).getTime() + 30 * 60000).toLocaleString(),
        durationFromPrevious: 30,
        notes: 'Started review'
      },
      {
        _id: '3',
        statusId: job.currentStatus,
        timestamp: new Date(job.updatedAt).toLocaleString(),
        durationFromPrevious: Math.round((new Date(job.updatedAt) - new Date(job.createdAt)) / 60000),
        notes: job.currentStatus.name === 'Rejected' ? 'Issues found' : 'Approved'
      }
    ];
    
    setJobHistory(mockHistory);
    setOpenHistoryDialog(true);
  };

  const handleCloseHistoryDialog = () => {
    setOpenHistoryDialog(false);
    setSelectedJob(null);
    setJobHistory([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.jobId || !formData.marketId || !formData.reviewerId || !formData.currentStatus) {
      setSnackbar({
        open: true,
        message: 'All fields are required',
        severity: 'error'
      });
      return;
    }

    // If it's "Other" work, require otherWorkType
    if (formData.isOtherWork && !formData.otherWorkType) {
      setSnackbar({
        open: true,
        message: 'Please specify the type of other work',
        severity: 'error'
      });
      return;
    }

    // Check if job ID follows standard format
    const isStandardJobId = /^[A-Z]{1,2}-[A-Z]{3}\d{3}$/.test(formData.jobId);
    
    // If job ID doesn't follow standard format, set isOtherWork to true
    if (!isStandardJobId) {
      formData.isOtherWork = true;
    }

    // Get full objects for the selected IDs
    const market = markets.find(m => m._id === formData.marketId);
    const reviewer = reviewers.find(r => r._id === formData.reviewerId);
    const status = statuses.find(s => s._id === formData.currentStatus);

    // In a real app, this would send data to the API
    if (editingJob) {
      // Update existing job
      const updatedJobs = jobs.map(job => 
        job._id === editingJob._id 
          ? { 
              ...job, 
              jobId: formData.jobId,
              marketId: market,
              reviewerId: reviewer,
              currentStatus: status,
              isOtherWork: formData.isOtherWork,
              otherWorkType: formData.otherWorkType,
              updatedAt: new Date().toISOString()
            } 
          : job
      );
      setJobs(updatedJobs);
      setSnackbar({
        open: true,
        message: 'Job updated successfully',
        severity: 'success'
      });
    } else {
      // Add new job
      const newJob = {
        _id: Date.now().toString(), // Temporary ID
        jobId: formData.jobId,
        marketId: market,
        reviewerId: reviewer,
        currentStatus: status,
        isResubmission: false,
        isFirstTimeApproval: false,
        isOtherWork: formData.isOtherWork,
        otherWorkType: formData.otherWorkType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setJobs([...jobs, newJob]);
      setSnackbar({
        open: true,
        message: 'Job added successfully',
        severity: 'success'
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // In a real app, this would send a delete request to the API
    const updatedJobs = jobs.filter(job => job._id !== id);
    setJobs(updatedJobs);
    setSnackbar({
      open: true,
      message: 'Job deleted successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Filter jobs based on selected tab
  const filteredJobs = tabValue === 0 
    ? jobs 
    : tabValue === 1 
      ? jobs.filter(job => !job.isOtherWork) 
      : jobs.filter(job => job.isOtherWork);

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
          Jobs
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Job
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="job tabs">
          <Tab label={
            <Badge badgeContent={jobs.length} color="primary">
              All Jobs
            </Badge>
          } />
          <Tab label={
            <Badge badgeContent={jobs.filter(job => !job.isOtherWork).length} color="primary">
              Standard Jobs
            </Badge>
          } />
          <Tab label={
            <Badge badgeContent={jobs.filter(job => job.isOtherWork).length} color="primary">
              Other Work
            </Badge>
          } />
        </Tabs>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="jobs table">
            <TableHead>
              <TableRow>
                <TableCell>Job ID</TableCell>
                <TableCell>Market</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job._id} hover>
                  <TableCell>
                    {job.jobId}
                    {job.isOtherWork && (
                      <Chip 
                        label="Other" 
                        size="small" 
                        color="secondary" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{job.marketId.marketId}</TableCell>
                  <TableCell>{job.reviewerId.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={job.currentStatus.name} 
                      size="small" 
                      sx={{ 
                        backgroundColor: job.currentStatus.color,
                        color: ['#ffeb3b', '#ff9800'].includes(job.currentStatus.color) ? '#000' : '#fff'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{new Date(job.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(job.updatedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="info" 
                      size="small"
                      onClick={() => handleOpenHistoryDialog(job)}
                      title="View History"
                    >
                      <HistoryIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleOpenDialog(job)}
                      title="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(job._id)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No jobs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Job Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingJob ? 'Edit Job' : 'Add New Job'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="jobId"
            label="Job ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.jobId}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
            helperText="Use format X-XXX123 or XX-XXX123 for standard jobs"
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="market-label">Market</InputLabel>
            <Select
              labelId="market-label"
              name="marketId"
              value={formData.marketId}
              onChange={handleInputChange}
              required
            >
              {markets.map((market) => (
                <MenuItem key={market._id} value={market._id}>
                  {market.marketId} - {market.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="reviewer-label">Reviewer</InputLabel>
            <Select
              labelId="reviewer-label"
              name="reviewerId"
              value={formData.reviewerId}
              onChange={handleInputChange}
              required
            >
              {reviewers
                .filter(reviewer => !formData.marketId || reviewer.markets.some(m => m._id === formData.marketId))
                .map((reviewer) => (
                  <MenuItem key={reviewer._id} value={reviewer._id}>
                    {reviewer.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="currentStatus"
              value={formData.currentStatus}
              onChange={handleInputChange}
              required
            >
              {statuses.map((status) => (
                <MenuItem key={status._id} value={status._id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>Other Work:</Typography>
            <Select
              name="isOtherWork"
              value={formData.isOtherWork.toString()}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                isOtherWork: e.target.value === 'true'
              }))}
              size="small"
              sx={{ width: 100 }}
            >
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
            </Select>
          </FormControl>
          
          {formData.isOtherWork && (
            <TextField
              margin="dense"
              name="otherWorkType"
              label="Other Work Type"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.otherWorkType}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              placeholder="e.g., Transmittals"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingJob ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job History Dialog */}
      <Dialog open={openHistoryDialog} onClose={handleCloseHistoryDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Job History - {selectedJob?.jobId}
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Market: {selectedJob.marketId.marketId} - {selectedJob.marketId.name}
              </Typography>
              <Typography variant="subtitle1">
                Reviewer: {selectedJob.reviewerId.name}
              </Typography>
              <Typography variant="subtitle1">
                Current Status: 
                <Chip 
                  label={selectedJob.currentStatus.name} 
                  size="small" 
                  sx={{ 
                    ml: 1,
                    backgroundColor: selectedJob.currentStatus.color,
                    color: ['#ffeb3b', '#ff9800'].includes(selectedJob.currentStatus.color) ? '#000' : '#fff'
                  }} 
                />
              </Typography>
            </Box>
          )}
          
          <TableContainer>
            <Table aria-label="job history table">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobHistory.map((history) => (
                  <TableRow key={history._id} hover>
                    <TableCell>
                      <Chip 
                        label={history.statusId.name} 
                        size="small" 
                        sx={{ 
                          backgroundColor: history.statusId.color,
                          color: ['#ffeb3b', '#ff9800'].includes(history.statusId.color) ? '#000' : '#fff'
                        }} 
                      />
                    </TableCell>
                    <TableCell>{history.timestamp}</TableCell>
                    <TableCell>
                      {history.durationFromPrevious > 0 
                        ? `${Math.floor(history.durationFromPrevious / 60)} hours, ${history.durationFromPrevious % 60} minutes` 
                        : 'Initial status'}
                    </TableCell>
                    <TableCell>{history.notes}</TableCell>
                  </TableRow>
                ))}
                {jobHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog}>Close</Button>
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

export default Jobs;
