const {
	Transaction,
	TransactionProduct,
	TransactionTopping,
	Product,
	Topping,
	User,
} = require('../../models');
const midtransClient = require('midtrans-client');

let snap = new midtransClient.Snap({
	isProduction: false,
	serverKey: process.env.SERVER_KEY,
});

//* Re-Useable Error message
const { success, failed, messageSuccess, messageFailed, messageEmpty } = {
	success: 'success',
	failed: 'failed',
	messageSuccess: (type, id) => `${type} Transaction/s success${id ? ` id : ${id}` : ``}`,
	messageFailed: (type, id) => `${type} Transaction/s fail${id ? ` id : ${id}` : ``}`,
	messageEmpty: `No data found`,
};

//* Re-Useable Error response
const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//*-------------------------------------------- Get All Transaction --------------------------------------------*//
exports.getTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.findAll({
			attributes: {
				exclude: ['userId', 'updatedAt'],
			},
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'fullName', 'email'],
				},
				{
					model: TransactionProduct,
					as: 'transactionProducts',
					attributes: ['id', 'qty'],
					include: [
						{
							model: Product,
							as: 'product',
							attributes: ['name', 'price', 'image'],
						},
						{
							model: TransactionTopping,
							as: 'transactionToppings',
							attributes: ['toppingId'],
							include: [
								{
									model: Topping,
									as: 'topping',
									attributes: ['name', 'price', 'image'],
								},
							],
						},
					],
				},
			],
		});

		if (transactions.length < 1) {
			return res.status(204).send({
				status: failed,
				message: messageEmpty,
				data: {
					transactions: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: {
				transactions,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Get Transaction by Id --------------------------------------------*//
exports.getTransaction = async (req, res) => {
	try {
		const { id } = req.params;
		const transaction = await Transaction.findOne({
			where: {
				id,
			},
			attributes: {
				exclude: ['userId', 'createdAt', 'updatedAt'],
			},
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'fullName', 'email'],
				},
				{
					model: TransactionProduct,
					as: 'transactionProducts',
					attributes: ['id', 'qty'],
					include: [
						{
							model: Product,
							as: 'product',
							attributes: ['name', 'price', 'image'],
						},
						{
							model: TransactionTopping,
							as: 'transactionToppings',
							attributes: ['toppingId'],
							include: [
								{
									model: Topping,
									as: 'topping',
									attributes: ['name', 'price', 'image'],
								},
							],
						},
					],
				},
			],
		});

		if (!transaction) {
			return res.status(400).send({
				status: failed,
				message: messageFailed('Get', id),
				data: {
					transaction: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get', id),
			data: {
				transaction,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get User Transaction --------------------------------------------*//
exports.getUserTransactions = async (req, res) => {
	try {
		const { id } = req.user;
		const transaction = await Transaction.findAll({
			where: {
				Userid: id,
			},
			attributes: {
				exclude: ['userId', 'updatedAt'],
			},
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'fullName', 'email'],
				},
				{
					model: TransactionProduct,
					as: 'transactionProducts',
					attributes: ['id', 'qty'],
					include: [
						{
							model: Product,
							as: 'product',
							attributes: ['name', 'price', 'image'],
						},
						{
							model: TransactionTopping,
							as: 'transactionToppings',
							attributes: ['toppingId'],
							include: [
								{
									model: Topping,
									as: 'topping',
									attributes: ['name', 'price', 'image'],
								},
							],
						},
					],
				},
			],
		});

		if (!transaction) {
			return res.status(204).send({
				status: failed,
				message: messageEmpty,
				data: {
					transaction: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get', id),
			data: {
				transaction,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Add User Transaction --------------------------------------------*//
exports.addTransaction = async (req, res) => {
	try {
		const { body, user } = req;
		const userId = user.id;
		const date = Date.now();
		const order_id = `${userId}-${date}`;
		const name = body.name.split(' ');
		let parameter = {
			transaction_details: {
				order_id,
				gross_amount: body.income,
			},
			credit_card: {
				secure: true,
			},
			customer_details: {
				first_name: name[0],
				last_name: name[name.length - 1],
				email: body.email,
				phone: body.phone,
			},
		};

		const payment = await snap.createTransaction(parameter);
		const transactionData = {
			...body,
			transactionProducts: JSON.parse(req.body.transactionProducts),
			status: 'Waiting Approval',
			userId,
			attachment: req.file.path,
		};

		const transaction = await Transaction.create(transactionData, {
			include: [
				{
					association: 'transactionProducts',
					include: [
						{
							association: 'transactionToppings',
						},
					],
				},
			],
		});

		res.status(201).send({
			status: success,
			message: messageSuccess('Add User'),
			data: {
				transaction,
				payment,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Update Transaction --------------------------------------------*//
exports.updateTransaction = async (req, res) => {
	try {
		const { id } = req.params;
		const { body: transactionData } = req;

		const isTransactionExist = await Transaction.findOne({
			where: {
				id,
			},
		});
		if (!isTransactionExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					transaction: [],
				},
			});
		}

		await Transaction.update(transactionData, {
			where: {
				id,
			},
		});

		const newTransaction = await Transaction.findOne({
			where: {
				id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'UserId'],
			},
		});

		res.send({
			status: success,
			message: messageSuccess('Update', id),
			data: {
				transaction: newTransaction,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Delete Transaction --------------------------------------------*//
exports.deleteTransaction = async (req, res) => {
	try {
		const { id } = req.params;

		const isTransactionExist = await Transaction.findOne({
			where: {
				id,
			},
		});
		if (!isTransactionExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					transaction: [],
				},
			});
		}

		await Transaction.destroy({
			where: {
				id,
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Delete', id),
			data: {
				transaction: null,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Get Transaction Product Count  --------------------------------------------*//
exports.getTransactionProductCount = async (req, res) => {
	try {
		const { id } = req.params;

		const response = await TransactionProduct.count({
			where: {
				productId: id,
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Get Product Count', id),
			data: {
				count: response,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Get Transaction Topping Count  --------------------------------------------*//
exports.getTransactionToppingCount = async (req, res) => {
	try {
		const { id } = req.params;

		const response = await TransactionTopping.count({
			where: {
				toppingId: id,
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Get Topping Count', id),
			data: {
				count: response,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};
