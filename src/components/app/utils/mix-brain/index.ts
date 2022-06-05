export const mixBrain = (p1: Array<Array<number>>, p2: Array<Array<number>>) => {
	let mutationCount = 0;
	let firstParentGenes = 0;
	let secondParentGenes = 0;
	const mutationPercent = 0.02;
	const totalGenes = p1.length * p1[0].length;
	const maxMutationsCount = totalGenes * mutationPercent;

	const newBrain = p1.map((array, index) =>
		array.map((item, index1) => {
			const random = Math.random().toFixed(2);

			if (['0.01', '0.02'].includes(random) && mutationCount < maxMutationsCount) {
				const newValue = Math.random() * 2 - 1;

				mutationCount += 1;

				return newValue;
			}
			if (index1 >= array.length / 2) {
				firstParentGenes += 1;

				return item;
			}
			secondParentGenes += 1;

			return p2[index][index1];
		}),
	);
	const mutationRate = parseFloat(((mutationCount / totalGenes) * 100).toFixed(2));
	const maxMutationRate = parseFloat(((maxMutationsCount / totalGenes) * 100).toFixed(2));
	const firstParentGenesRate = parseFloat(((firstParentGenes / totalGenes) * 100).toFixed(2));
	const secondParentGenesRate = parseFloat(((secondParentGenes / totalGenes) * 100).toFixed(2));

	// console.log('mutation rate - ', mutationRate, '%');
	// console.log('firstParentGenes rate - ', firstParentGenesRate, '%');
	// console.log('secondParentGenesRate rate - ', secondParentGenesRate, '%');

	return newBrain;
};
