import React, { useEffect, useRef, useState } from 'react';

import {
	DIRECTION_BY_KEY,
	enabledAI,
	getDefaultSnake,
	MAX_LIFESPAN_TICKS,
	OPPOSITE_DIRECTION,
} from '../constants';
import { Dots } from '../game';
import { Rectangle } from '../rectangle';
import { getNextTickSnake } from '../utils/get-next-tick-snake';

import { brain } from './brain';

export type Point = [number, number];
export type Coordinates = Array<Point>;
export type Direction = 'up' | 'down' | 'left' | 'right';
const bodyColor = '#7DD181';
const headColor = '#4B7F52';

const isControlKey = (key: string): key is keyof typeof DIRECTION_BY_KEY =>
	Object.keys(DIRECTION_BY_KEY).includes(key);

export type SnakeProps = {
	snake: ReturnType<typeof getDefaultSnake>;
	speed: number;
	brain: {
		part1: Array<Array<number>>;
		part2: Array<Array<number>>;
	};
	dotSize: number;
	dots: Dots;
	food: Point;
	onFoodEaten: (snake: Coordinates) => void;
	onStateChange: (state: 'alive' | 'dead', lifespan: number) => void;
	eatenFoodCount: number;
};

export const Snake: React.FC<SnakeProps> = ({
	snake,
	brain: brainProp,
	dotSize,
	dots,
	food,
	onFoodEaten,
	onStateChange,
	eatenFoodCount,
	speed,
}) => {
	const lifespanRef = useRef(0);
	const [coordinates, setCoordinates] = useState<Array<[number, number]>>(snake.self);
	const refCoordinates = useRef<Array<[number, number]>>(coordinates);
	const startRef = useRef<number>();
	const foodRef = useRef(food);
	const [direction, setDirection] = useState<Direction>(snake.direction);
	const directionRef = useRef<Direction>(snake.direction);
	const [state, setState] = useState<'alive' | 'dead'>('alive');

	useEffect(() => {
		foodRef.current = food;
	}, [food]);

	useEffect(() => {
		directionRef.current = snake.direction;
	}, [snake.direction]);

	useEffect(() => {
		directionRef.current = direction;
	}, [direction]);

	useEffect(() => {
		refCoordinates.current = coordinates;
	}, [coordinates]);

	useEffect(() => {
		setState('alive');
		setCoordinates(snake.self);
		setDirection(snake.direction);
		lifespanRef.current = 0;
	}, [brainProp]);

	useEffect(() => {
		if (state === 'dead') {
			onStateChange(state, lifespanRef.current);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	useEffect(() => {
		if (lifespanRef.current >= MAX_LIFESPAN_TICKS + eatenFoodCount * 500 && state !== 'dead') {
			setState('dead');
		}
	}, [lifespanRef.current]);

	useEffect(() => {
		window.requestAnimationFrame(handleTick);
	}, []);

	const handleTick = (timestamp: number) => {
		console.log('tick');
		if (!startRef.current) {
			startRef.current = timestamp;
		}
		const elapsed = timestamp - startRef.current;

		if (elapsed <= 16 * (1 / (speed / 100))) {
			window.requestAnimationFrame(handleTick);

			return;
		}
		startRef.current = timestamp;
		const dir = brain.think({
			snake: refCoordinates.current,
			food: foodRef.current,
			brain: brainProp,
		});

		if (enabledAI) {
			handleMove(dir);
		}

		window.requestAnimationFrame(handleTick);
	};

	const handleMove = (direction: Direction) => {
		if (state !== 'alive') {
			return;
		}
		lifespanRef.current = lifespanRef.current + 1;

		const {
			state: newState,
			self: updatedSnake,
			foodEaten,
		} = getNextTickSnake(refCoordinates.current, direction, dots, foodRef.current);

		setCoordinates(updatedSnake);
		setState(newState);

		if (foodEaten) {
			onFoodEaten(updatedSnake);
		}
	};

	const handleChooseDirection = (e: KeyboardEvent) => {
		if (state !== 'alive') {
			return;
		}

		if (!isControlKey(e.code)) {
			return;
		}

		const code = e.code;

		const newDirection = DIRECTION_BY_KEY[code];

		const isOppositeDirection = directionRef.current === OPPOSITE_DIRECTION[newDirection];

		const isSameDirection = directionRef.current === newDirection;

		if (isOppositeDirection) {
			handleMove(direction);

			return;
		}

		if (isSameDirection) {
			handleMove(direction);

			return;
		}
		setDirection(newDirection);

		startRef.current = performance.now();
		handleMove(newDirection);

		window.requestAnimationFrame(handleTick);
	};

	const renderDot = ([i, j]: [number, number], index: number) => (
		<Rectangle.Graphics
			key={ `${i}_${j}` }
			x={ j * dotSize }
			y={ i * dotSize }
			width={ dotSize }
			height={ dotSize }
			color={ index === 0 ? headColor : bodyColor }
		/>
	);

	useEffect(() => {
		window.document.addEventListener('keydown', handleChooseDirection);

		return () => window.document.removeEventListener('keydown', handleChooseDirection);
	});

	if (state === 'dead') {
		return null;
	}

	return <React.Fragment>{coordinates.map(renderDot)}</React.Fragment>;
};
