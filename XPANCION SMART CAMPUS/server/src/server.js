/**
 * SmartCampus Enterprise Backend Server
 * Express.js microservice handling Health Center, Attendance Excusal, and IoT Switch Control.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const healthRoutes = require('./routes/health');
const iotRoutes = require('./routes/iot');

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root & Healthcheck
app.get('/', (req, res) => {
  res.json({
    platform: 'SmartCampus Integrated Operating System',
    version: '2.0.0',
    status: 'ONLINE',
    modules: ['health-infirmary', 'academic-attendance-sync', 'mobile-iot-switches', 'emergency-dispatch'],
    documentation: '/api/v1/docs'
  });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// API Routes Mount
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/iot', iotRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

// Server Launch
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SmartCampus Backend API running on http://localhost:${PORT}`);
    console.log(`🏥 Health & Medical Leave: http://localhost:${PORT}/api/v1/health/medical-leave`);
    console.log(`⚡ IoT Smart Switch Toggle: http://localhost:${PORT}/api/v1/iot/switch/toggle`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
