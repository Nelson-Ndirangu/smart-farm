// Main controller
const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./configs/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const subscriptionRoutes = require("./routes/subsciptionRoutes");
const errorHandler = require('./middleware/errorHandler');


// App initialization
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors(
    {
        origin: 'ALLOWED_ORIGINS' ? process.env.ALLOWED_ORIGINS.split(',') : '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    
    }
));

// Security Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Connect to Database and Start Server
connectDB();


//  Getting the homepage
app.get('/', (req, res) => {
    res.send('Welcome to the Smart Farm API');
});


// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// error handler
app.use(errorHandler);

// health
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



