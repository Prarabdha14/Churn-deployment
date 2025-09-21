import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel, TextField, Stack, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- (Helper Data and Gauge Component remain the same) ---
const options = {
  contract: ['Month-to-month', 'One year', 'Two year'],
  internet_service: ['DSL', 'Fiber optic', 'No'],
};

const ProbabilityGauge = ({ probability }) => {
  const probValue = parseFloat(probability) || 0;
  const data = [{ name: 'Churn Probability', value: probValue }, { name: 'Remaining', value: 100 - probValue }];
  const COLORS = ['#ff4d4d', 'rgba(255, 255, 255, 0.1)'];
  return (
    <Stack alignItems="center" spacing={1}>
      <div style={{ width: '100%', height: 100 }}><ResponsiveContainer><PieChart><Pie data={data} innerRadius={40} outerRadius={50} startAngle={180} endAngle={0} dataKey="value" cy="100%">{data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />))}</Pie></PieChart></ResponsiveContainer></div>
      <div><Typography variant="h4" style={{ color: '#ff4d4d' }}>{`${probValue.toFixed(2)}%`}</Typography><Typography variant="subtitle1" color="text.secondary">Churn Risk</Typography></div>
    </Stack>
  );
};
// ----------------------------------------------------------------

function Prediction() {
  const [formData, setFormData] = useState({
     tenure: 12, internet_service: 'DSL', contract: 'Month-to-month',
     tech_support: 'No', online_security: 'No',
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction({ status: 'Loading...' });
    const fullData = {
        gender: 'Male', senior_citizen: 0, partner: 'Yes', dependents: 'No', 
        phone_service: 'Yes', multiple_lines: 'No', online_backup: 'No', 
        device_protection: 'No', streaming_tv: 'No', streaming_movies: 'No', 
        paperless_billing: 'Yes', payment_method: 'Electronic check', 
        monthly_charges: 75.50, total_charges: 850.5, ...formData
    };
    const API_URL = 'https://churn-deployment.onrender.com/predict';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData)
      });
      const data = await response.json();
      setPrediction({ status: data.churn, probability: data.probability.replace('%','') });
    } catch (error) {
      setPrediction({ status: 'Error', probability: '0' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* --- TOP TEXT SECTION --- */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
    <Typography variant="h3" component="h1" className="main-title" gutterBottom>
      Live Churn Predictor
    </Typography>
  </motion.div>
  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
    <Typography variant="h5" component="h2" gutterBottom>
      Solving a Critical Business Problem
    </Typography>
  </motion.div>
  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
    <Typography variant="body1" color="text.secondary">
      “This AI tool looks at your customer data in real time to guess who might leave. By changing the customer details below, you can see which factors affect loyalty the most and make smarter steps to keep customers.”
    </Typography>
  </motion.div>
</Box>

      {/* --- BOTTOM INTERACTIVE SECTION --- */}
      <Grid container spacing={4} alignItems="stretch">
        {/* Left Column: Form */}
        <Grid item xs={12} md={7}>
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
             <form onSubmit={handleSubmit} style={{ height: '100%' }}>
               <Stack spacing={3} sx={{ height: '100%'}}>
                  <Card className="glass-card" sx={{ flexGrow: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Customer Profile</Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth><InputLabel>Contract</InputLabel><Select name="contract" value={formData.contract} label="Contract" onChange={handleChange}>{options.contract.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Tenure (months)" name="tenure" type="number" value={formData.tenure} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth><InputLabel>Internet Service</InputLabel><Select name="internet_service" value={formData.internet_service} label="Internet Service" onChange={handleChange}>{options.internet_service.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Stack>
                            <FormControlLabel control={<Switch checked={formData.tech_support === 'Yes'} onChange={(e) => setFormData({...formData, tech_support: e.target.checked ? 'Yes' : 'No'})} />} label="Tech Support" />
                            <FormControlLabel control={<Switch checked={formData.online_security === 'Yes'} onChange={(e) => setFormData({...formData, online_security: e.target.checked ? 'Yes' : 'No'})} />} label="Online Security" />
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Button type="submit" variant="contained" size="large" className="predict-button">
                    Calculate Churn Risk
                  </Button>
                </Stack>
             </form>
          </motion.div>
        </Grid>

        {/* Right Column: Prediction Result */}
        <Grid item xs={12} md={5}>
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Prediction Result</Typography>
                {prediction ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{textAlign: 'center'}}>
                    <ProbabilityGauge probability={prediction.probability} />
                    <Typography variant="h6" sx={{ mt: 2 }}>Predicted Outcome: <span style={{ color: prediction.status === 'Yes' ? '#ff4d4d' : '#4caf50', fontWeight: 'bold' }}>{` ${prediction.status}`}</span></Typography>
                  </motion.div>
                ) : (
                  <Typography color="text.secondary" sx={{ mt: 4, p: 2, textAlign: 'center' }}>
                    The live prediction will appear here.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default Prediction;