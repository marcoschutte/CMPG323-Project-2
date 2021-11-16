//import external modules
const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

//post requests used to submit data to be processed 
router.post('/register', authController.register );
router.post('/login', authController.login );
router.get('/logout', authController.logout );

module.exports = router;
