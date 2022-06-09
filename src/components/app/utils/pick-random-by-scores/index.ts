export const pseudoRandomByValue = <Item extends Record<string, any>>(
	items: Array<Item>,
	key: keyof Item,
) => {
	const sumValue = Math.round(items.reduce((acc, item) => acc + item[key], 0));

	const forRandom = items.map((item, index) => ({
		index,
		percent: parseFloat((item[key] / sumValue).toFixed(2)),
	}));

	const arrForRandom = forRandom
		.map(({ index, percent: chance }) =>
			String(index)
				.repeat(chance * 100)
				.split('')
				.map(() => items[index]),
		)
		.flat();

	const targetIndex = Math.trunc(Math.random() * arrForRandom.length);
	const item = arrForRandom[targetIndex];

	return {
		item,
		stats: {
			sumValue,
			forRandom,
			arrForRandom,
			targetIndex,
		},
	};
};
