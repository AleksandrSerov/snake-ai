import { getRandomInt } from '../../../../utils/get-random-int';
import { Dots } from '../..';
import { EMPTY_VALUE } from '../../constants';

export const getRandomEmptyDotPoint = (dots: Dots) => {
	const coordsForRandom = dots
		.map((array, i) =>
			array.map((value, j) => {
				if (value === EMPTY_VALUE) {
					return [i, j];
				}

				return undefined;
			}),
		)
		.flat(1)
		.filter((v) => v);

	const point = coordsForRandom[getRandomInt(coordsForRandom.length)];

	return point as [number, number];
};
