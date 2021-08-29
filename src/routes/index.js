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

const {
	getProducts,
	getProduct,
	addProduct,
	updateProduct,
	deleteProduct,
} = require('../controllers/product');

const {
	getToppings,
	getTopping,
	addTopping,
	updateTopping,
	deleteTopping,
} = require('../controllers/topping');

const {
	addTransaction,
	getTransactions,
	getTransaction,
	deleteTransaction,
	updateTransaction,
	getUserTransactions,
} = require('../controllers/transaction');

//* --------------------------  AUTH  ---------------------------- *//
router.post('/auth/register', register);
router.post('/auth/login', login);

//* -----------------------  USER ROUTE  ------------------------- *//
router.get('/users', authAdmin, getUsers);
router.get('/user/:id', authAdmin, getUser);
router.patch('/user/:id', auth, uploadFile('avatar'), updateUser);
router.delete('/user/:id', authAdmin, deleteUser);

//* ----------------------  PRODUCT ROUTE  ----------------------- *//
router.get('/products', getProducts);
router.get('/product/:id', getProduct);
router.post('/product', authAdmin, uploadFile('image'), addProduct);
router.patch('/product/:id', authAdmin, updateProduct);
router.delete('/product/:id', authAdmin, deleteProduct);

//* ----------------------  TOPPING ROUTE  ----------------------- *//
router.get('/toppings', getToppings);
router.get('/topping/:id', getTopping);
router.post('/topping', authAdmin, uploadFile('image'), addTopping);
router.patch('/topping/:id', authAdmin, updateTopping);
router.delete('/topping/:id', authAdmin, deleteTopping);

//* --------------------  TRANSACTION ROUTE  ---------------------- *//
router.get('/transactions', authAdmin, getTransactions);
router.get('/transaction/:id', authAdmin, getTransaction);
router.get('/my-transactions', auth, getUserTransactions);
router.post('/transaction', auth, addTransaction);
router.patch('/transaction/:id', authAdmin, updateTransaction);
router.delete('/transaction/:id', authAdmin, deleteTransaction);

module.exports = router;
