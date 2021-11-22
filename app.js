const express = require("express");
const path = require('path'); 
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const {engine} = require('express-handlebars');
const fileUpload = require('express-fileupload');

dotenv.config({ path: './.env'});

const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  connectionLimit   : 10,
  host              : process.env.DATABASE_HOST,
  user              : process.env.DATABASE_USER,
  password          : process.env.DATABASE_PASSWORD,
  database          : process.env.DATABASE
});

pool.getConnection((err, connection) => {
  if(err) throw err;
  console.log('Successfully connected to MySQL database');
})

app.use(fileUpload());

app.use(express.static('public'));
app.use(express.static('upload'));


app.engine('.hbs', engine({extname: 'hbs'}));
app.set('view engine', '.hbs');

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));


app.use(express.urlencoded({ extended: false }));


app.use(express.json());

app.use(cookieParser());







app.use('/', require('./routes/getRoutes'));
app.use('/auth', require('./routes/postRoutes'));

app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
})



pool.query('select 1 + 1', (err, rows) => { /* */ });

