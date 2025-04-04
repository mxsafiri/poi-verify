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
  Container,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { createProject } from '@/lib/db';
import type { Project, ProjectStatus } from '@/types/database';

interface ProjectFormData {
  name: string;
  description: string | null;
  metric: string | null;
  budget: string | null;
}

const NewProjectPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: null,
    metric: null,
    budget: null,
  });

  const steps = ['Project Details', 'Impact Metrics', 'Budget'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createProject({
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        metric: formData.metric || null,
        budget: formData.budget || null,
        status: 'Pending' as ProjectStatus,
        nft_minted: false,
        funded: false
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const getStepContent = (step: number) => {
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
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
          </>
        );
      case 1:
        return (
          <TextField
            fullWidth
            label="Impact Metric"
            name="metric"
            value={formData.metric || ''}
            onChange={handleInputChange}
            margin="normal"
            required
            helperText="Define how the project's impact will be measured"
          />
        );
      case 2:
        return (
          <TextField
            fullWidth
            label="Budget"
            name="budget"
            value={formData.budget || ''}
            onChange={handleInputChange}
            margin="normal"
            required
            helperText="Specify the required budget for this project"
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Project
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Create Project
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default NewProjectPage;
