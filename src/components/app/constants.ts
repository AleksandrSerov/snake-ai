import { Point } from './food';

export const DEFAULT_DOT_SIZE = 20;
export const TICK_MS = 50;
export const MOVE_DIRECTIONS = {
	up: 'up',
	down: 'down',
	left: 'left',
	right: 'right',
} as const;

export const SCAN_DIRECTIONS = [
	MOVE_DIRECTIONS.up,
	MOVE_DIRECTIONS.down,
	MOVE_DIRECTIONS.left,
	MOVE_DIRECTIONS.right,
	'upLeft',
	'upRight',
	'downLeft',
	'downRight',
] as const;

export const SCAN_VECTOR_BY_SCAN_DIRECTION = {
	up: [-1, 0],
	down: [1, 0],
	left: [0, -1],
	right: [0, 1],
	upLeft: [-1, -1],
	upRight: [-1, 1],
	downLeft: [1, -1],
	downRight: [1, 1],
} as const;

export const DIRECTION_BY_KEY = {
	KeyA: MOVE_DIRECTIONS.left,
	KeyD: MOVE_DIRECTIONS.right,
	KeyS: MOVE_DIRECTIONS.down,
	KeyW: MOVE_DIRECTIONS.up,
	ArrowLeft: MOVE_DIRECTIONS.left,
	ArrowRight: MOVE_DIRECTIONS.right,
	ArrowDown: MOVE_DIRECTIONS.down,
	ArrowUp: MOVE_DIRECTIONS.up,
} as const;
export const OPPOSITE_DIRECTION = {
	up: MOVE_DIRECTIONS.down,
	down: MOVE_DIRECTIONS.up,
	left: MOVE_DIRECTIONS.right,
	right: MOVE_DIRECTIONS.left,
} as const;
export const DEFAULT_DIRECTION = MOVE_DIRECTIONS.up;

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
