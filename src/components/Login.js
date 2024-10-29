import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import api from './../api';
import { Button, Typography, Box } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      authenticateUser(token);
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Sign-in failed. Please try again.");
    }
  };

  const authenticateUser = async (token) => {
    try {
      const response = await api.post(
        '/api/login',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Authenticated successfully!");
      console.log("Backend response:", response.data);
      navigate('/daily-log');
    } catch (error) {
      console.error("Error during backend authentication:", error);
      toast.error("Authentication failed. Please try again.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h4" gutterBottom>
        Health Tracker Login
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={signInWithGoogle}
        startIcon={<GoogleIcon />}
        sx={{ mt: 2 }}
      >
        Sign in with Google
      </Button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Box>
  );
};

export default Login;
