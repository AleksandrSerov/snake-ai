import { getDistanceBetween } from '.';

describe('getDistanceBetween', () => {
	it('should work', () => {
		expect(getDistanceBetween([0, 0], [1, 0])).toEqual(1);
		expect(getDistanceBetween([0, 0], [-1, 0])).toEqual(1);
		expect(getDistanceBetween([-1, 0], [-1, 0])).toEqual(0);
		expect(getDistanceBetween([0, 0], [1, 1]).toFixed(2)).toEqual('1.41');
	});
});
