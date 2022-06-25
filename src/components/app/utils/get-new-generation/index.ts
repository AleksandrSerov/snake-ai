import { Stat } from '../../game';
import trainedBrain from '../../snake/brain/55-best-brain.json';
import { mixBrainPart } from '../mix-brain-part';
import { pseudoRandomByValue } from '../pick-random-by-scores';

export const getNewGeneration = ({
	length,
	stats,
	useTrained,
}: {
	length: number;
	stats: Array<Stat>;
	useTrained?: boolean;
}) =>
	new Array(length).fill(null).map(() => {
		if (useTrained) {
			return {
				brain: trainedBrain,
			};
		}
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
