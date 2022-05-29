import { multiplyMatrix } from '.';

describe('multiplyMatrix', () => {
	it('should work', () => {
		const matrix1 = [
			[3, 5],
			[2, 1],
		];
		const matrix2 = [
			[8, 2, 3],
			[1, 7, 2],
		];

		const resultMatrix = [
			[29, 41, 19],
			[17, 11, 8],
		];

		expect(multiplyMatrix(matrix1, matrix2)).toEqual(resultMatrix);
	});
	it('should work 1', () => {
		const matrix1 = [
			[5, 8, 2],
			[1, 3, 3],
			[4, 5, 0],
		];
		const matrix2 = [
			[1, 2, 3],
			[4, 7, 9],
			[5, 8, 6],
		];

		const resultMatrix = [
			[47, 82, 99],
			[28, 47, 48],
			[24, 43, 57],
		];

		expect(multiplyMatrix(matrix1, matrix2)).toEqual(resultMatrix);
	});
});
