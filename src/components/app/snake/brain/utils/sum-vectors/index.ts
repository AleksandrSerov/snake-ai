import { Point } from '../../..';

export const sumVectors = (vector1: Point, vector2: Point) => {
	const [x1, y1] = vector1;
	const [x2, y2] = vector2;

	return [x1 + x2, y1 + y2] as Point;
};
