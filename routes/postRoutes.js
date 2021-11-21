const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register );
router.post('/login', authController.login );

router.post('/upload', authController.upload );
router.post('/view', authController.view );
router.post('/download', authController.download );
router.post('/delete', authController.delete );
router.post('/shared', authController.shared );

router.get('/logout', authController.logout );

module.exports = router;
