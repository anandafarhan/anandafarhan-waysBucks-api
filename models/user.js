'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.belongsTo(models.Role, {
				as: 'role',
				foreignKey: 'roleId',
			});
			User.hasMany(models.Transaction, {
				as: 'transactions',
				foreignKey: 'userId',
			});
			User.hasMany(models.UserAddresses, { as: 'addresses', foreignKey: 'userId' });
			User.hasMany(models.Chat, { as: 'messageSender', foreignKey: 'idSender' });
			User.hasMany(models.Chat, { as: 'messageRecipient', foreignKey: 'idRecipient' });
		}
	}
	User.init(
		{
			fullName: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			avatar: DataTypes.STRING,
			roleId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'User',
		}
	);
	return User;
};
