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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, addDays, differenceInDays } from 'date-fns';
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

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

const AppWalkthrough = () => {
  const [loading, setLoading] = useState(true);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState(null);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenVideoDialog = (video) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  const handleCloseVideoDialog = () => {
    setVideoDialogOpen(false);
  };

  const handleOpenHelpDialog = (topic) => {
    setSelectedHelpTopic(topic);
    setHelpDialogOpen(true);
  };

  const handleCloseHelpDialog = () => {
    setHelpDialogOpen(false);
  };

  // Mock video tutorials data
  const videoTutorials = [
    {
      id: 1,
      title: 'Getting Started with QC Tracker',
      description: 'Learn the basics of the QC Team Productivity Tracker application and how to navigate the interface.',
      duration: '5:32',
      thumbnail: 'getting-started.jpg',
      topics: ['Navigation', 'User Interface', 'Login', 'Dashboard']
    },
    {
      id: 2,
      title: 'Managing Jobs and Statuses',
      description: 'Learn how to add, edit, and track jobs through their lifecycle from submission to completion.',
      duration: '7:15',
      thumbnail: 'job-management.jpg',
      topics: ['Job Creation', 'Status Updates', 'Job History', 'Comments']
    },
    {
      id: 3,
      title: 'Daily and Next-Day Planning',
      description: 'Learn how to use the daily planning features to manage current workload and plan for the next day.',
      duration: '6:48',
      thumbnail: 'planning.jpg',
      topics: ['Daily View', 'Next-Day Planning', 'Carrying Forward Jobs', 'Job Assignment']
    },
    {
      id: 4,
      title: 'Analytics and Reporting',
      description: 'Learn how to generate and interpret analytics reports to track team performance and productivity.',
      duration: '8:23',
      thumbnail: 'analytics.jpg',
      topics: ['Performance Metrics', 'Comparison Reports', 'Trend Analysis', 'Exporting Reports']
    },
    {
      id: 5,
      title: 'Forecasting and Capacity Planning',
      description: 'Learn how to use the forecasting tools to predict future workload and plan staffing needs.',
      duration: '9:10',
      thumbnail: 'forecasting.jpg',
      topics: ['Volume Forecasting', 'Resource Planning', 'Scenario Analysis', 'Parameter Adjustment']
    },
    {
      id: 6,
      title: 'Administrator Features',
      description: 'Learn about administrator-specific features for managing users, markets, and system settings.',
      duration: '6:55',
      thumbnail: 'admin.jpg',
      topics: ['User Management', 'Market Configuration', 'System Settings', 'Access Control']
    }
  ];

  // Mock help topics data
  const helpTopics = [
    {
      id: 1,
      title: 'Job Status Workflow',
      description: 'Understanding the job status flow from submission to completion.',
      content: `
        <h3>Job Status Workflow</h3>
        <p>The QC Team Productivity Tracker uses a standardized workflow for tracking jobs through their lifecycle:</p>
        <ol>
          <li><strong>Submitted for QC</strong> - Initial state when a job is submitted for quality control review.</li>
          <li><strong>In QC</strong> - The job is currently being reviewed by a QC team member.</li>
          <li><strong>Approved</strong> - The job has passed QC review and is ready for the next step.</li>
          <li><strong>Rejected</strong> - The job did not pass QC review and requires corrections.</li>
          <li><strong>Resubmitted</strong> - The job has been corrected and resubmitted for another QC review.</li>
          <li><strong>Send to Client</strong> - The job has been approved and is ready to be delivered to the client.</li>
        </ol>
        <p>Each status change is timestamped, allowing the system to calculate the duration between status changes. This provides valuable metrics for tracking team productivity and identifying bottlenecks in the process.</p>
        <p>The system also differentiates between first-time approvals and resubmission approvals, which helps track quality metrics and process efficiency.</p>
      `
    },
    {
      id: 2,
      title: 'Understanding Analytics',
      description: 'How to interpret the analytics and reporting features.',
      content: `
        <h3>Understanding Analytics</h3>
        <p>The Analytics section provides comprehensive insights into team performance and productivity:</p>
        <h4>Performance Analytics</h4>
        <p>This view shows key performance indicators for individual reviewers or teams:</p>
        <ul>
          <li><strong>Job Completion Rate</strong> - Average number of jobs completed per day</li>
          <li><strong>Processing Time</strong> - Average time spent on each job</li>
          <li><strong>First-Time Approval Rate</strong> - Percentage of jobs approved on first review</li>
          <li><strong>Comparison Data</strong> - Percentage differences between reviewers or time periods</li>
        </ul>
        <h4>Trend Analysis</h4>
        <p>This view shows how performance metrics change over time, helping identify patterns and trends:</p>
        <ul>
          <li><strong>Job Volume Over Time</strong> - Daily or weekly job counts</li>
          <li><strong>Processing Time Over Time</strong> - Changes in average processing time</li>
          <li><strong>Approval Rate Over Time</strong> - Changes in first-time approval rates</li>
        </ul>
        <h4>Efficiency Analysis</h4>
        <p>This view helps identify bottlenecks and optimization opportunities:</p>
        <ul>
          <li><strong>Efficiency Radar</strong> - Multi-dimensional view of reviewer performance</li>
          <li><strong>Time Distribution</strong> - Breakdown of time spent in different process stages</li>
          <li><strong>Process Bottlenecks</strong> - Identification of stages with longest durations</li>
        </ul>
        <p>All analytics can be filtered by date range, market, and reviewer, and can be exported for further analysis or reporting.</p>
      `
    },
    {
      id: 3,
      title: 'Forecasting Methodology',
      description: 'How the forecasting and capacity planning features work.',
      content: `
        <h3>Forecasting Methodology</h3>
        <p>The QC Team Productivity Tracker uses sophisticated forecasting models to predict future workload and resource needs:</p>
        <h4>Job Volume Forecasting</h4>
        <p>This feature predicts future job volumes based on historical data and trend analysis:</p>
        <ul>
          <li><strong>Time Series Analysis</strong> - Identifies patterns and trends in historical job volume</li>
          <li><strong>Seasonal Adjustments</strong> - Accounts for weekly, monthly, or quarterly patterns</li>
          <li><strong>Confidence Intervals</strong> - Provides range estimates based on forecast uncertainty</li>
        </ul>
        <h4>Resource Needs Forecasting</h4>
        <p>This feature translates forecasted job volumes into staffing requirements:</p>
        <ul>
          <li><strong>Productivity Metrics</strong> - Uses historical data on jobs per reviewer</li>
          <li><strong>Efficiency Factors</strong> - Adjusts for team efficiency and utilization</li>
          <li><strong>Vacation and Training</strong> - Accounts for non-productive time</li>
        </ul>
        <h4>Scenario Planning</h4>
        <p>This feature allows exploration of different future scenarios:</p>
        <ul>
          <li><strong>Parameter Adjustment</strong> - Modify growth rates, efficiency factors, etc.</li>
          <li><strong>Sensitivity Analysis</strong> - Identify which factors have the greatest impact</li>
          <li><strong>Contingency Planning</strong> - Develop responses to different scenarios</li>
        </ul>
        <p>All forecasting models can be adjusted with real-time parameter changes, allowing for interactive exploration of different assumptions and scenarios.</p>
      `
    },
    {
      id: 4,
      title: '"Other" Work Categorization',
      description: 'How to track and report on non-job activities.',
      content: `
        <h3>"Other" Work Categorization</h3>
        <p>The QC Team Productivity Tracker allows tracking of non-job activities to provide a complete picture of team workload:</p>
        <h4>Identifying "Other" Work</h4>
        <p>Any item that doesn't follow the standard job ID format (X-XXX123 or XX-XXX123) is automatically categorized as "Other" work. Examples include:</p>
        <ul>
          <li><strong>Transmittals</strong> - Processing document transmittals</li>
          <li><strong>Training</strong> - Time spent in training sessions</li>
          <li><strong>Meetings</strong> - Team or client meetings</li>
          <li><strong>Administrative Tasks</strong> - General administrative work</li>
        </ul>
        <h4>Tracking "Other" Work</h4>
        <p>When entering "Other" work:</p>
        <ul>
          <li>Enter a descriptive name instead of a job ID</li>
          <li>Select the appropriate category from the dropdown</li>
          <li>Enter the time spent on the activity</li>
          <li>Add any relevant notes or details</li>
        </ul>
        <h4>Reporting on "Other" Work</h4>
        <p>"Other" work is included in reporting but is separated from job counts:</p>
        <ul>
          <li>The Dashboard shows a breakdown of job vs. non-job activities</li>
          <li>Analytics reports include a separate section for "Other" work</li>
          <li>Time spent on "Other" work is factored into capacity planning</li>
        </ul>
        <p>Clicking on the "Other" section in reports will display a detailed breakdown of the different types of non-job activities.</p>
      `
    },
    {
      id: 5,
      title: 'Daily and Next-Day Planning',
      description: 'How to use the planning features effectively.',
      content: `
        <h3>Daily and Next-Day Planning</h3>
        <p>The planning features help manage current workload and prepare for upcoming work:</p>
        <h4>Daily Planning</h4>
        <p>The Daily Planning view shows all jobs currently in progress:</p>
        <ul>
          <li><strong>Reviewer Grouping</strong> - Jobs are grouped by assigned reviewer</li>
          <li><strong>Status Updates</strong> - Update job statuses in real-time</li>
          <li><strong>Time Tracking</strong> - View time spent in current status</li>
          <li><strong>Performance Metrics</strong> - See average and total processing times</li>
        </ul>
        <h4>Next-Day Planning</h4>
        <p>The Next-Day Planning view helps prepare for the following day:</p>
        <ul>
          <li><strong>Carry Forward</strong> - In-progress jobs are automatically carried forward</li>
          <li><strong>Remove Completed</strong> - Completed jobs can be removed from the list</li>
          <li><strong>Job Assignment</strong> - Assign new jobs to reviewers</li>
          <li><strong>Workload Balancing</strong> - View and adjust reviewer workloads</li>
        </ul>
        <h4>Planning Workflow</h4>
        <p>Recommended daily workflow:</p>
        <ol>
          <li>Review the Daily Planning view at the start of the day</li>
          <li>Update job statuses throughout the day as work progresses</li>
          <li>Use the Next-Day Planning view at the end of the day</li>
          <li>Review the next day's workload and make any necessary adjustments</li>
          <li>Move the Next-Day plan to the Current Day when ready</li>
        </ol>
        <p>The system maintains a history of daily production, allowing for historical analysis and reporting.</p>
      `
    }
  ];

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
          Application Walkthrough & Help
        </Typography>
      </Box>

      {/* Welcome Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome to the QC Team Productivity Tracker
          </Typography>
          <Typography variant="body1" paragraph>
            This application helps you track team productivity, manage job statuses, plan daily work, and forecast future capacity needs.
          </Typography>
          <Typography variant="body1" paragraph>
            Use the video tutorials and help topics below to learn how to use the application effectively.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<PlayArrowIcon />}
              onClick={() => handleOpenVideoDialog(videoTutorials[0])}
              sx={{ mr: 2 }}
            >
              Watch Getting Started
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<HelpOutlineIcon />}
              onClick={() => handleOpenHelpDialog(helpTopics[0])}
            >
              View Help Topics
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Video Tutorials */}
      <Typography variant="h5" gutterBottom>
        Video Tutorials
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {videoTutorials.map((video) => (
          <Grid item xs={12} md={4} key={video.id}>
            <Card>
              <Box 
                sx={{ 
                  height: 180, 
                  bgcolor: '#4C8AC3', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <VideoLibraryIcon sx={{ fontSize: 60, color: 'white' }} />
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                  onClick={() => handleOpenVideoDialog(video)}
                >
                  <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
                </IconButton>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 8, 
                    right: 8, 
                    bgcolor: 'rgba(0, 0, 0, 0.6)', 
                    color: 'white',
                    px: 1,
                    borderRadius: 1
                  }}
                >
                  {video.duration}
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {video.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {video.topics.map((topic, index) => (
                    <Typography 
                      key={index} 
                      variant="caption" 
                      sx={{ 
                        bgcolor: '#f0f0f0', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        fontSize: '0.7rem'
                      }}
                    >
                      {topic}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleOpenVideoDialog(video)}
                >
                  Watch Video
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Help Topics */}
      <Typography variant="h5" gutterBottom>
        Help Topics
      </Typography>
      <Grid container spacing={3}>
        {helpTopics.map((topic) => (
          <Grid item xs={12} md={6} key={topic.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {topic.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<InfoIcon />}
                  onClick={() => handleOpenHelpDialog(topic)}
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Reference */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quick Reference
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Job Status Flow
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#4caf50', mr: 1 }} />
                <Typography variant="body2">Submitted for QC</Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>→</Typography>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#2196f3', mr: 1 }} />
                <Typography variant="body2">In QC</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#2196f3', mr: 1 }} />
                <Typography variant="body2">In QC</Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>→</Typography>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#4caf50', mr: 1 }} />
                <Typography variant="body2">Approved</Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>or</Typography>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#f44336', mr: 1 }} />
                <Typography variant="body2">Rejected</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#f44336', mr: 1 }} />
                <Typography variant="body2">Rejected</Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>→</Typography>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ff9800', mr: 1 }} />
                <Typography variant="body2">Resubmitted</Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>→</Typography>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#2196f3', mr: 1 }} />
                <Typography variant="body2">In QC</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#4caf50', mr: 1 }} />
                <Typography variant="body2">Approved</Typography>
                <Typography variant="body2" sx={{ mx: 1 }}>→</Typography>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#9c27b0', mr: 1 }} />
                <Typography variant="body2">Send to Client</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Keyboard Shortcuts
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell><code>Alt + D</code></TableCell>
                    <TableCell>Go to Dashboard</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>Alt + J</code></TableCell>
                    <TableCell>Go to Jobs</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>Alt + P</code></TableCell>
                    <TableCell>Go to Daily Planning</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>Alt + N</code></TableCell>
                    <TableCell>Go to Next-Day Planning</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>Alt + R</code></TableCell>
                    <TableCell>Go to Reports</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>Alt + F</code></TableCell>
                    <TableCell>Go to Forecasting</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>Alt + S</code></TableCell>
                    <TableCell>Go to Settings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>Alt + H</code></TableCell>
                    <TableCell>Open Help</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={handleCloseVideoDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedVideo && (
          <>
            <DialogTitle>{selectedVideo.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ bgcolor: '#000', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="white">
                  [Video Player Placeholder]
                </Typography>
                <Typography variant="caption" sx={{ position: 'absolute', bottom: 16, right: 24, color: 'white' }}>
                  In the actual application, this would be a video player showing the tutorial.
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedVideo.description}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Topics covered:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {selectedVideo.topics.map((topic, index) => (
                  <Typography 
                    key={index} 
                    variant="caption" 
                    sx={{ 
                      bgcolor: '#f0f0f0', 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}
                  >
                    {topic}
                  </Typography>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseVideoDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Help Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={handleCloseHelpDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedHelpTopic && (
          <>
            <DialogTitle>{selectedHelpTopic.title}</DialogTitle>
            <DialogContent>
              <div dangerouslySetInnerHTML={{ __html: selectedHelpTopic.content }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseHelpDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AppWalkthrough;
