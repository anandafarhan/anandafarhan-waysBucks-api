'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class TransactionProduct extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			TransactionProduct.belongsTo(models.Transaction, { as: 'transaction' });
			TransactionProduct.belongsTo(models.Product, {
				as: 'product',
				foreignKey: 'productId',
			});
			TransactionProduct.hasMany(models.TransactionTopping, {
				as: 'transactionToppings',
				key: 'transactionProductId',
			});
		}
	}
	TransactionProduct.init(
		{
			transactionId: DataTypes.INTEGER,
			productId: DataTypes.INTEGER,
			qty: DataTypes.INTEGER,
			subTotal: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'TransactionProduct',
		}
	);
	return TransactionProduct;
};
