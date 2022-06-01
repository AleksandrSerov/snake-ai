import { Point } from 'pixi.js';

import { getRandomInt } from '../../utils/get-random-int';

export const DEFAULT_DOT_SIZE = 20;
export const TICK_MS = 16;
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
export const getDefaultSnake = () => {
	const [j, i] = [
		getRandomInt(CANVAS_HEIGHT / DEFAULT_DOT_SIZE - 3, 3),
		getRandomInt(CANVAS_HEIGHT / DEFAULT_DOT_SIZE - 3, 3),
	];
	const v1 = [
		[i, j],
		[i + 1, j],
		[i + 2, j],
		[i + 3, j],
	];
	const v2 = [
		[i, j],
		[i - 1, j],
		[i - 2, j],
		[i - 3, j],
	];
	const v3 = [
		[i, j],
		[i, j + 1],
		[i, j + 2],
		[i, j + 3],
	];
	const v4 = [
		[i, j],
		[i, j - 1],
		[i, j - 2],
		[i, j - 3],
	];
	const resArr = [v1, v2, v3, v4];
	const directions = ['up', 'down', 'left', 'right'];
	const randomInt = getRandomInt(resArr.length);

	return {
		self: resArr[randomInt],
		direction: directions[randomInt],
	};
};

export const EMPTY_VALUE = 0;
export const BORDER_VALUE = 1;
export const FOOD_VALUE = 2;

export const enableAI = true;
export const MAX_LIFESPAN_SEC = 15;
export const PARALLEL_RUNS_COUNT = 20;
