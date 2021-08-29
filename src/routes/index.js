const express = require('express');
const router = express.Router();
const { auth, authAdmin } = require('../middlewares/auth');
const { register, login } = require('../controllers/auth');
const { uploadFile } = require('../middlewares/uploadFile');

const {
	getUsers,
	getUser,
	updateUser,
	deleteUser,
} = require('../controllers/user');

//* --------------------------  AUTH  ---------------------------- *//
router.post('/auth/register', register);
router.post('/auth/login', login);

//* -----------------------  USER ROUTE  ------------------------- *//
router.get('/users', authAdmin, getUsers);
router.get('/user/:id', authAdmin, getUser);
router.patch('/user/:id', auth, uploadFile('avatar'), updateUser);
router.delete('/user/:id', authAdmin, deleteUser);

module.exports = router;
