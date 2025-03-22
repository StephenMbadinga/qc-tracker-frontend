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
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BackupIcon from '@mui/icons-material/Backup';
import HelpIcon from '@mui/icons-material/Help';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { ChromePicker } from 'react-color';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    account: {
      username: 'admin',
      email: 'admin@example.com',
      role: 'Administrator',
      lastLogin: '2025-03-20T08:30:00Z'
    },
    security: {
      passwordLastChanged: '2025-01-15T10:00:00Z',
      twoFactorEnabled: false,
      sessionTimeout: 30
    },
    appearance: {
      primaryColor: '#4C8AC3',
      darkMode: false,
      compactView: false,
      fontSize: 'medium'
    },
    notifications: {
      emailNotifications: true,
      dailyDigest: false,
      statusChanges: true,
      newJobs: true
    },
    dataManagement: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      lastBackup: '2025-03-19T23:00:00Z'
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [editedSettings, setEditedSettings] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // In a real app, this would fetch settings from the API
    // For now, we'll simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setEditMode(false);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      setSettings({...settings, ...editedSettings});
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success'
      });
    }
    setEditMode(!editMode);
    setEditedSettings(settings);
  };

  const handleInputChange = (section, field, value) => {
    setEditedSettings({
      ...editedSettings,
      [section]: {
        ...editedSettings[section],
        [field]: value
      }
    });
  };

  const handleColorChange = (color) => {
    handleInputChange('appearance', 'primaryColor', color.hex);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handlePasswordSubmit = () => {
    // In a real app, this would send a request to change the password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    // Simulate successful password change
    setPasswordDialog(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    
    // Update last changed date
    const updatedSettings = {
      ...settings,
      security: {
        ...settings.security,
        passwordLastChanged: new Date().toISOString()
      }
    };
    setSettings(updatedSettings);
    
    setSnackbar({
      open: true,
      message: 'Password changed successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
          Settings
        </Typography>
        <Button 
          variant="contained" 
          startIcon={editMode ? <SaveIcon /> : <EditIcon />}
          onClick={handleEditToggle}
          color={editMode ? "success" : "primary"}
        >
          {editMode ? 'Save Changes' : 'Edit Settings'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <List component="nav">
              <ListItem 
                button 
                selected={activeSection === 'account'} 
                onClick={() => handleSectionChange('account')}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
              <ListItem 
                button 
                selected={activeSection === 'security'} 
                onClick={() => handleSectionChange('security')}
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Security" />
              </ListItem>
              <ListItem 
                button 
                selected={activeSection === 'appearance'} 
                onClick={() => handleSectionChange('appearance')}
              >
                <ListItemIcon>
                  <ColorLensIcon />
                </ListItemIcon>
                <ListItemText primary="Appearance" />
              </ListItem>
              <ListItem 
                button 
                selected={activeSection === 'notifications'} 
                onClick={() => handleSectionChange('notifications')}
              >
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>
              <ListItem 
                button 
                selected={activeSection === 'dataManagement'} 
                onClick={() => handleSectionChange('dataManagement')}
              >
                <ListItemIcon>
                  <BackupIcon />
                </ListItemIcon>
                <ListItemText primary="Data Management" />
              </ListItem>
              <ListItem 
                button 
                selected={activeSection === 'help'} 
                onClick={() => handleSectionChange('help')}
              >
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {/* Account Settings */}
            {activeSection === 'account' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Account Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Username"
                      fullWidth
                      value={editMode ? editedSettings.account.username : settings.account.username}
                      onChange={(e) => handleInputChange('account', 'username', e.target.value)}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={editMode ? editedSettings.account.email : settings.account.email}
                      onChange={(e) => handleInputChange('account', 'email', e.target.value)}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select
                        labelId="role-label"
                        value={editMode ? editedSettings.account.role : settings.account.role}
                        onChange={(e) => handleInputChange('account', 'role', e.target.value)}
                        disabled={!editMode}
                        label="Role"
                      >
                        <MenuItem value="Administrator">Administrator</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Reviewer">Reviewer</MenuItem>
                        <MenuItem value="Viewer">Viewer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Last Login"
                      fullWidth
                      value={formatDate(settings.account.lastLogin)}
                      disabled
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Security Settings */}
            {activeSection === 'security' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Security Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Password Last Changed"
                      fullWidth
                      value={formatDate(settings.security.passwordLastChanged)}
                      disabled
                      variant="outlined"
                      margin="normal"
                    />
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mt: 2 }}
                      onClick={() => setPasswordDialog(true)}
                    >
                      Change Password
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="session-timeout-label">Session Timeout (minutes)</InputLabel>
                      <Select
                        labelId="session-timeout-label"
                        value={editMode ? editedSettings.security.sessionTimeout : settings.security.sessionTimeout}
                        onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
                        disabled={!editMode}
                        label="Session Timeout (minutes)"
                      >
                        <MenuItem value={15}>15 minutes</MenuItem>
                        <MenuItem value={30}>30 minutes</MenuItem>
                        <MenuItem value={60}>1 hour</MenuItem>
                        <MenuItem value={120}>2 hours</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.security.twoFactorEnabled : settings.security.twoFactorEnabled}
                          onChange={(e) => handleInputChange('security', 'twoFactorEnabled', e.target.checked)}
                          disabled={!editMode}
                          color="primary"
                        />
                      }
                      label="Enable Two-Factor Authentication"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Appearance Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mr: 2 }}>
                        Primary Color:
                      </Typography>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: editMode ? editedSettings.appearance.primaryColor : settings.appearance.primaryColor,
                          borderRadius: 1,
                          cursor: editMode ? 'pointer' : 'default',
                          border: '1px solid #ccc'
                        }}
                        onClick={() => editMode && setShowColorPicker(!showColorPicker)}
                      />
                    </Box>
                    {showColorPicker && editMode && (
                      <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Box 
                          sx={{ 
                            position: 'fixed', 
                            top: 0, 
                            right: 0, 
                            bottom: 0, 
                            left: 0 
                          }} 
                          onClick={() => setShowColorPicker(false)} 
                        />
                        <Box sx={{ position: 'absolute' }}>
                          <ChromePicker 
                            color={editedSettings.appearance.primaryColor} 
                            onChange={handleColorChange} 
                          />
                        </Box>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="font-size-label">Font Size</InputLabel>
                      <Select
                        labelId="font-size-label"
                        value={editMode ? editedSettings.appearance.fontSize : settings.appearance.fontSize}
                        onChange={(e) => handleInputChange('appearance', 'fontSize', e.target.value)}
                        disabled={!editMode}
                        label="Font Size"
                      >
                        <MenuItem value="small">Small</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="large">Large</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.appearance.darkMode : settings.appearance.darkMode}
                          onChange={(e) => handleInputChange('appearance', 'darkMode', e.target.checked)}
                          disabled={!editMode}
                          color="primary"
                        />
                      }
                      label="Dark Mode"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.appearance.compactView : settings.appearance.compactView}
                          onChange={(e) => handleInputChange('appearance', 'compactView', e.target.checked)}
                          disabled={!editMode}
                          color="primary"
                        />
                      }
                      label="Compact View"
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Preview
                  </Typography>
                  <Card sx={{ 
                    bgcolor: editMode ? editedSettings.appearance.darkMode ? '#333' : '#fff' : settings.appearance.darkMode ? '#333' : '#fff',
                    color: editMode ? editedSettings.appearance.darkMode ? '#fff' : '#000' : settings.appearance.darkMode ? '#fff' : '#000'
                  }}>
                    <CardHeader 
                      title="Sample Card" 
                      sx={{ 
                        bgcolor: editMode ? editedSettings.appearance.primaryColor : settings.appearance.primaryColor,
                        color: '#fff'
                      }}
                    />
                    <CardContent>
                      <Typography variant="body1" sx={{ 
                        fontSize: editMode 
                          ? editedSettings.appearance.fontSize === 'small' 
                            ? '0.875rem' 
                            : editedSettings.appearance.fontSize === 'large' 
                              ? '1.125rem' 
                              : '1rem'
                          : settings.appearance.fontSize === 'small' 
                            ? '0.875rem' 
                            : settings.appearance.fontSize === 'large' 
                              ? '1.125rem' 
                              : '1rem'
                      }}>
                        This is a preview of how the application will look with your selected settings.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}
            
            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Notification Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.notifications.emailNotifications : settings.notifications.emailNotifications}
                          onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                          disabled={!editMode}
                          color="primary"
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.notifications.dailyDigest : settings.notifications.dailyDigest}
                          onChange={(e) => handleInputChange('notifications', 'dailyDigest', e.target.checked)}
                          disabled={!editMode || !(editMode ? editedSettings.notifications.emailNotifications : settings.notifications.emailNotifications)}
                          color="primary"
                        />
                      }
                      label="Daily Digest Email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.notifications.statusChanges : settings.notifications.statusChanges}
                          onChange={(e) => handleInputChange('notifications', 'statusChanges', e.target.checked)}
                          disabled={!editMode}
                          color="primary"
                        />
                      }
                      label="Notify on Status Changes"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.notifications.newJobs : settings.notifications.newJobs}
                          onChange={(e) => handleInputChange('notifications', 'newJobs', e.target.checked)}
                          disabled={!editMode}
                          color="primary"
                        />
                      }
                      label="Notify on New Jobs"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Data Management Settings */}
            {activeSection === 'dataManagement' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Data Management Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? editedSettings.dataManagement.autoBackup : settings.dataManagement.autoBackup}
                          onChange={(e) => handleInputChange('dataManagement', 'autoBackup', e.target.checked)}
                          disabled={!editMode}
                          color="primary"
                        />
                      }
                      label="Automatic Backups"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal" disabled={!editMode || !(editMode ? editedSettings.dataManagement.autoBackup : settings.dataManagement.autoBackup)}>
                      <InputLabel id="backup-frequency-label">Backup Frequency</InputLabel>
                      <Select
                        labelId="backup-frequency-label"
                        value={editMode ? editedSettings.dataManagement.backupFrequency : settings.dataManagement.backupFrequency}
                        onChange={(e) => handleInputChange('dataManagement', 'backupFrequency', e.target.value)}
                        label="Backup Frequency"
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Retention Period (days)"
                      fullWidth
                      type="number"
                      value={editMode ? editedSettings.dataManagement.retentionPeriod : settings.dataManagement.retentionPeriod}
                      onChange={(e) => handleInputChange('dataManagement', 'retentionPeriod', parseInt(e.target.value))}
                      disabled={!editMode || !(editMode ? editedSettings.dataManagement.autoBackup : settings.dataManagement.autoBackup)}
                      variant="outlined"
                      margin="normal"
                      InputProps={{ inputProps: { min: 1, max: 365 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Last Backup"
                      fullWidth
                      value={formatDate(settings.dataManagement.lastBackup)}
                      disabled
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<BackupIcon />}
                      onClick={() => {
                        setSnackbar({
                          open: true,
                          message: 'Manual backup started',
                          severity: 'info'
                        });
                        
                        // Simulate backup completion
                        setTimeout(() => {
                          const updatedSettings = {
                            ...settings,
                            dataManagement: {
                              ...settings.dataManagement,
                              lastBackup: new Date().toISOString()
                            }
                          };
                          setSettings(updatedSettings);
                          
                          setSnackbar({
                            open: true,
                            message: 'Manual backup completed successfully',
                            severity: 'success'
                          });
                        }, 3000);
                      }}
                    >
                      Create Manual Backup
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Help & Support */}
            {activeSection === 'help' && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Help & Support
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="User Guide" />
                      <CardContent>
                        <Typography variant="body1" paragraph>
                          The comprehensive user guide provides detailed instructions on how to use all features of the QC Team Productivity Tracker.
                        </Typography>
                        <Button variant="outlined" color="primary">
                          View User Guide
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Video Tutorials" />
                      <CardContent>
                        <Typography variant="body1" paragraph>
                          Watch step-by-step video tutorials to learn how to use the QC Team Productivity Tracker effectively.
                        </Typography>
                        <Button variant="outlined" color="primary">
                          Watch Tutorials
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Contact Support" />
                      <CardContent>
                        <Typography variant="body1" paragraph>
                          If you need assistance or have questions about the QC Team Productivity Tracker, please contact our support team.
                        </Typography>
                        <Button variant="contained" color="primary">
                          Contact Support
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="About" />
                      <CardContent>
                        <Typography variant="body1" paragraph>
                          QC Team Productivity Tracker v1.0.0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          © 2025 QC Team Productivity Tracker. All rights reserved.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="currentPassword"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="newPassword"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordSubmit} variant="contained" color="primary">
            Change Password
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

export default Settings;
