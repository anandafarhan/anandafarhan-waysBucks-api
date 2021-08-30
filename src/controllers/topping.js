const { Topping } = require('../../models');

//* Re-Useable Error message
const { success, failed, messageSuccess, messageFailed, messageEmpty } = {
	success: 'success',
	failed: 'failed',
	messageSuccess: (type, id) =>
		`${type} Topping/s success${id ? ` id : ${id}` : ``}`,
	messageFailed: (type, id) =>
		`${type} Topping/s fail${id ? ` id : ${id}` : ``}`,
	messageEmpty: `No data found`,
};

//* Re-Useable Error response
const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//*-------------------------------------------- Get All Topping --------------------------------------------*//
exports.getToppings = async (req, res) => {
	try {
		const toppings = await Topping.findAll({
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});

		if (toppings.length < 1) {
			return res.status(204).send({
				status: failed,
				message: messageEmpty,
				data: {
					toppings: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: { toppings },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get Topping by Id --------------------------------------------*//
exports.getTopping = async (req, res) => {
	try {
		const { id } = req.params;
		const topping = await Topping.findOne({
			where: {
				id: id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});

		if (!topping) {
			return res.status(400).send({
				status: failed,
				message: messageFailed('Get', id),
				data: {
					topping: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get', id),
			data: { topping },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Add Topping --------------------------------------------*//
exports.addTopping = async (req, res) => {
	try {
		const newTopping = await Topping.create({
			...req.body,
			image: req.file.path,
		});
		const newToppingData = await Topping.findOne({
			where: {
				id: newTopping.id,
			},
		});
		res.status(201).send({
			status: success,
			message: messageSuccess('Create'),
			data: { newToppingData },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Update Topping --------------------------------------------*//
exports.updateTopping = async (req, res) => {
	try {
		const { id } = req.params;

		const isToppingExist = await Topping.findOne({
			where: {
				id,
			},
		});

		if (!isToppingExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					topping: [],
				},
			});
		}

		await Topping.update(req.body, {
			where: {
				id,
			},
		});

		const updatedTopping = await Topping.findOne({
			where: {
				id,
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Update', id),
			data: { updatedTopping },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Delete Topping --------------------------------------------*//
exports.deleteTopping = async (req, res) => {
	try {
		const { id } = req.params;

		const isToppingExist = await Topping.findOne({
			where: {
				id,
			},
		});

		if (!isToppingExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					topping: [],
				},
			});
		}

		await Topping.destroy({
			where: {
				id,
			},
		});

		res.send({
			status: success,
			message: messageSuccess('Delete', id),
			data: {},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};
