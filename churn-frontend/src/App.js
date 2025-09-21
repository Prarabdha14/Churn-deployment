import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink as BaseNavLink } from 'react-router-dom';
import './App.css';
import Prediction from './components/Prediction';
import Segmentation from './components/Segmentation';
import Dashboard from './components/Dashboard';
import AboutMeCorner from './components/AboutMeCorner';
import { Container, AppBar, Toolbar, Card, CardContent, Typography, Button, Grid, createTheme, ThemeProvider, CssBaseline, Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';

// --- Theme Definition ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00e5ff' },
    background: { default: '#0f172a', paper: 'rgba(255, 255, 255, 0.05)'},
    text: { primary: '#e2e8f0', secondary: '#94a3b8' },
  },
});

// --- Hub/Homepage Component ---
function Hub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  const cards = [
    { title: "Churn Prediction", description: "Use a live AI model to predict customer churn probability.", link: "/prediction", buttonText: "Launch Tool" },
    { title: "Segmentation", description: "Discover customer segments based on their behavior.", link: "/segmentation", buttonText: "Launch Tool" },
    { title: "BI Dashboard", description: "View the full interactive analytics dashboard on Tableau.", link: "/dashboard", buttonText: "View Dashboard" }
  ];

  return (
    <div className="hub-container">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" component="h1" className="main-title" gutterBottom align="center">
          Customer Analytics Hub
        </Typography>
      </motion.div>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {cards.map((card, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div variants={cardVariants} whileHover={{ y: -10, boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.5)" }} style={{ height: '100%' }}>
                <Card className="hub-card">
                  <CardContent>
                    <Typography variant="h5" component="div">{card.title}</Typography>
                    <Typography sx={{ mb: 1.5, minHeight: '60px' }} color="text.secondary">{card.description}</Typography>
                    <Button component={BaseNavLink} to={card.link} variant="contained" className="hub-button">{card.buttonText}</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </div>
  );
}

// --- Main App Component ---
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <AppBar position="sticky" color="transparent" elevation={0} className="app-bar">
            <Toolbar>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={4}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/prediction">Prediction</NavLink>
                <NavLink to="/segmentation">Segmentation</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
          </AppBar>
          
          <AboutMeCorner /> 

          <main className="main-content">
            <Container>
              <Routes>
                <Route path="/" element={<Hub />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/segmentation" element={<Segmentation />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Container>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// --- NavLink Component for Active Styling ---
const NavLink = React.forwardRef((props, ref) => (
  <BaseNavLink
    ref={ref}
    {...props}
    className={({ isActive }) => ['nav-link', isActive ? 'active' : null].filter(Boolean).join(' ')}
  />
));

export default App;

