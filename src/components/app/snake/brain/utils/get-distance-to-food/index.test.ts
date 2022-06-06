import { getDistanceToFood } from '.';

describe('getDistanceToFood', () => {
	it('should work', () => {
		expect(getDistanceToFood([0, 0], [0, 1], [0, 1])).toEqual(1);
		expect(getDistanceToFood([0, 0], [1, 1], [0, 1])).toEqual(Infinity);
		expect(getDistanceToFood([0, 0], [1, 0], [0, 1])).toEqual(Infinity);
		expect(getDistanceToFood([0, 0], [1, -1], [0, 1])).toEqual(Infinity);
		expect(getDistanceToFood([0, 0], [1, -1], [0, 1])).toEqual(Infinity);
		expect(getDistanceToFood([0, 0], [0, -1], [0, 1])).toEqual(Infinity);
		expect(getDistanceToFood([0, 0], [-1, -1], [0, 1])).toEqual(Infinity);
	});
});
