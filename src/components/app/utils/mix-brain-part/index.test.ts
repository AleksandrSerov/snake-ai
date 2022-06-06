import matches from 'lodash/matches';

import { MAX_MUTATION_RATE } from '../../constants';

import firstParentBrainMock from './mocks/first-parent-brain.json';
import secondParentBrainMock from './mocks/second-parent-brain.json';
import { mixBrainPart } from '.';

describe('mixBrain', () => {
	it('should throw error if incompatibility arrays provided', () => {
		expect(() => {
			mixBrainPart(firstParentBrainMock.part1, secondParentBrainMock.part2);
		}).toThrow('Arrays length should be equal');
	});

	it('should work', () => {
		const totalGenesMock =
			firstParentBrainMock.part1.length * firstParentBrainMock.part1[0].length;

		const {
			brainPart,
			stats: { firstParentGenes, secondParentGenes, mutationCount },
		} = mixBrainPart(firstParentBrainMock.part1, secondParentBrainMock.part1);

		expect(firstParentGenes + secondParentGenes + mutationCount).toEqual(totalGenesMock);
		expect(mutationCount / totalGenesMock).not.toBeGreaterThan(MAX_MUTATION_RATE);
		expect(mutationCount / totalGenesMock).not.toBeGreaterThan(MAX_MUTATION_RATE);

		expect(matches(brainPart)(firstParentBrainMock.part1)).toEqual(false);
		expect(matches(brainPart)(secondParentBrainMock.part1)).toEqual(false);
	});
});
