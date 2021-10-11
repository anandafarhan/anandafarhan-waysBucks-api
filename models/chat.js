'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Chat extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Chat.belongsTo(models.User, { as: 'sender', foreignKey: 'idSender' });
			Chat.belongsTo(models.User, { as: 'receipient', foreignKey: 'idRecipient' });
		}
	}
	Chat.init(
		{
			message: DataTypes.TEXT,
			idSender: DataTypes.INTEGER,
			idRecipient: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Chat',
		}
	);
	return Chat;
};
