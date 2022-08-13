require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Bring Routes
const ApiRoutes = require('./routes/api');

const app = express();

// Database
mongoose
  .connect(process.env.DB_HOST, { 
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('[+] Connect Database Success')
  })

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

if(process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: process.env.CLIENT_URL }))
}

// Routes
app.use('/api', ApiRoutes);

// catch Error 404
app.use(function(req, res, next) {
  let error = new Error('Not found');
  error.status = 404;
  next(error);
})

// Handle return Error to frontend
app.use(function(error, req, res, next) {
  let { status=500 , message = 'Something went wrong' } = error;
  console.log(error)
  return res.status(status).send(message)
})

// Start
let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`[+] Server start on port ${port}`);
})
