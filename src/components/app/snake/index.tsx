import React, { useEffect, useRef, useState } from 'react';

import { DEFAULT_DIRECTION, DIRECTION_BY_KEY, OPPOSITE_DIRECTION, TICK_MS } from '../constants';
import { Dots } from '../game';
import { Rectangle } from '../rectangle';
import { getNextTickSnake } from '../utils/get-next-tick-snake';

import { brain } from './brain';

export type Point = [number, number];
export type Coordinates = Array<Point>;
export type Direction = 'up' | 'down' | 'left' | 'right';

const isControlKey = (key: string): key is keyof typeof DIRECTION_BY_KEY =>
	Object.keys(DIRECTION_BY_KEY).includes(key);

export type SnakeProps = {
	birthTime: number;
	defaultCoordinates: Array<Array<number>>;
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
	onStateChange?: (state: 'alive' | 'dead') => void;
};

export const Snake: React.FC<SnakeProps> = ({
	defaultCoordinates,
	brain: brainProp,
	dotSize,
	playState,
	setPlayState,
	dots,
	food,
	onFoodEaten,
	onStateChange,
	birthTime,
}) => {
	const [coordinates, setCoordinates] = useState<Array<Array<number>>>(defaultCoordinates);
	const refCoordinates = useRef<Array<Array<number>>>(coordinates);
	const startRef = useRef<number>();
	const foodRef = useRef(food);
	const [direction, setDirection] = useState<Direction>('up');
	const directionRef = useRef<Direction>(direction);
	const [state, setState] = useState<'alive' | 'dead'>('alive');
	const playStateRef = useRef(playState);

	useEffect(() => {
		if (Date.now() / 1000 - birthTime >= 20) {
			setState('dead');

			return;
		}
	}, [birthTime, Date.now()]);

	useEffect(() => {
		playStateRef.current = playState;
	}, [playState]);

	useEffect(() => {
		foodRef.current = food;
	}, [food]);
	useEffect(() => {
		directionRef.current = direction;
	}, [direction]);

	useEffect(() => {
		refCoordinates.current = coordinates;
	}, [coordinates]);

	useEffect(() => {
		onStateChange?.(state);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	useEffect(() => {
		if (playState === 'finish') {
			setDirection(DEFAULT_DIRECTION);

			return;
		}
		if (playState === 'iddle') {
			setDirection(DEFAULT_DIRECTION);
			setCoordinates(defaultCoordinates);
			setState('alive');

			return;
		}

		if (playState === 'playing') {
			setDirection(DEFAULT_DIRECTION);
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

		if (elapsed <= TICK_MS) {
			window.requestAnimationFrame(handleTick);

			return;
		}
		startRef.current = timestamp;
		const dir = brain.think({ snake: refCoordinates.current, food, brain: brainProp });

		handleChooseDirection({ code: dir } as KeyboardEvent);

		window.requestAnimationFrame(handleTick);
	};

	const handleMove = () => {
		const {
			state,
			self: updatedSnake,
			foodEaten,
		} = getNextTickSnake(refCoordinates.current, directionRef.current, dots, foodRef.current);

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

		if (isSameDirection || isOppositeDirection) {
			handleMove();

			return;
		}
		setDirection(newDirection);
		startRef.current = performance.now();
		handleMove();

		window.requestAnimationFrame(handleTick);
	};

	const renderDot = ([i, j]: [number, number]) => (
		<Rectangle.Graphics
			key={ `${i}_${j}` }
			x={ j * dotSize }
			y={ i * dotSize }
			width={ dotSize }
			height={ dotSize }
			dotValue={ 1 }
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
