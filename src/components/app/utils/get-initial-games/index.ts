import { Brain } from '../../game';

export const getInitialGames = (count: number, brain: Brain) =>
	new Array(count).fill(null).map(() => ({
		brain: {
			part1: brain.part1,
			part2: brain.part2,
		},
	}));
