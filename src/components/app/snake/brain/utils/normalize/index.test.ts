import { normalize } from '.';

describe('normalize', () => {
	it('should work', () => {
		expect(normalize(1)).toEqual(1);
		expect(normalize(0)).toEqual(0.0000001);
		expect(normalize(2)).toEqual(0.5);
		expect(normalize(10)).toEqual(0.1);
	});
});
