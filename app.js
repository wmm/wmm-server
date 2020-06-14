const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');

const app = express();

// CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', userRouter);

// Route not found
app.use((req, res) => {
    return res.status(404).json('Route not found');
});

// Error handling
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).json();
});

module.exports = app;
