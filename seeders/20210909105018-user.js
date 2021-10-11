'use strict';
const bcrypt = require('bcrypt');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('users', [
			{
				fullName: 'Waysbucks Admin',
				email: 'admin@ways.com',
				password: await bcrypt.hash('admin123', 10),
				roleId: 1,
			},
			{
				fullName: 'Waysbucks User',
				email: 'user@ways.com',
				password: await bcrypt.hash('user123', 10),
				roleId: 2,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('users', null, {});
	},
};
