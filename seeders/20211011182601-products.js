'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('Products', [
			{
				name: 'Ice Coffee Palm Sugar',
				price: 31000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631460485/waysbucks/1631460481577-IceCoffeePalmSugar.png.png',
				status: true,
			},
			{
				name: 'Ice Coffee Green Tea',
				price: 35000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631460566/waysbucks/1631460562503-IceCoffeeGreenTea.png.png',
				status: true,
			},
			{
				name: 'Hanami Latte',
				price: 29000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631460759/waysbucks/1631460756791-HanamiLatte.png.png',
				status: true,
			},
			{
				name: 'Clepon Coffee',
				price: 28000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631460791/waysbucks/1631460788629-CleponCoffee.png.png',
				status: true,
			},
			{
				name: 'Pandan Latte',
				price: 40000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631587072/waysbucks/1631587069109-PandanLatte.png.png',
				status: true,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Products', null, {});
	},
};
