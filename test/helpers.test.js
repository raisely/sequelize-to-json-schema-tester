const chai = require('chai');
const chaiSubset = require('chai-subset');
const TestHelper = require('../');
const MockUser = require('./models');

chai.use(chaiSubset);

const expect = chai.expect;

describe('assertAllPropertiesDescribed', () => {
	let helper;

	before(() => {
		helper = TestHelper.getTestHelper(MockUser, {
			hrefBase: '/test',
		});
	});

	it('expects default fields', () => {
		expect(() => {
			helper.assertAllPropertiesDescribed(asResponseProperties({
				name: {},
			}));
		}).to.throw('Properties are not fully described');
	});
	it('allows complete elements', () => {
		helper.assertAllPropertiesDescribed(asResponseProperties({
			name: {
				$id: '/name',
				title: 'name',
				description: 'The name field',
				type: 'string',
				examples: ['Berta Caceres'],
			},
		}));
	});
	describe('inline objects', () => {
		const addressSchema = {
			address: {
				type: 'object',
				$id: '/properties/address',
				examples: [],
				title: 'address',
				description: 'Address of the person',
			},
		};

		it('permits complete', () => {
			const schema = Object.assign({}, addressSchema);
			schema.address.properties = {
				country: {
					type: 'string',
					$id: '/properties/address/properties/country',
					examples: ['Clyde St'],
					title: 'country',
					description: 'Name of country',
				},
			};

			helper.assertAllPropertiesDescribed(asResponseProperties(schema));
		});
		it('permits nested object', () => {
			const schema = Object.assign({}, addressSchema);
			schema.address.properties = {
				building: {
					type: 'object',
					$id: '/properties/address/properties/building',
					examples: [],
					title: 'building',
					description: 'Building number, name, unit number',
				},
			};

			helper.assertAllPropertiesDescribed(asResponseProperties(schema));
		});
		it('pemits reference', () => {
			const schema = Object.assign({}, addressSchema);
			schema.address.properties = {
				country: {
					$ref: '/schema/country',
				},
			};

			helper.assertAllPropertiesDescribed(asResponseProperties(schema));
		});
		it('throws on incomplete', () => {
			const schema = Object.assign({}, addressSchema);
			schema.address.properties = {
				country: {
				},
			};

			expect(() => {
				helper.assertAllPropertiesDescribed(asResponseProperties(schema));
			}).to.throw('Properties are not fully described');
		});
	});
	describe('array', () => {
		const scoreSchema = {
			scores: {
				type: 'array',
				title: 'Scores',
				$id: '/properties/scores',
			},
		};

		it('permits inline', () => {
			const schema = Object.assign({}, scoreSchema);
			schema.scores.items = {
				properties: {
					highScore: {
						type: 'number',
						$id: '/properties/scores/properties/highScore',
						examples: ['12'],
						title: 'Highest score',
						description: 'Highest score',
					},
				},
			};

			helper.assertAllPropertiesDescribed(asResponseProperties(schema));
		});
		it('permits reference', () => {
			const schema = Object.assign({}, scoreSchema);
			schema.scores.items = {
				$ref: '/schema/address',
			};

			helper.assertAllPropertiesDescribed(asResponseProperties(schema));
		});
		it('permits nested object', () => {
			const schema = Object.assign({}, scoreSchema);
			schema.scores.items = {
				properties: {
					winner: {
						type: 'object',
						properties: {},
						$id: '/properties/scores/properties/winner',
						examples: [],
						title: 'Winner',
						description: 'Winners details',
					},
				},
			};

			helper.assertAllPropertiesDescribed(asResponseProperties(schema));
		});
		it('throws on incomplete', () => {
			const schema = Object.assign({}, scoreSchema);
			schema.scores.items.properties = {
				highScore: {
				},
			};

			expect(() => {
				helper.assertAllPropertiesDescribed(asResponseProperties(schema));
			}).to.throw('Properties are not fully described');
		});
	});
	it('permits references', () => {
		helper.assertAllPropertiesDescribed(asResponseProperties({
			address: {
				$ref: '/another/thing',
			},
		}));
	});
});

function asResponseProperties(data) {
	return {
		body: {
			properties: data,
		},
	};
}
