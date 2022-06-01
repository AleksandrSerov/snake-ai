import { getDistanceToBorder } from '.';

describe('getDistanceToBorder', () => {
	it('should work', () => {
		expect(getDistanceToBorder([0, 0], [0, 1])).toEqual(35);
		expect(getDistanceToBorder([0, 0], [0, -1])).toEqual(1);
		expect(getDistanceToBorder([0, 0], [1, 0])).toEqual(35);
		expect(getDistanceToBorder([0, 0], [-1, 0])).toEqual(1);
		expect(getDistanceToBorder([0, 0], [-1, 0])).toEqual(1);
		expect(getDistanceToBorder([0, 0], [-1, -1]).toFixed(2)).toEqual('1.41');
		expect(getDistanceToBorder([0, 0], [1, 1]).toFixed(2)).toEqual('49.50');
	});
});
