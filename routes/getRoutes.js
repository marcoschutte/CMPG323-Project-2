const express = require('express');
const mysql = require("mysql");
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.isLoggedIn, (req, res) => {
  res.render('index', {
    user: req.user
  });
});


router.get('/register', (req, res) => {
  res.render('register');
});


router.get('/login', (req, res) => {
  res.render('login');
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
