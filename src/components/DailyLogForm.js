import React, { useState } from 'react';
import { Box, TextField, Typography, Button, InputAdornment, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import StressManagementIcon from '@mui/icons-material/EmojiEmotions';
import StarRateIcon from '@mui/icons-material/StarRate';
import api from './../api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

const DailyLogForm = () => {
  const [formData, setFormData] = useState({
    mood: '',
    anxietyLevel: '',
    sleepHours: '',
    sleepQuality: '',
    physicalActivity: '',
    socialInteractions: '',
    stressLevel: '',
    symptoms: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const navigate = useNavigate(); // Hook for navigation

  const handleMoodChange = (event, newMood) => {
    if (newMood !== null) {
      setFormData({ ...formData, mood: newMood });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      mood: formData.mood,
      anxiety_level: formData.anxietyLevel,
      sleep_hours: formData.sleepHours,
      sleep_quality: formData.sleepQuality,
      physical_activity: formData.physicalActivity,
      social_interaction: formData.socialInteractions,
      stress_level: formData.stressLevel,
      symptoms: formData.symptoms,
      date_time: new Date().toISOString(), 
    };
  
    const token = localStorage.getItem('authToken');

    try {
      const response = await api.post('/api/logs', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success("Log submitted successfully");
        // Clear the form fields
        setFormData({
          mood: '',
          anxietyLevel: '',
          sleepHours: '',
          sleepQuality: '',
          physicalActivity: '',
          socialInteractions: '',
          stressLevel: '',
          symptoms: '',
        });
        setIsSubmitted(true); // Set submitted state to true
      } else {
        console.error('Failed to submit log');
      }
    } catch (error) {
      console.error('Error submitting log:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Daily Log
      </Typography>

      <Typography variant="h6" mt={2} mb={1}>
        Mood:
      </Typography>
      <ToggleButtonGroup
        value={formData.mood}
        exclusive
        onChange={handleMoodChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="verysad" aria-label="verysad">
          <SentimentVeryDissatisfiedIcon /> Very Sad
        </ToggleButton>
        <ToggleButton value="sad" aria-label="Sad">
          <SentimentDissatisfiedIcon /> Sad
        </ToggleButton>
        <ToggleButton value="happy" aria-label="Happy">
          <SentimentSatisfiedIcon /> Happy
        </ToggleButton>
        <ToggleButton value="very-happy" aria-label="Very Happy">
          <SentimentVerySatisfiedIcon /> Very Happy
        </ToggleButton>
      </ToggleButtonGroup>

      <TextField
        label="Anxiety Level"
        name="anxietyLevel"
        type="number"
        value={formData.anxietyLevel}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <HealthAndSafetyIcon />
            </InputAdornment>
          ),
          inputProps: { min: 0 },
        }}
      />

      <TextField
        label="Sleep Hours"
        name="sleepHours"
        type="number"
        value={formData.sleepHours}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BedtimeIcon />
            </InputAdornment>
          ),
          inputProps: { min: 0 },
        }}
      />

      <TextField
        label="Sleep Quality (1-5)"
        name="sleepQuality"
        type="number"
        value={formData.sleepQuality}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StarRateIcon />
            </InputAdornment>
          ),
          inputProps: { min: 1, max: 5 },  // Rating from 1 to 5
        }}
      />

      <TextField
        label="Physical Activity"
        name="physicalActivity"
        value={formData.physicalActivity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FitnessCenterIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Social Interactions"
        name="socialInteractions"
        value={formData.socialInteractions}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PeopleIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Stress Level"
        name="stressLevel"
        type="number"
        value={formData.stressLevel}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StressManagementIcon />
            </InputAdornment>
          ),
          inputProps: { min: 0 },
        }}
      />

      <TextField
        label="Symptoms"
        name="symptoms"
        value={formData.symptoms}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
        Submit
      </Button>

      {isSubmitted && ( // Conditional rendering of the navigation button
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/data-visualization')} // Navigate to data-visualization
        >
          Go to Data Visualization
        </Button>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Box>
  );
};

export default DailyLogForm;
