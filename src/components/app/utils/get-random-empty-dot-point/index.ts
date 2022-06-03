import matches from 'lodash/matches';

import { getRandomInt } from '../../../../utils/get-random-int';
import { EMPTY_VALUE } from '../../constants';
import { Dots } from '../../game';
import { Coordinates } from '../../snake';

export const getRandomEmptyDotPoint = (dots: Dots, exclude: Array<Array<number>>) => {
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
		.filter((v) => v)
		.filter((value) => !exclude.some((ex) => matches(ex)(value)));

	const point = coordsForRandom[getRandomInt(coordsForRandom.length)];

	return point as [number, number];
};
