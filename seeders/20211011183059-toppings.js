'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('Toppings', [
			{
				name: 'Bubble Tea Gelatin',
				price: 3000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1633753407/waysbucks/1633753404902-BubbleTeaGelatin.png.png',
				status: true,
			},
			{
				name: 'Mango',
				price: 4000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631461022/waysbucks/1631461020804-Mango.png.png',
				status: true,
			},
			{
				name: 'Green Coconut',
				price: 5000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631461054/waysbucks/1631461052115-GreenCoconut.png.png',
				status: true,
			},
			{
				name: 'Boba Mango',
				price: 4000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631461087/waysbucks/1631461085283-BobaMango.png.png',
				status: true,
			},
			{
				name: 'Bill Berry Boba',
				price: 7000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631461281/waysbucks/1631461278954-BillBerryBoba.png.png',
				status: true,
			},
			{
				name: 'Kiwi Popping Pearl',
				price: 8000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631461352/waysbucks/1631461350102-KiwiPoppingPearl.png.png',
				status: true,
			},
			{
				name: 'Matcha Cantaloupe',
				price: 8000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631461382/waysbucks/1631461380533-MatchaCantaloupe.png.png',
				status: true,
			},
			{
				name: 'Strawberry Popping',
				price: 6000,
				image:
					'https://res.cloudinary.com/tobo2801/image/upload/v1631461424/waysbucks/1631461422213-StrawberryPopping.png.png',
				status: true,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Toppings', null, {});
	},
};
