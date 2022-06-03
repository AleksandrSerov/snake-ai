import { getDistanceToTail } from '.';

describe('getDistanceToTail', () => {
	it('should work', () => {
		expect(getDistanceToTail([0, 0], [0, 1], [[0, 1]])).toEqual(1);
		expect(getDistanceToTail([0, 0], [1, 1], [[0, 1]])).toEqual(0.000000000000001);
		expect(getDistanceToTail([0, 0], [1, 0], [[0, 1]])).toEqual(0.000000000000001);
		expect(getDistanceToTail([0, 0], [1, -1], [[0, 1]])).toEqual(0.000000000000001);
		expect(getDistanceToTail([0, 0], [1, -1], [[0, 1]])).toEqual(0.000000000000001);
		expect(getDistanceToTail([0, 0], [0, -1], [[0, 1]])).toEqual(0.000000000000001);
		expect(getDistanceToTail([0, 0], [-1, -1], [[0, 1]])).toEqual(0.000000000000001);
	});
});
