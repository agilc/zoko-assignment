const mongoose = require('mongoose');
const resources = require('./routes/resources');
const express = require('express');
const app = express();

// mongoose.connect('mongodb://localhost/product')
mongoose.connect('mongodb://herokuhost/reallyLongLinkTheyProvide')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/product', resources);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));