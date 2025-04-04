'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { createProject } from '@/lib/db';
import { useAuth } from '@/lib/auth/AuthContext';

const steps = ['Project Details', 'Impact Metrics', 'Review'];

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metric: '',
    budget: '',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await createProject({
        ...formData,
        user_id: user.id,
        status: 'Pending',
        nft_minted: false,
        funded: false,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
              sx={{ mb: 3 }}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Impact Metric"
              name="metric"
              value={formData.metric}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              helperText="Describe how the impact will be measured"
            />
            <TextField
              fullWidth
              label="Budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: '$',
              }}
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Project Summary
            </Typography>
            <Typography><strong>Name:</strong> {formData.name}</Typography>
            <Typography><strong>Description:</strong> {formData.description}</Typography>
            <Typography><strong>Impact Metric:</strong> {formData.metric}</Typography>
            <Typography><strong>Budget:</strong> ${formData.budget}</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          Create New Project
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Project'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
