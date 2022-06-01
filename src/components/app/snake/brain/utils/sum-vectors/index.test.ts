import { sumVectors } from '.';

describe('sumVectors', () => {
	it('should work', () => {
		expect(sumVectors([0, 0], [0, 0])).toEqual([0, 0]);
		expect(sumVectors([-1, -1], [-1, -1])).toEqual([-2, -2]);
		expect(sumVectors([0, 0], [1, 1])).toEqual([1, 1]);
	});
});
