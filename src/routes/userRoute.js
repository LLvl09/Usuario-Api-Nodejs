const express = require('express');
const router= express.Router();
const controller = require('../controllers/userController');
const checkToken = require('../services/checkToken');

router.get('/user/:id', checkToken.check,  controller.private);
router.post('/register', controller.post);
router.post('/login', controller.login);


module.exports = router;