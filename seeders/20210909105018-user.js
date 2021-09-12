'use strict';
const bcrypt = require('bcrypt');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('User', [
			{
				fullName: 'Waysbucks Admin',
				email: 'admin@ways.com',
				password: bcrypt.hash('admin123', 10),
				roleId: 1,
			},
			{
				fullName: 'Waysbucks User',
				email: 'user@ways.com',
				password: bcrypt.hash('user123', 10),
				roleId: 2,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('User', null, {});
	},
};
