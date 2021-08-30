const {
	Transaction,
	TransactionProduct,
	TransactionTopping,
	Product,
	Topping,
	User,
} = require('../../models');

//* Re-Useable Error message
const { success, failed, messageSuccess, messageFailed, messageEmpty } = {
	success: 'success',
	failed: 'failed',
	messageSuccess: (type, id) =>
		`${type} Transaction/s success${id ? ` id : ${id}` : ``}`,
	messageFailed: (type, id) =>
		`${type} Transaction/s fail${id ? ` id : ${id}` : ``}`,
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
				exclude: ['userId', 'createdAt', 'updatedAt'],
			},
			include: [
				{
					model: User,
					as: 'user',
					attributes: {
						exclude: ['id', 'password', 'roleId', 'createdAt', 'updatedAt'],
					},
				},
				{
					model: TransactionProduct,
					as: 'transactionProducts',
					attributes: {
						exclude: [
							'id',
							'transactionId',
							'productId',
							'createdAt',
							'updatedAt',
						],
					},
					include: [
						{
							model: Product,
							as: 'product',
							attributes: {
								exclude: ['id', 'createdAt', 'updatedAt'],
							},
						},
						{
							model: TransactionTopping,
							as: 'transactionToppings',
							attributes: {
								exclude: [
									'id',
									'toppingId',
									'TransactionProductId',
									'createdAt',
									'updatedAt',
								],
							},
							include: [
								{
									model: Topping,
									as: 'topping',
									attributes: {
										exclude: ['id', 'createdAt', 'updatedAt'],
									},
								},
							],
						},
					],
				},
			],
		});

		if (transactions.length === 0) {
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
				exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
			},
			include: [
				{
					model: User,
					as: 'user',
					attributes: {
						exclude: [
							'password',
							'createdAt',
							'updatedAt',
							'deletedAt',
							'userId',
							'UserId',
						],
					},
				},
				{
					model: TransactionProduct,
					as: 'transactionProducts',
					attributes: {
						exclude: [
							'createdAt',
							'updatedAt',
							'productId',
							'ProductId',
							'transactionId',
							'TransactionId',
						],
					},
					include: [
						{
							model: Product,
							as: 'product',
							attributes: {
								exclude: ['createdAt', 'updatedAt', 'ProductId'],
							},
						},
						{
							model: TransactionTopping,
							as: 'transactionToppings',
							attributes: {
								exclude: [
									'transactionProductId',
									'createdAt',
									'updatedAt',
									'TransactionProductId',
									'ToppingId',
									'toppingId',
								],
							},
							include: [
								{
									model: Topping,
									as: 'topping',
									attributes: {
										exclude: ['createdAt', 'updatedAt', 'ToppingId'],
									},
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
		const transaction = await Transaction.findOne({
			where: {
				Userid: id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
			},
			include: [
				{
					model: User,
					as: 'user',
					attributes: {
						exclude: [
							'password',
							'createdAt',
							'updatedAt',
							'deletedAt',
							'userId',
							'UserId',
						],
					},
				},
				{
					model: TransactionProduct,
					as: 'transactionProducts',
					attributes: {
						exclude: [
							'createdAt',
							'updatedAt',
							'productId',
							'ProductId',
							'transactionId',
							'TransactionId',
						],
					},
					include: [
						{
							model: Product,
							as: 'product',
							attributes: {
								exclude: ['createdAt', 'updatedAt', 'ProductId'],
							},
						},
						{
							model: TransactionTopping,
							as: 'transactionToppings',
							attributes: {
								exclude: [
									'transactionProductId',
									'createdAt',
									'updatedAt',
									'TransactionProductId',
									'ToppingId',
									'toppingId',
								],
							},
							include: [
								{
									model: Topping,
									as: 'topping',
									attributes: {
										exclude: ['createdAt', 'updatedAt', 'ToppingId'],
									},
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
		const transactionData = {
			...body,
			userId,
			attachment: null,
		};
		console.log(transactionData);

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
