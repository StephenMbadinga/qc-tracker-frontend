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
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Markets = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [formData, setFormData] = useState({
    marketId: '',
    name: '',
    description: ''
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
        { _id: '1', marketId: '9/10', name: 'Broward & Dade', description: 'South Florida market' },
        { _id: '2', marketId: '11/12', name: 'Brevard & Volusia', description: 'Central Florida market' }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenDialog = (market = null) => {
    if (market) {
      setEditingMarket(market);
      setFormData({
        marketId: market.marketId,
        name: market.name,
        description: market.description || ''
      });
    } else {
      setEditingMarket(null);
      setFormData({
        marketId: '',
        name: '',
        description: ''
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
    if (!formData.marketId || !formData.name) {
      setSnackbar({
        open: true,
        message: 'Market ID and Name are required',
        severity: 'error'
      });
      return;
    }

    // In a real app, this would send data to the API
    if (editingMarket) {
      // Update existing market
      const updatedMarkets = markets.map(market => 
        market._id === editingMarket._id ? { ...market, ...formData } : market
      );
      setMarkets(updatedMarkets);
      setSnackbar({
        open: true,
        message: 'Market updated successfully',
        severity: 'success'
      });
    } else {
      // Add new market
      const newMarket = {
        _id: Date.now().toString(), // Temporary ID
        ...formData
      };
      setMarkets([...markets, newMarket]);
      setSnackbar({
        open: true,
        message: 'Market added successfully',
        severity: 'success'
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (id) => {
    // In a real app, this would send a delete request to the API
    const updatedMarkets = markets.filter(market => market._id !== id);
    setMarkets(updatedMarkets);
    setSnackbar({
      open: true,
      message: 'Market deleted successfully',
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
          Markets
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Market
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="markets table">
            <TableHead>
              <TableRow>
                <TableCell>Market ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {markets.map((market) => (
                <TableRow key={market._id} hover>
                  <TableCell>{market.marketId}</TableCell>
                  <TableCell>{market.name}</TableCell>
                  <TableCell>{market.description}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleOpenDialog(market)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(market._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {markets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No markets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Market Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingMarket ? 'Edit Market' : 'Add New Market'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="marketId"
            label="Market ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.marketId}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="name"
            label="Market Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMarket ? 'Update' : 'Add'}
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

export default Markets;
