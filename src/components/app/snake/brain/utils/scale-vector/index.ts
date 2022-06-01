import { Point } from '../../..';

export const scaleVector = (vector: Point, scale: number) =>
	vector.map((coord) => coord * scale) as Point;
