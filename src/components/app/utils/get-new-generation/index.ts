import { Stat } from '../../game';
import { mixBrainPart } from '../mix-brain-part';
import { pseudoRandomByValue } from '../pick-random-by-scores';

export const getNewGeneration = ({ length, stats }: { length: number; stats: Array<Stat> }) =>
	new Array(length).fill(null).map(() => {
		const pickFirstParent = pseudoRandomByValue(stats, 'scores').item;
		const pickSecondParent = pseudoRandomByValue(stats, 'scores').item;

		const brain = {
			part1: mixBrainPart(pickFirstParent.brain.part1, pickSecondParent.brain.part1)
				.brainPart,
			part2: mixBrainPart(pickFirstParent.brain.part2, pickSecondParent.brain.part2)
				.brainPart,
		};

		return {
			brain,
		};
	});
