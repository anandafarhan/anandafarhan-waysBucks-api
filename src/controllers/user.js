const { User, Role } = require('../../models');

//* Re-Useable Error message
const { success, failed, messageSuccess, messageFailed, messageEmpty } = {
	success: 'success',
	failed: 'failed',
	messageSuccess: (type, id) =>
		`${type} User/s success${id ? ` id : ${id}` : ``}`,
	messageFailed: (type, id) => `${type} User/s fail${id ? ` id : ${id}` : ``}`,
	messageEmpty: `No data found`,
};

//* Re-Useable Error response
const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//*-------------------------------------------- Get All User --------------------------------------------*//
exports.getUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			include: {
				model: Role,
				as: 'role',
				attributes: {
					exclude: ['id', 'createdAt', 'updatedAt'],
				},
			},
			attributes: {
				exclude: ['password', 'roleId', 'createdAt', 'updatedAt'],
			},
		});

		if (users.length < 1) {
			return res.send({
				status: failed,
				message: messageEmpty,
				data: {
					users: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: { users },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get User by Id --------------------------------------------*//
exports.getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findOne({
			where: {
				id: id,
			},
			include: {
				model: Role,
				as: 'role',
				attributes: {
					exclude: ['id', 'createdAt', 'updatedAt'],
				},
			},
			attributes: {
				exclude: ['password', 'roleId', 'createdAt', 'updatedAt'],
			},
		});

		if (!user) {
			return res.status(400).send({
				status: failed,
				message: messageFailed('Get', id),
				data: {
					user: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get', id),
			data: { user },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//!-------------------------------------------- Add User --------------------------------------------!//
// exports.addUser = async (req, res) => {
// 	try {
// 		const newUser = await User.create(req.body);
// 		const newUserData = await User.findOne({
// 			where: {
// 				id: newUser.id,
// 			},
// 			attributes: {
// 				exclude: ['password', 'createdAt', 'updatedAt'],
// 			},
// 		});
// 		res.send({
// 			status: 'success',
// 			message: 'Register User Success',
// 			data: { newUserData },
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		res.send({
// 			status: 'failed',
// 			message: 'Server Error',
// 		});
// 	}
// };

//*-------------------------------------------- Update User --------------------------------------------*//
exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params;

		const isUserExist = await User.findOne({
			where: {
				id,
			},
		});

		if (!isUserExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					user: [],
				},
			});
		}

		await User.update(req.body, {
			where: {
				id,
			},
		});

		const updatedUser = await User.findOne({
			where: {
				id,
			},
			attributes: {
				exclude: ['password', 'createdAt', 'updatedAt'],
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Update', id),
			data: { updatedUser },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Delete User --------------------------------------------*//
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const isUserExist = await User.findOne({
			where: {
				id,
			},
		});

		if (!isUserExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					user: [],
				},
			});
		}

		await User.destroy({
			where: {
				id: id,
			},
		});

		res.send({
			status: 'success',
			message: `Delete user id: ${id} finished`,
		});
	} catch (err) {
		errorResponse(err, res);
	}
};
