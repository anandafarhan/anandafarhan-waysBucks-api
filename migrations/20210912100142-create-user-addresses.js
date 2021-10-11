'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('UserAddresses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			phone: {
				type: Sequelize.STRING,
			},
			postCode: {
				type: Sequelize.STRING,
			},
			address: {
				type: Sequelize.TEXT,
			},
			isprimary: {
				type: Sequelize.BOOLEAN,
			},
			userId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()'),
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('UserAddresses');
	},
};
