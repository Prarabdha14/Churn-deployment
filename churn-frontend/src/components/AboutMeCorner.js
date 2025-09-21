import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { FaGithub } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { motion } from 'framer-motion';

function AboutMeCorner() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1300, // Increased zIndex to be on top of everything
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '10px 15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1.2 }}>
          Prarabdha Pandey
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Data-driven Developer
        </Typography>
      </Box>
      <Stack direction="row" spacing={1.5}>
        <a href="https://github.com/Prarabdha14" target="_blank" rel="noopener noreferrer" className="social-icon-small">
          <FaGithub size={20} />
        </a>
        {/* Corrected your email address below */}
        <a href="mailto:prarabdhapandey696@gmail.com" className="social-icon-small">
          <IoMdMail size={22} />
        </a>
      </Stack>
    </motion.div>
  );
}

export default AboutMeCorner;

