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
	speed,
}) => {
	const [update, forceUpdate] = useState(0);
	const lifespanRef = useRef(0);
	const brainRef = useRef(brainProp);
	const coordinatesRef = useRef<Array<[number, number]>>(snake.self);
	const startRef = useRef<number>();
	const foodRef = useRef(food);
	const directionRef = useRef<Direction>(snake.direction);
	const stateRef = useRef<'alive' | 'dead'>('alive');
	const speedRef = useRef(speed);

	useEffect(() => {
		foodRef.current = food;
	}, [food]);

	useEffect(() => {
		directionRef.current = snake.direction;
	}, [snake.direction]);

	useEffect(() => {
		coordinatesRef.current = snake.self;
	}, [snake.self]);

	useEffect(() => {
		speedRef.current = speed;
	}, [speed]);

	useEffect(() => {
		coordinatesRef.current = snake.self;
		directionRef.current = snake.direction;
		lifespanRef.current = 0;
		brainRef.current = brainProp;
		foodRef.current = food;
		startRef.current = undefined;
		stateRef.current = 'alive';
		window.requestAnimationFrame(handleTick);
	}, [brainProp]);

	useEffect(() => {
		if (stateRef.current === 'dead') {
			onStateChange(stateRef.current, lifespanRef.current);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [update]);

	useEffect(() => {
		const maxLifespan = MAX_LIFESPAN_TICKS + (coordinatesRef.current.length - 4) * 500;

		if (lifespanRef.current >= maxLifespan && stateRef.current !== 'dead') {
			forceUpdate((prev) => prev + 1);
			stateRef.current = 'dead';
		}
	}, [update]);

	const handleTick = (timestamp: number) => {
		if (stateRef.current === 'dead') {
			return;
		}
		if (!startRef.current) {
			startRef.current = timestamp;
		}
		const elapsed = timestamp - startRef.current;
		const AIScale = enabledAI ? 0.5 : 10;

		if (elapsed <= 16 * AIScale * (1 / (speedRef.current / 100))) {
			window.requestAnimationFrame(handleTick);

			return;
		}
		startRef.current = timestamp;

		const newDirection = brain.think({
			snake: coordinatesRef.current,
			food: foodRef.current,
			brain: brainRef.current,
		});

		if (enabledAI) {
			const isOppositeDirection = directionRef.current === OPPOSITE_DIRECTION[newDirection];
			const isSameDirection = directionRef.current === newDirection;
			const resultDirection =
				isOppositeDirection || isSameDirection ? directionRef.current : newDirection;

			directionRef.current = resultDirection;
		}

		handleMove();

		window.requestAnimationFrame(handleTick);
	};

	const handleMove = () => {
		if (stateRef.current === 'dead') {
			return;
		}
		lifespanRef.current = lifespanRef.current + 1;

		const {
			state: newState,
			self: newSelf,
			foodEaten,
		} = getNextTickSnake(coordinatesRef.current, directionRef.current, dots, foodRef.current);

		coordinatesRef.current = newSelf;
		stateRef.current = newState;

		if (foodEaten) {
			onFoodEaten(newSelf);
		}
		forceUpdate((prev) => prev + 1);
	};

	const handleChooseDirection = (e: KeyboardEvent) => {
		if (stateRef.current === 'dead') {
			return;
		}
		const { code } = e;

		if (!isControlKey(code)) {
			return;
		}

		const newDirection = DIRECTION_BY_KEY[code];

		const isOppositeDirection = directionRef.current === OPPOSITE_DIRECTION[newDirection];

		const isSameDirection = directionRef.current === newDirection;
		const resultDirection =
			isOppositeDirection || isSameDirection ? directionRef.current : newDirection;

		directionRef.current = resultDirection;

		handleMove();
	};

	useEffect(() => {
		window.document.addEventListener('keydown', handleChooseDirection);

		return () => window.document.removeEventListener('keydown', handleChooseDirection);
	});

	if (stateRef.current === 'dead') {
		return null;
	}

	const renderSnakePart = ([i, j]: [number, number], index: number) => (
		<Rectangle.Graphics
			key={ `${i}_${j}` }
			x={ j * dotSize }
			y={ i * dotSize }
			width={ dotSize }
			height={ dotSize }
			color={ index === 0 ? headColor : bodyColor }
		/>
	);

	return <React.Fragment>{coordinatesRef.current.map(renderSnakePart)}</React.Fragment>;
};
