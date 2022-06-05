export const pickRandomByScores = (
	snakes: Array<{
		index: number;
		scores: number;
		eatenFoodCount: number;
		brain: {
			part1: Array<Array<number>>;
			part2: Array<Array<number>>;
		};
	}>,
) => {
	const sumScores = Math.round(snakes.reduce((acc, { scores }) => acc + scores, 0));

	const forRandom = snakes.map(({ scores, index }) => ({
		index,
		res: Math.round((scores / sumScores) * 100),
	}));

	const arrforRandom = forRandom
		.map(({ index, res }) => String(index).repeat(res).split('').map(Number))
		.flat();

	const targetIndex = arrforRandom[Math.trunc(Math.random() * forRandom.length)];
	const result = snakes[targetIndex];

	return result;
};
