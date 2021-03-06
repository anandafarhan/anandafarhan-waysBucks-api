'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Topping extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Topping.hasMany(models.TransactionTopping, {
				foreignKey: 'toppingId',
			});
		}
	}
	Topping.init(
		{
			name: DataTypes.STRING,
			price: DataTypes.INTEGER,
			image: DataTypes.STRING,
			status: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'Topping',
		}
	);
	return Topping;
};
