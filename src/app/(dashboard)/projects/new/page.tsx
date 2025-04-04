'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Chip,
  MenuItem,
} from '@mui/material';
import { supabase } from '@/lib/supabase';

const steps = ['START HERE', 'IMPACT METRICS', 'VERIFICATION', 'REVIEW'];

export default function NewProjectPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metric: '',
    budget: '',
    impactCategory: '',
    verificationFrequency: '',
    measurementUnits: '',
    quantifiableMetrics: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase.from('projects').insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        metric: formData.metric,
        budget: formData.budget,
        status: 'Pending',
      });

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Submit New Impact Project
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Project Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="name"
                label="Project Title"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Project Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
                helperText="Tell us what you want to achieve"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="impactCategory"
                label="Impact Category"
                value={formData.impactCategory}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="environmental">Environmental</MenuItem>
                <MenuItem value="social">Social</MenuItem>
                <MenuItem value="economic">Economic</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="budget"
                label="Budget (USD)"
                value={formData.budget}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Verification Plan
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="measurementUnits"
                label="Measurement Units"
                value={formData.measurementUnits}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="verificationFrequency"
                label="Verification Frequency"
                value={formData.verificationFrequency}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  sx={{ borderColor: 'divider' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    bgcolor: '#00C853',
                    '&:hover': {
                      bgcolor: '#00B34A',
                    },
                  }}
                >
                  Submit Project
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
