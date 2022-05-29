import { zip } from 'lodash';

export const multiplyMatrix = (
	matrix1: Array<Array<number>>,
	matrix2: Array<Array<number>>,
): Array<Array<number>> => {
	if (matrix1[0].length !== matrix2.length) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return console.error('not matching matrix');
	}

	const transposedMatrix2 = zip(...matrix2) as unknown as Array<Array<number>>;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const res = matrix1.reduce((acc, row) => {
		const newRow = transposedMatrix2.map((row1) => {
			const updated = row1.reduce((acc1, item1, index1) => acc1 + item1 * row[index1], 0);

			return updated;
		});

		return [...acc, newRow];
	}, []) as Array<Array<number>>;

	return res;
};
