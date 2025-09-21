import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, TextField, Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';

function Segmentation() {
  const [tenure, setTenure] = useState(10);
  const [monthlyCharges, setMonthlyCharges] = useState(50.0);
  const [segment, setSegment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSegment('Loading...');
    const API_URL = 'https://churn-deployment.onrender.com/segment'; // Your Render URL

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'tenure': tenure, 'MonthlyCharges': monthlyCharges })
      });
      const data = await response.json();
      setSegment(data.segment);
    } catch (error) {
      setSegment('Error: Could not connect to API');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* --- TOP TEXT SECTION --- */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Typography variant="h3" component="h1" className="main-title" gutterBottom>
            Customer Segmentation
          </Typography>
        </motion.div>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
           <div className="info-box">
             <Typography variant="h6" gutterBottom>What Are Segments?</Typography>
             <Typography variant="body2">
                "This tool uses a K-Means clustering model to group customers based on their loyalty (tenure) and spending. These are the same segments you can see in the scatter plot on our Tableau Dashboard, allowing us to create targeted marketing strategies for groups like "High-Value Loyalists" or "New & At-Risk" customers.""
             </Typography>
           </div>
        </motion.div>
      </Box>

      {/* --- BOTTOM INTERACTIVE SECTION --- */}
      <Box display="flex" justifyContent="center">
        <Grid container spacing={4} alignItems="stretch" sx={{ maxWidth: '1200px' }}>
          {/* Left Column: Form */}
          <Grid item xs={12} md={7}>
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card className="glass-card" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">Customer Attributes</Typography>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Tenure (months)"
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(parseInt(e.target.value))}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Monthly Charges ($)"
                        type="number"
                        inputProps={{ step: "0.01" }}
                        value={monthlyCharges}
                        onChange={(e) => setMonthlyCharges(parseFloat(e.target.value))}
                      />
                      <Button type="submit" variant="contained" size="large" className="predict-button">
                        Find Segment
                      </Button>
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column: Segmentation Result */}
          <Grid item xs={12} md={5}>
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom>Segmentation Result</Typography>
                  {segment ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                       <Typography variant="h4" sx={{ mt: 2, color: '#00e5ff' }}>
                         {segment}
                       </Typography>
                    </motion.div>
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 4 }}>
                      The customer segment will appear here.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div> // <-- This was the missing closing tag
  );
}

export default Segmentation;