import { activate } from '.';

describe('activate', () => {
	it('should work', () => {
		expect(activate(-1)).toEqual(0);
		expect(activate(0)).toEqual(0);
		expect(activate(1)).toEqual(1);
	});
});
