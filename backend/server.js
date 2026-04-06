require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const db = require('./config/db');
const swaggerDocument = require('./docs/swagger');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const entryRequestRoutes = require('./routes/entryRequestRoutes');
const entryLogRoutes = require('./routes/entryLogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB connection route
app.get('/', (req, res) => {
    res.json({
        message: 'Gate Manager API is running',
        docs: `http://localhost:${PORT}/api-docs`,
    });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/entry-requests', entryRequestRoutes);
app.use('/api/entry-logs', entryLogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});