const { Product, TransactionProduct } = require('../../models');

//* Re-Useable Error message
const { success, failed, messageSuccess, messageFailed, messageEmpty } = {
	success: 'success',
	failed: 'failed',
	messageSuccess: (type, id) => `${type} Product/s success${id ? ` id : ${id}` : ``}`,
	messageFailed: (type, id) => `${type} Product/s fail${id ? ` id : ${id}` : ``}`,
	messageEmpty: `No data found`,
};

//* Re-Useable Error response
const errorResponse = (err, res) => {
	console.log(err);
	res.status(500).send({ error: { message: 'Server Error' } });
};

//*-------------------------------------------- Get All Product --------------------------------------------*//
exports.getProducts = async (req, res) => {
	try {
		const products = await Product.findAll({
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
			include: {
				model: TransactionProduct,
				attributes: ['qty'],
			},
		});

		if (products.length < 1) {
			return res.status(204).send({
				status: failed,
				message: messageEmpty,
				data: {
					product: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: { products },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get All Available Product --------------------------------------------*//
exports.getAvailableProducts = async (req, res) => {
	try {
		const products = await Product.findAll({
			where: {
				status: true,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
			include: {
				model: TransactionProduct,
				attributes: ['qty'],
			},
		});

		if (products.length < 1) {
			return res.status(204).send({
				status: failed,
				message: messageEmpty,
				data: {
					product: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get'),
			data: { products },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Get Product by Id --------------------------------------------*//
exports.getProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findOne({
			where: {
				id: id,
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});

		if (!product) {
			return res.status(400).send({
				status: failed,
				message: messageFailed('Get', id),
				data: {
					product: [],
				},
			});
		}

		res.send({
			status: success,
			message: messageSuccess('Get', id),
			data: { product },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Add Product --------------------------------------------*//
exports.addProduct = async (req, res) => {
	try {
		const newProduct = await Product.create({
			...req.body,
			image: req.file.path,
		});
		const newProductData = await Product.findOne({
			where: {
				id: newProduct.id,
			},
		});
		res.status(201).send({
			status: success,
			message: messageSuccess('Create'),
			data: { newProductData },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Update Product --------------------------------------------*//
exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;

		const isProductExist = await Product.findOne({
			where: {
				id,
			},
		});

		if (!isProductExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					product: [],
				},
			});
		}

		await Product.update(req.body, {
			where: {
				id,
			},
		});

		const updatedProduct = await Product.findOne({
			where: {
				id,
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Update', id),
			data: { updatedProduct },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Update Product with Image --------------------------------------------*//
exports.updateProductImg = async (req, res) => {
	try {
		const { id } = req.params;

		const isProductExist = await Product.findOne({
			where: {
				id,
			},
		});

		if (!isProductExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					product: [],
				},
			});
		}

		await Product.update(
			{ ...req.body, image: req.file.path },
			{
				where: {
					id,
				},
			}
		);

		const updatedProduct = await Product.findOne({
			where: {
				id,
			},
		});
		res.send({
			status: success,
			message: messageSuccess('Update', id),
			data: { updatedProduct },
		});
	} catch (err) {
		errorResponse(err, res);
	}
};

//*-------------------------------------------- Delete Product --------------------------------------------*//
exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;

		const isProductExist = await Product.findOne({
			where: {
				id,
			},
		});

		if (!isProductExist) {
			return res.status(400).send({
				status: failed,
				message: messageEmpty,
				data: {
					product: [],
				},
			});
		}

		await Product.destroy({
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
