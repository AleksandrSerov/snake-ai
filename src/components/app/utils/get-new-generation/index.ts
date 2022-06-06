import { Stat } from '../../game';
import { mixBrainPart } from '../mix-brain-part';
import { pickRandomByScores } from '../pick-random-by-scores';

export const getNewGeneration = ({ length, stats }: { length: number; stats: Array<Stat> }) => {
	const bestResult = [...stats].sort((a, b) => b.scores - a.scores)[0];

	return new Array(length).fill(null).map(() => {
		const pickFirstParent = pickRandomByScores(stats) || bestResult;
		const pickSecondParent = pickRandomByScores(stats) || bestResult;

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
};
