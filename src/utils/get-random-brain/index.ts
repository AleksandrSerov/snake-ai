import brain from '../../components/app/snake/brain/brain.json';
import { getRandomInt } from '../get-random-int';

export const getRandomBrain = () => {
	const { part1, part2 } = brain;

	return {
		part1: part1.map((item) => item.map(() => Math.random() * 2 - 1)),
		part2: part2.map((item) => item.map(() => Math.random() * 2 - 1)),
	};
};
