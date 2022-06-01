import { CANVAS_WIDTH, DEFAULT_DOT_SIZE } from '../../../../constants';
import { Point } from '../../..';

export const isBorder = (point: Point) =>
	point.some((coord) => coord < 0 || coord > CANVAS_WIDTH / DEFAULT_DOT_SIZE - 1);
