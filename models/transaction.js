'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Transaction extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Transaction.belongsTo(models.User, {
				foreignKey: 'userId',
			});
			Transaction.hasMany(models.TransactionProduct, {
				as: 'TransactionProducts',
				foreignKey: 'transactionId',
			});
		}
	}
	Transaction.init(
		{
			status: DataTypes.STRING,
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			phone: DataTypes.STRING,
			postCode: DataTypes.STRING,
			address: DataTypes.TEXT,
			attachment: DataTypes.STRING,
			income: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Transaction',
		}
	);
	return Transaction;
};
