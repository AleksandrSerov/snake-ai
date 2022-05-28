import { Point } from './food';

export const DEFAULT_DOT_SIZE = 20;
export const TICK_MS = 50;
export const DIRECTIONS = {
	up: 'up',
	down: 'down',
	left: 'left',
	right: 'right',
} as const;

export const DIRECTION_BY_KEY = {
	KeyA: DIRECTIONS.left,
	KeyD: DIRECTIONS.right,
	KeyS: DIRECTIONS.down,
	KeyW: DIRECTIONS.up,
	ArrowLeft: DIRECTIONS.left,
	ArrowRight: DIRECTIONS.right,
	ArrowDown: DIRECTIONS.down,
	ArrowUp: DIRECTIONS.up,
} as const;
export const OPPOSITE_DIRECTION = {
	up: DIRECTIONS.down,
	down: DIRECTIONS.up,
	left: DIRECTIONS.right,
	right: DIRECTIONS.left,
} as const;
export const DEFAULT_DIRECTION = DIRECTIONS.up;

export const CANVAS_WIDTH = Math.trunc(700 / DEFAULT_DOT_SIZE) * DEFAULT_DOT_SIZE;
export const CANVAS_HEIGHT = CANVAS_WIDTH;
export const midI = Math.trunc(CANVAS_HEIGHT / DEFAULT_DOT_SIZE / 2);
export const midJ = Math.trunc(CANVAS_WIDTH / DEFAULT_DOT_SIZE / 2);
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
