import { getRandomBrain } from '../../../../utils/get-random-brain';
import brain from '../../snake/brain/brain.json';
const defaultBrain = getRandomBrain();

export const getInitialGames = (count: number) =>
	new Array(count).fill(null).map(() => ({
		brain: defaultBrain,
	}));
