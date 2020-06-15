const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user');
const vehicleRoutes = require('./routes/vehicles');
const transactionRoutes = require('./routes/transaction');

const port = process.env.PORT || 5000;

const app = express();

mongoose
  .connect(
    `mongodb+srv://patrickjasonduque:${process.env
      .MONGO_DB_PASSWORD}@vue-express-bwhrc.mongodb.net/cp3-db?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => console.log('connected'))
  .catch(err => console.log('cannot connect', { err }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.listen(port);
console.log('listening in port ' + port);
