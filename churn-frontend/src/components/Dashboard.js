import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box } from '@mui/material';
// Corrected: Combined all framer-motion imports into one line
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView as useIntersectionObserver } from 'react-intersection-observer'; // Renamed to avoid conflict

// --- Animated Counter Component ---
function AnimatedCounter({ to }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const [ref, inView] = useIntersectionObserver({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2 });
      return controls.stop;
    }
  }, [inView, count, to]);

  return <motion.h3 ref={ref} style={{ margin: 0, fontSize: '3rem', color: '#00e5ff' }}>{rounded}</motion.h3>;
}
// Corrected: Removed the extra closing brace that was here

function Dashboard() {
  const TABLEAU_URL = "https://public.tableau.com/app/profile/prarabdha.pandey/viz/Churn_17583946460390/Dashboard1?publish=yes";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center' }}>
      <Typography variant="h3" component="h1" className="main-title" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: '600px', margin: 'auto' }}>
        "The full project findings are consolidated in a live, interactive dashboard built with Tableau. Below are some key metrics discovered."
      </Typography>
      
      {/* --- Key Metrics Section --- */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 5 }}>
        
        <Grid item xs={12} md={4}>
          <Card className="hub-card">
            <CardContent>
              <Typography color="text.secondary">Overall Churn Rate</Typography>
              <AnimatedCounter to={27} />
              <Typography>%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
           <Card className="hub-card">
            <CardContent>
              <Typography color="text.secondary">Customers Analyzed</Typography>
              <AnimatedCounter to={7032} />
              <Typography>Records</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
           <Card className="hub-card">
            <CardContent>
              <Typography color="text.secondary">High-Risk Contracts</Typography>
              <AnimatedCounter to={42} />
              <Typography>% Churn on M2M Fiber</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
      
      <motion.div whileHover={{ scale: 1.05 }}>
        <Button
          href={TABLEAU_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          className="dashboard-button"
          size="large"
        >
          Open Full Interactive Dashboard
        </Button>
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;