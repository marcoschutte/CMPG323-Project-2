//#region import external modules
const express = require('express');
const authController = require('../controllers/auth');
//#endregion

//#region GET requests
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





router.get('/upload', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  
  if( req.user ) {
    res.render('upload', {
      user: req.user
    });
  } 
  else {
    res.redirect('/login');
  } 
});

router.get('/view', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  
  if( req.user ) {
    res.render('view', {
      user: req.user
    });
  } 
  else {
    res.redirect('/login');
  } 
});

router.get('/download', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  
  if( req.user ) {
    res.render('download', {
      user: req.user
    });
  } 
  else {
    res.redirect('/login');
  } 
});

router.get('/delete', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  
  if( req.user ) {
    res.render('delete', {
      user: req.user
    });
  } 
  else {
    res.redirect('/login');
  } 
});

router.get('/shared', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  
  if( req.user ) {
    res.render('shared', {
      user: req.user
    });
  } 
  else {
    res.redirect('/login');
  } 
});


module.exports = router;
//#endregion 