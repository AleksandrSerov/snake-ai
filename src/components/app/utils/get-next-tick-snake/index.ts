import matches from 'lodash/matches';

import { Direction, Dots, Snake } from '../..';
import { BORDER_VALUE, FOOD_VALUE } from '../../constants';

export const getNextTickSnake = (snake: Snake, direction: Direction, dots: Dots) => {
	const [oldHead] = snake;
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

	const newHead = [oldHead[0] + iIncMap[direction], oldHead[1] + jIncMap[direction]];
	const outOfBorders =
		newHead[0] < 0 ||
		newHead[1] < 0 ||
		newHead[0] > dots.length - 1 ||
		newHead[1] > dots.length - BORDER_VALUE;

	if (outOfBorders) {
		return {
			state: 'dead' as const,
			foodEaten: false,
			self: snake,
		};
	}
	const isFood = dots[newHead[0]][newHead[1]] === FOOD_VALUE;

	const currentTail = snake[snake.length - 1];
	const isCurrentTail = matches(newHead)(currentTail);
	const isObstacle = dots[newHead[0]][newHead[1]] === BORDER_VALUE;

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
			self: [newHead, ...snake.slice(0, snake.length)] as Snake,
		};
	}

	return {
		state: 'alive' as const,
		foodEaten: false,
		self: [newHead, ...snake.slice(0, snake.length - 1)] as Snake,
	};
};
