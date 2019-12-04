const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mongoURI = 'mongodb://localhost/url-shortner';
const connectOptions = {
  keepAlive: true
};
//Connect to MongoDB
// mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log(`Error connecting to mongo`, err);
  console.log(`Connected to MongoDB`);
});
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());
require('./models/url.model.');
require('./controllers/url.controller')(app);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server started on port`, PORT);
});

process.on('uncaughtException', e => {
  console.log(e);
});

process.on('unhandledRejection', e => {
  console.log(e);
});
