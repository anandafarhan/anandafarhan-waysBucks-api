'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class UserAddresses extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			UserAddresses.belongsTo(models.User, { as: 'User', foreignKey: 'userId' });
		}
	}
	UserAddresses.init(
		{
			title: DataTypes.STRING,
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			phone: DataTypes.STRING,
			postCode: DataTypes.STRING,
			address: DataTypes.TEXT,
			isprimary: DataTypes.BOOLEAN,
			userId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'UserAddresses',
		}
	);
	return UserAddresses;
};
