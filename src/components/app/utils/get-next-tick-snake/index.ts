import matches from 'lodash/matches';

import { Dots } from '../..';
import { Point } from '../../food';
import { Coordinates, Direction } from '../../snake';

const iIncMap = {
	up: -1,
	down: 1,
	right: 0,
	left: 0,
};
const jIncMap = {
	up: 0,
	down: 0,
	right: 1,
	left: -1,
};

export const getNextTickSnake = (
	snake: Coordinates,
	direction: Direction,
	dots: Dots,
	food: Point,
) => {
	const [oldHead, ...oldTail] = snake;
	const newHead = [oldHead[0] + iIncMap[direction], oldHead[1] + jIncMap[direction]];

	const outOfBorders =
		newHead[0] < 0 ||
		newHead[1] < 0 ||
		newHead[0] > dots.length - 1 ||
		newHead[1] > dots.length - 1;

	if (outOfBorders) {
		return {
			state: 'dead' as const,
			foodEaten: false,
			self: snake,
		};
	}
	const isFood = matches(newHead)(food);

	const currentTail = snake[snake.length - 1];
	const isCurrentTail = matches(newHead)(currentTail);
	const isObstacle = oldTail.some((tailItem) => matches(newHead)(tailItem));

	if (isObstacle && !isCurrentTail) {
		return {
			state: 'dead' as const,
			foodEaten: false,
			self: snake,
		};
	}

	if (isFood) {
		return {
			state: 'alive' as const,
			foodEaten: true,
			self: [newHead, ...snake.slice(0, snake.length)] as Array<Point>,
		};
	}

	return {
		state: 'alive' as const,
		foodEaten: false,
		self: [newHead, ...snake.slice(0, snake.length - 1)] as Array<Point>,
	};
};
