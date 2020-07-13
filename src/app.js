const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const auth = require('./helpers/auth');
const userRouter = require('./routes/userRoutes');
const loanRouter = require('./routes/loanRoutes');
const friendRouter = require('./routes/friendRoutes');

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
app.use('/loans', auth.requireLogin, loanRouter);
app.use('/friends', auth.requireLogin, friendRouter);

// Route not found
app.use((req, res) => {
    return res.status(404).json('Route not found');
});

// Error handling
app.use(function (err, req, res, next) {
    if (err.status) {
        return res.status(err.status).json(err.message);
    }

    console.error(err);
    res.status(500).json();
});

module.exports = app;
