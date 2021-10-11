const { UserAddresses, User } = require('../../models');

//* Re-Useable Error message
const { success, failed, messageSuccess, messageFailed, messageEmpty } = {
	success: 'success',
	failed: 'failed',
	messageSuccess: (type, id) => `${type} Address/es success${id ? ` id : ${id}` : ``}`,
	messageFailed: (type, id) => `${type} Address/es fail${id ? ` id : ${id}` : ``}`,
	messageEmpty: `No data found`,
};

//* Re-Useable Error response
const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//*-------------------------------------------- Get All Addresses --------------------------------------------*//
exports.getAddresses = async (req, res) => {
	try {
		const addresses = await UserAddresses.findAll({
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
			include: {
				model: User,
				as: 'User',
				attributes: ['fullName', 'email'],
			},
		});

		if (addresses.length < 1) {
			return res.status(204).send({
				status: failed,
				message: messageEmpty,
				data: {
					addresses: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: { addresses },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get Address by Id --------------------------------------------*//
exports.getAddress = async (req, res) => {
	try {
		const { id } = req.params;
		const address = await UserAddresses.findOne({
			where: {
				id: id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
			include: {
				model: User,
				as: 'User',
				attributes: ['fullName', 'email'],
			},
		});

		if (!address) {
			return res.status(400).send({
				status: failed,
				message: messageFailed('Get', id),
				data: {
					address: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: { address },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get User Addresses --------------------------------------------*//
exports.getUserAddresses = async (req, res) => {
	try {
		const { id } = req.user;
		const addresses = await UserAddresses.findAll({
			where: {
				userId: id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
			order: [['createdAt', 'DESC']],
			include: {
				model: User,
				as: 'User',
				attributes: ['fullName', 'email'],
			},
		});

		if (addresses.length < 1) {
			return res.status(204).send({
				status: failed,
				message: messageEmpty,
				data: {
					addresses: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: { addresses },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Add User Address --------------------------------------------*//
exports.addUserAddress = async (req, res) => {
	try {
		const { body, user } = req;
		const userId = user.id;
		const address = await UserAddresses.create({ ...body, userId });

		res.status(201).send({
			status: success,
			message: messageSuccess('Add Address'),
			data: {
				address,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Update User Address --------------------------------------------*//
exports.updateUserAddress = async (req, res) => {
	try {
		const { body } = req;
		const { id } = req.params;

		const isAddressExist = await UserAddresses.findOne({
			where: {
				id,
			},
		});
		if (!isAddressExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					address: [],
				},
			});
		}

		await UserAddresses.update(
			{ ...body },
			{
				where: {
					id,
				},
			}
		);

		const newAddress = await UserAddresses.findOne({
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
				address: newAddress,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Set Primary User Address --------------------------------------------*//
exports.setPrimaryUserAddress = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const isAddressExist = await UserAddresses.findOne({
			where: {
				id,
			},
		});
		if (!isAddressExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					address: [],
				},
			});
		}

		const isPrimaryAddressExist = await UserAddresses.findOne({
			where: {
				userId,
				isprimary: true,
			},
		});
		if (isPrimaryAddressExist) {
			await UserAddresses.update(
				{ isprimary: false },
				{
					where: {
						id: isPrimaryAddressExist.id,
					},
				}
			);
		}

		await UserAddresses.update(
			{ isprimary: true },
			{
				where: {
					id,
				},
			}
		);

		const newAddress = await UserAddresses.findOne({
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
				address: newAddress,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};

//*-------------------------------------------- Delete User Address --------------------------------------------*//
exports.deleteUserAddress = async (req, res) => {
	try {
		const { id } = req.params;

		const isAddressExist = await UserAddresses.findOne({
			where: {
				id,
			},
		});
		if (!isAddressExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					address: [],
				},
			});
		}

		await UserAddresses.destroy({
			where: {
				id,
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Delete', id),
			data: {
				address: null,
			},
		});
	} catch (err) {
		return errorResponse(err, res);
	}
};
