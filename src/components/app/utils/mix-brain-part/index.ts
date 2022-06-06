import { MAX_MUTATION_RATE } from '../../constants';

export const mixBrainPart = (part1: Array<Array<number>>, part2: Array<Array<number>>) => {
	if (part1.length !== part2.length || part1[0].length !== part2[0].length) {
		throw new Error('Arrays length should be equal');
	}

	let mutationCount = 0;
	let firstParentGenes = 0;
	let secondParentGenes = 0;

	const totalGenes = part1.length * part1[0].length;
	const maxMutationsCount = Math.trunc(totalGenes * MAX_MUTATION_RATE);

	const newBrainPart = part1.map((array, i) =>
		array.map((item, j) => {
			const random = parseFloat(Math.random().toFixed(2));

			if (random <= MAX_MUTATION_RATE && mutationCount < maxMutationsCount) {
				const newValue = Math.random() * 2 - 1;

				mutationCount += 1;

				return newValue;
			}
			if (j >= array.length / 2) {
				firstParentGenes += 1;

				return item;
			}
			secondParentGenes += 1;

			return part2[i][j];
		}),
	);

	return {
		brainPart: newBrainPart,
		stats: {
			mutationCount,
			firstParentGenes,
			secondParentGenes,
		},
	};
};
