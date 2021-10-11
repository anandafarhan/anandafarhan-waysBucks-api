'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('toppings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			price: {
				type: Sequelize.INTEGER,
			},
			image: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.BOOLEAN,
				defaultValue: 0,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('toppings');
	},
};
