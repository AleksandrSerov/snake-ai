import arrForRandomMock from './mocks/arr-for-random.json';
import { pseudoRandomByValue } from '.';
describe('getDistanceToFood', () => {
	it('should work', () => {
		const itemsMock = [
			{ name: 'First', scores: 0 },
			{ name: 'Second', scores: 1 },
			{ name: 'Third', scores: 2 },
			{ name: 'Fourth', scores: 3 },
		];

		const actual = pseudoRandomByValue(itemsMock, 'scores');

		expect(actual.stats.sumValue).toEqual(6);
		expect(actual.stats.forRandom).toEqual([
			{ index: 0, percent: 0 },
			{ index: 1, percent: 0.17 },
			{ index: 2, percent: 0.33 },
			{ index: 3, percent: 0.5 },
		]);
		expect(actual.stats.arrForRandom).toEqual(arrForRandomMock);

		const itemsMock1 = [
			{ name: 'First', scores: 0 },
			{ name: 'Second', scores: 1 },
			{ name: 'Third', scores: 2 },
			{ name: 'Fourth', scores: 7 },
		];

		expect(
			new Array(100)
				.fill(itemsMock1)
				.map((items) => pseudoRandomByValue(items, 'scores').item)
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				.filter((value) => value.name === 'Fourth').length,
		).toBeGreaterThan(70);
	});
});
