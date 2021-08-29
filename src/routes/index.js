const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

//* --------------------------  AUTH  ---------------------------- *//
router.post('/auth/login', login);

module.exports = router;
