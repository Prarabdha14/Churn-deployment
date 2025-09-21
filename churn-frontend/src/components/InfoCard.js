import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function InfoCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card sx={{ mt: 4, mb: 4, backgroundColor: '#424242' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#61dafb' }} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1">
            {children}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default InfoCard;