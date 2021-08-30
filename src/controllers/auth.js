const { User } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { success, failed } = {
	success: 'success',
	failed: 'failed',
};

const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//* ------------------------------  REGISTER ----------------------------------- *//

exports.register = async (req, res) => {
	try {
		const { body } = req;
		const roleId = 2;
		const schema = Joi.object({
			fullName: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});

		const { error } = schema.validate(body, { abortEarly: false });

		if (error) {
			return res.status(400).json({
				status: failed,
				message: 'Failed to register',
				errors: error.details.map((detail) => detail.message),
			});
		}

		const { email, password } = body;

		const checkEmail = await User.findOne({
			where: {
				email,
			},
		});

		if (checkEmail) {
			return res.status(400).json({
				status: failed,
				message: 'This email has already registered',
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			...body,
			password: hashedPassword,
			roleId,
			avatar: null,
		});

		const payload = { id: user.id };
		const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
			expiresIn: '24h',
		});

		res.status(201).send({
			status: success,
			message: 'You have successfully registered',
			data: {
				id: user.id,
				fullName: user.fullName,
				email: user.email,
				roleId: user.roleId,
				avatar: user.avatar,
				token,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//* -------------------------------- LOGIN ----------------------------------- *//

exports.login = async (req, res) => {
	try {
		const { body } = req;
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});

		const { error } = schema.validate(body, { abortEarly: false });

		if (error) {
			return res.status(400).json({
				status: failed,
				message: 'Your email or password is invalid',
				errors: error.details.map((detail) => detail.message),
			});
		}

		const { email, password } = body;

		const user = await User.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(400).json({
				status: failed,
				message: 'Your email or password is invalid',
			});
		}

		const checkPassword = await bcrypt.compare(password, user.password);

		if (!checkPassword) {
			return res.status(400).json({
				status: failed,
				message: 'Your email or password is invalid',
			});
		}

		const payload = { id: user.id };
		let token = null;
		if (user.roleId === 1) {
			token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY_A, {
				expiresIn: '24h',
			});
		} else {
			token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
				expiresIn: '24h',
			});
		}

		res.send({
			status: success,
			message: 'You have successfully login',
			data: {
				id: user.id,
				fullName: user.fullName,
				email: user.email,
				roleId: user.roleId,
				avatar: user.avatar,
				token,
			},
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//TODO-------------------------------------------- Check User Auth --------------------------------------------*//
