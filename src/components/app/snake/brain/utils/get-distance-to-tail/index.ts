import matches from 'lodash/matches';

import { Point } from '../../..';
import { getDistanceBetween } from '../get-distance-between';
import { isBorder } from '../is-border';
import { scaleVector } from '../scale-vector';
import { sumVectors } from '../sum-vectors';

const isTailPoint = (point: Point, tail: Array<Point>) =>
	tail.some((tailPoint) => matches(point)(tailPoint));

export const getDistanceToTail = (head: Point, vector: Point, tail: Array<Point>) => {
	let scale = 1;
	let targetPoint = sumVectors(head, scaleVector(vector, scale));

	while (!isTailPoint(targetPoint, tail) && !isBorder(targetPoint)) {
		scale += 1;
		targetPoint = sumVectors(head, scaleVector(vector, scale));
	}

	if (isBorder(targetPoint)) {
		return Infinity;
	}

	return getDistanceBetween(head, targetPoint);
};
