//#region import external modules 
const express = require("express");
//path module provides utilities for working with file and directory paths
const path = require('path'); 
//mysql module is used by nodejs to manipulate the DB
const mysql = require("mysql");
//dotenv module automatically loads environment variables from the .env file into the process
const dotenv = require('dotenv');
//middleware module used to parse cookies attached to the client request object
const cookieParser = require('cookie-parser');
const {engine} = require('express-handlebars');
const fileUpload = require('express-fileupload');
//#endregion

//load environment variables from .env file into the process
dotenv.config({ path: './.env'});

//used to start express application
const app = express();
const port = process.env.PORT || 3000;

//#region create connection to db
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
//#endregion

app.use(fileUpload());

//set view engine which is handlebars
app.engine('.hbs', engine({extname: 'hbs'}));
app.set('view engine', '.hbs');

//public directory is where files are stores for the frontend e.g. css & images
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//returns middleware that only parses urlencoded bodies
app.use(express.urlencoded({ extended: false }));

//used to make sure the value grabbed from the form are json
app.use(express.json());

app.use(cookieParser());







//redirects to where routes are stored
app.use('/', require('./routes/getRoutes'));
app.use('/auth', require('./routes/postRoutes'));

//function used to bind and listen the connections on the specified host and port
app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
})

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

pool.query('select 1 + 1', (err, rows) => { /* */ });

