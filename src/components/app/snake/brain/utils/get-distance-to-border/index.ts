import { Point } from '../../..';
import { getDistanceBetween } from '../get-distance-between';
import { isBorder } from '../is-border';
import { scaleVector } from '../scale-vector';
import { sumVectors } from '../sum-vectors';

export const getDistanceToBorder = (head: Point, vector: Point) => {
	let scale = 1;
	let targetPoint = sumVectors(head, scaleVector(vector, scale));

	while (!isBorder(targetPoint)) {
		scale += 1;
		targetPoint = sumVectors(head, scaleVector(vector, scale));
	}

	return getDistanceBetween(head, targetPoint);
};
