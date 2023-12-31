const { expect } = require('chai');
const RSU = require('../../models/RSU');

describe('RSU Model Validation', () => {
	it('should be valid if all required fields are provided', () => {
		const rsuData = {
			name: 'Test RSU',
			recommended_speed: '100',
		};

		const rsu = new RSU(rsuData);

		expect(rsu).to.have.property('_id');
		expect(rsu.name).to.equal(rsuData.name);
		expect(rsu.recommended_speed).to.equal(rsuData.recommended_speed);
	});

	it('should be invalid if name is empty', async () => {
		const rsu = new RSU({
			recommended_speed: '100',
		});
		try {
			await rsu.validate();
			expect.fail('Validation should have failed');
		} catch (error) {
			expect(error.errors.name.properties.message).to.equal(
				'Please add a name'
			);
		}
	});

	it('should be invalid if recommended_speed is empty', async () => {
		const rsu = new RSU({
			name: 'Test RSU',
		});
		try {
			await rsu.validate();
			expect.fail('Validation should have failed');
		} catch (error) {
			expect(error.errors.recommended_speed.properties.message).to.equal(
				'Please add a recommended speed'
			);
		}
	});
});
