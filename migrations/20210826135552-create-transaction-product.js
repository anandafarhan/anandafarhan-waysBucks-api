'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('transactionProducts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			transactionId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'transactions',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			productId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'products',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			qty: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable('transactionProducts');
	},
};
