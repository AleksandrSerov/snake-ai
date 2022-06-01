import { scaleVector } from '.';

describe('scaleVector', () => {
	it('should work', () => {
		expect(scaleVector([0, 0], 1)).toEqual([0, 0]);
		expect(scaleVector([0, 0], 2)).toEqual([0, 0]);
		expect(scaleVector([0, 2], 1)).toEqual([0, 2]);
		expect(scaleVector([0, 2], 2)).toEqual([0, 4]);
		expect(scaleVector([0, -2], 1)).toEqual([0, -2]);
		expect(scaleVector([0, -2], 2)).toEqual([0, -4]);
		expect(scaleVector([2, 3], 2)).toEqual([4, 6]);
	});
});
