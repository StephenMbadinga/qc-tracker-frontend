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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Reviewers = () => {
  const [reviewers, setReviewers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReviewer, setEditingReviewer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    markets: [],
    isActive: true,
    averageHoursPerWeek: 40
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
        { 
          _id: '1', 
          name: 'Harold', 
          markets: [{ _id: '1', marketId: '9/10', name: 'Broward & Dade' }],
          isActive: true,
          averageHoursPerWeek: 40
        },
        { 
          _id: '2', 
          name: 'Chris', 
          markets: [{ _id: '1', marketId: '9/10', name: 'Broward & Dade' }],
          isActive: true,
          averageHoursPerWeek: 38
        },
        { 
          _id: '3', 
          name: 'Jeff', 
          markets: [{ _id: '1', marketId: '9/10', name: 'Broward & Dade' }],
          isActive: true,
          averageHoursPerWeek: 40
        },
        { 
          _id: '4', 
          name: 'Leonora', 
          markets: [{ _id: '1', marketId: '9/10', name: 'Broward & Dade' }],
          isActive: true,
          averageHoursPerWeek: 35
        },
        { 
          _id: '5', 
          name: 'Arlene', 
          markets: [{ _id: '2', marketId: '11/12', name: 'Brevard & Volusia' }],
          isActive: true,
          averageHoursPerWeek: 40
        },
        { 
          _id: '6', 
          name: 'Devin', 
          markets: [{ _id: '2', marketId: '11/12', name: 'Brevard & Volusia' }],
          isActive: true,
          averageHoursPerWeek: 40
        }
      ]);
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenDialog = (reviewer = null) => {
    if (reviewer) {
      setEditingReviewer(reviewer);
      setFormData({
        name: reviewer.name,
        markets: reviewer.markets.map(m => m._id),
        isActive: reviewer.isActive,
        averageHoursPerWeek: reviewer.averageHoursPerWeek
      });
    } else {
      setEditingReviewer(null);
      setFormData({
        name: '',
        markets: [],
        isActive: true,
        averageHoursPerWeek: 40
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || formData.markets.length === 0) {
      setSnackbar({
        open: true,
        message: 'Name and at least one market are required',
        severity: 'error'
      });
      return;
    }

    // Get full market objects for the selected market IDs
    const selectedMarkets = markets.filter(market => 
      formData.markets.includes(market._id)
    );

    // In a real app, this would send data to the API
    if (editingReviewer) {
      // Update existing reviewer
      const updatedReviewers = reviewers.map(reviewer => 
        reviewer._id === editingReviewer._id 
          ? { 
              ...reviewer, 
              name: formData.name,
              markets: selectedMarkets,
              isActive: formData.isActive,
              averageHoursPerWeek: formData.averageHoursPerWeek
            } 
          : reviewer
      );
      setReviewers(updatedReviewers);
      setSnackbar({
        open: true,
        message: 'Reviewer updated successfully',
        severity: 'success'
      });
    } else {
      // Add new reviewer
      const newReviewer = {
        _id: Date.now().toString(), // Temporary ID
        name: formData.name,
        markets: selectedMarkets,
        isActive: formData.isActive,
        averageHoursPerWeek: formData.averageHoursPerWeek
      };
      setReviewers([...reviewers, newReviewer]);
      setSnackbar({
        open: true,
        message: 'Reviewer added successfully',
        severity: 'success'
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // In a real app, this would send a delete request to the API
    const updatedReviewers = reviewers.filter(reviewer => reviewer._id !== id);
    setReviewers(updatedReviewers);
    setSnackbar({
      open: true,
      message: 'Reviewer deleted successfully',
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
          Reviewers
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Reviewer
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="reviewers table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Markets</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Hours/Week</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewers.map((reviewer) => (
                <TableRow key={reviewer._id} hover>
                  <TableCell>{reviewer.name}</TableCell>
                  <TableCell>
                    {reviewer.markets.map(market => (
                      <Chip 
                        key={market._id} 
                        label={market.marketId} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reviewer.isActive ? 'Active' : 'Inactive'} 
                      color={reviewer.isActive ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{reviewer.averageHoursPerWeek}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleOpenDialog(reviewer)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(reviewer._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {reviewers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No reviewers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Reviewer Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReviewer ? 'Edit Reviewer' : 'Add New Reviewer'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Reviewer Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="markets-label">Markets</InputLabel>
            <Select
              labelId="markets-label"
              multiple
              name="markets"
              value={formData.markets}
              onChange={handleInputChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const market = markets.find(m => m._id === value);
                    return (
                      <Chip key={value} label={market ? market.marketId : value} />
                    );
                  })}
                </Box>
              )}
            >
              {markets.map((market) => (
                <MenuItem key={market._id} value={market._id}>
                  {market.marketId} - {market.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="isActive"
              value={formData.isActive}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                isActive: e.target.value === 'true'
              }))}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="averageHoursPerWeek"
            label="Average Hours Per Week"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.averageHoursPerWeek}
            onChange={handleInputChange}
            InputProps={{ inputProps: { min: 0, max: 80 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingReviewer ? 'Update' : 'Add'}
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

export default Reviewers;
