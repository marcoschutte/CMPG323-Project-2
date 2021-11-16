//import external modules 
const express = require("express");
//path module provides utilities for working with file and directory paths
const path = require('path'); 
//mysql module is used by nodejs to manipulate the DB
const mysql = require("mysql");
//dotenv module automatically loads environment variables from the .env file into the process
const dotenv = require('dotenv');
//middleware module used to parse cookies attached to the client request object
const cookieParser = require('cookie-parser');

//load environment variables from .env file into the process
dotenv.config({ path: './.env'});

//used to start express application
const app = express();

//create connection to db using variables from .env file
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

//connect to database
db.connect( (error) => {
  if(error) {
    console.log(error)
  } else {
    console.log("Successfully connected to MySQL database!")
  }
})

//set view engine which is handlebars
app.set('view engine', 'hbs');

//public directory is where files are stores for the frontend e.g. css & images
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//returns middleware that only parses urlencoded bodies
app.use(express.urlencoded({ extended: false }));

//used to make sure the value grabbed from the form are json
app.use(express.json());

app.use(cookieParser());

//redirects to where routes are stored
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

//function used to bind and listen the connections on the specified host and port
app.listen(3000, () => {
  console.log("Server started on Port 3000");
})