const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./database');
const dotenv = require('dotenv');



dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes);



const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
