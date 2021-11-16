//import external modules
const express = require('express');
const authController = require('../controllers/auth');

//used to create router handlers
const router = express.Router();


router.get('/', authController.isLoggedIn, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

//requests data from user registration page & renders user registration page
router.get('/register', (req, res) => {
  res.render('register');
});

//requests data from login page & render user login page 
router.get('/login', (req, res) => {
  res.render('login');
});

//render user profile page 
router.get('/profile', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  
  if( req.user ) {
    res.render('profile', {
      user: req.user
    });
  } 
  else {
    res.redirect('/login');
  } 
});

module.exports = router;