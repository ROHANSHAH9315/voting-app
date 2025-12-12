const express = require('express');
const app = express();
const db = require("./db");
require('dotenv').config();
// const passport = require('./auth');

const bodyParser = require('body-parser');
app.use(express.json()); // bodyParae take data an convert it into object then store data in (req.body).
const PORT = process.env.PORT || 3000;

// import the router files
const userRoutes = require('./routes/userRoutes.js');
const candidateRoutes = require('./routes/candidateRoutes.js');
// use the routes.
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(PORT,()=>{
  console.log('surver is activated(3000)')
}); 
