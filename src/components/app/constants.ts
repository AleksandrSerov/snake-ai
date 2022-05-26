import { Point } from './food';
import { SnakeProps } from './snake';

export const DEFAULT_DOT_SIZE = 20;
export const DIRECTION_BY_KEY = {
	KeyA: 'left',
	KeyD: 'right',
	KeyS: 'down',
	KeyW: 'up',
} as const;
export const OPPOSITE_DIRECTION = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left',
} as const;
export const DEFAULT_DIRECTION = 'up';

export const CANVAS_WIDTH = Math.trunc(700 / DEFAULT_DOT_SIZE) * DEFAULT_DOT_SIZE;
export const CANVAS_HEIGHT = Math.trunc(700 / DEFAULT_DOT_SIZE) * DEFAULT_DOT_SIZE;
export const midI = Math.trunc(CANVAS_WIDTH / DEFAULT_DOT_SIZE / 2) - 1;
export const midJ = Math.trunc(CANVAS_HEIGHT / DEFAULT_DOT_SIZE / 2) - 1;

export const DEFAULT_SNAKE_SELF = [
	[midI, midJ],
	[midI + 1, midJ],
	[midI + 2, midJ],
	[midI + 3, midJ],
] as Array<Point>;

export const DEFAULT_SNAKE = {
	state: 'alive' as const,
	foodEaten: false,
	self: DEFAULT_SNAKE_SELF,
};

export const EMPTY_VALUE = 0;
export const BORDER_VALUE = 1;
export const FOOD_VALUE = 2;
