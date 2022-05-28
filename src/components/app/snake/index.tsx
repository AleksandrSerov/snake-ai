import React, { useEffect, useRef, useState } from 'react';
import matches from 'lodash/matches';

import { getRandomInt } from '../../../utils/get-random-int';
import {
	DEFAULT_DIRECTION,
	DEFAULT_SNAKE_SELF,
	DIRECTION_BY_KEY,
	DIRECTIONS,
	OPPOSITE_DIRECTION,
} from '../constants';
import { Rectangle } from '../rectangle';
import { getNextTickSnake } from '../utils/get-next-tick-snake';
import { Dots } from '..';
type Point = [number, number];
export type Coordinates = Array<Point>;
export type Direction = 'up' | 'down' | 'left' | 'right';

export type SnakeProps = {
	dotSize: number;
	playState: 'iddle' | 'playing';
	setPlayState: (playState: 'iddle' | 'playing') => void;
	dots: Dots;
	food: Point;
	onFoodEaten: (snake: Coordinates) => void;
	onStateChange?: (state: 'alive' | 'dead') => void;
};

const isControlKey = (key: string): key is keyof typeof DIRECTION_BY_KEY =>
	Object.keys(DIRECTION_BY_KEY).includes(key);
const chooseDirection = () => {
	const directions = Object.keys(DIRECTION_BY_KEY);
	const randomIndex = getRandomInt(directions.length);

	return directions[randomIndex];
};

export const Snake: React.FC<SnakeProps> = ({
	dotSize,
	playState,
	setPlayState,
	dots,
	food,
	onFoodEaten,
	onStateChange,
}) => {
	const [coordinates, setCoordinates] = useState<Coordinates>(DEFAULT_SNAKE_SELF);
	const refCoordinates = useRef<Coordinates>(coordinates);
	const startRef = useRef<number>();
	const foodRef = useRef(food);
	const [direction, setDirection] = useState<Direction>('up');
	const directionRef = useRef<Direction>(direction);
	const [state, setState] = useState<'alive' | 'dead'>('alive');
	const playStateRef = useRef(playState);

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
		if (playState === 'iddle') {
			setDirection(DEFAULT_DIRECTION);
			setCoordinates(DEFAULT_SNAKE_SELF);
			setState('alive');

			return;
		}

		if (playState === 'playing') {
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

		if (elapsed <= 10) {
			window.requestAnimationFrame(handleTick);

			return;
		}
		startRef.current = timestamp;
		const dir = chooseDirection();

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

	return <React.Fragment>{coordinates.map(renderDot)}</React.Fragment>;
};
