import matches from 'lodash/matches';

import { Point } from '../../..';
import { getDistanceBetween } from '../get-distance-between';
import { isBorder } from '../is-border';
import { scaleVector } from '../scale-vector';
import { sumVectors } from '../sum-vectors';

const isFoodPoint = (point: Point, foodPoint: Point) => matches(point)(foodPoint);

export const getDistanceToFood = (head: Point, vector: Point, food: Point) => {
	let scale = 1;
	let targetPoint = sumVectors(head, scaleVector(vector, scale));

	while (!isFoodPoint(targetPoint, food) && !isBorder(targetPoint)) {
		scale += 1;
		targetPoint = sumVectors(head, scaleVector(vector, scale));
	}

	if (isBorder(targetPoint)) {
		return 0.0000001;
	}

	return getDistanceBetween(head, targetPoint);
};
