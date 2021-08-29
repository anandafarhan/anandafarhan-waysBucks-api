'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('transactionToppings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			transactionProductId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'transactionProducts',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			toppingId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'toppings',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal(
					'CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'
				),
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('transactionToppings');
	},
};
