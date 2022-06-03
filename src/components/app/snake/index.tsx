import React, { useEffect, useRef, useState } from 'react';

import { DIRECTION_BY_KEY, enableAI, MAX_LIFESPAN_TICKS, OPPOSITE_DIRECTION } from '../constants';
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
	speed: number;
	defaultCoordinates: Array<[number, number]>;
	defaultDirection: Direction;
	brain: {
		part1: Array<Array<number>>;
		part2: Array<Array<number>>;
	};
	dotSize: number;
	playState: 'iddle' | 'playing' | 'finish';
	setPlayState: (playState: 'iddle' | 'playing') => void;
	dots: Dots;
	food: Point;
	onFoodEaten: (snake: Coordinates) => void;
	onStateChange?: (state: 'alive' | 'dead', lifespan: number) => void;
	eatenFoodCount: number;
};

export const Snake: React.FC<SnakeProps> = ({
	defaultCoordinates,
	defaultDirection,
	brain: brainProp,
	dotSize,
	playState,
	setPlayState,
	dots,
	food,
	onFoodEaten,
	onStateChange,
	eatenFoodCount,
	speed,
}) => {
	const lifespanRef = useRef(1);
	const [coordinates, setCoordinates] = useState<Array<[number, number]>>(defaultCoordinates);
	const refCoordinates = useRef<Array<[number, number]>>(coordinates);
	const startRef = useRef<number>();
	const foodRef = useRef(food);
	const [direction, setDirection] = useState<Direction>(defaultDirection);
	const directionRef = useRef<Direction>(defaultDirection);
	const [state, setState] = useState<'alive' | 'dead'>('alive');
	const playStateRef = useRef(playState);

	useEffect(() => {
		playStateRef.current = playState;
	}, [playState]);

	useEffect(() => {
		foodRef.current = food;
	}, [food]);

	useEffect(() => {
		directionRef.current = defaultDirection;
	}, [defaultDirection]);

	useEffect(() => {
		directionRef.current = direction;
	}, [direction]);

	useEffect(() => {
		refCoordinates.current = coordinates;
	}, [coordinates]);

	useEffect(() => {
		onStateChange?.(state, lifespanRef.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	useEffect(() => {
		if (lifespanRef.current >= MAX_LIFESPAN_TICKS + eatenFoodCount * 500 && state !== 'dead') {
			setState('dead');
		}
	});

	useEffect(() => {
		if (playState === 'finish') {
			lifespanRef.current = 0;
			setDirection(defaultDirection);

			return;
		}
		if (playState === 'iddle') {
			setDirection(defaultDirection);
			setCoordinates(defaultCoordinates);
			setState('alive');

			return;
		}

		if (playState === 'playing') {
			setDirection(defaultDirection);
			setCoordinates(defaultCoordinates);
			setState('alive');

			window.requestAnimationFrame(handleTick);

			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playState]);

	const handleTick = (timestamp: number) => {
		if (playStateRef.current !== 'playing') {
			return;
		}
		if (!startRef.current) {
			startRef.current = timestamp;
		}
		const elapsed = timestamp - startRef.current;

		if (elapsed <= 16 * (1 / (speed / 100))) {
			window.requestAnimationFrame(handleTick);

			return;
		}
		startRef.current = timestamp;

		if (enableAI) {
			const dir = brain.think({
				snake: refCoordinates.current,
				food: foodRef.current,
				brain: brainProp,
			});

			handleChooseDirection({ code: dir } as KeyboardEvent);
		}

		window.requestAnimationFrame(handleTick);
	};

	const handleMove = (direction: Direction) => {
		const {
			state,
			self: updatedSnake,
			foodEaten,
		} = getNextTickSnake(refCoordinates.current, direction, dots, foodRef.current);

		setCoordinates(updatedSnake);
		setState(state);

		if (foodEaten) {
			onFoodEaten(updatedSnake);
		}
	};

	const handleChooseDirection = (e: KeyboardEvent) => {
		if (!isControlKey(e.code)) {
			return;
		}

		if (!['iddle', 'playing'].includes(playState)) {
			return;
		}

		if (playState === 'iddle') {
			setPlayState('playing');
		}

		const code = e.code;

		const newDirection = DIRECTION_BY_KEY[code];

		const isOppositeDirection = directionRef.current === OPPOSITE_DIRECTION[newDirection];

		const isSameDirection = directionRef.current === newDirection;

		if (playStateRef.current === 'playing') {
			lifespanRef.current = lifespanRef.current + 1;
		}

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
