import React, { useEffect, useRef, useState } from 'react';

import {
	DEFAULT_DIRECTION,
	DEFAULT_SNAKE_SELF,
	DIRECTION_BY_KEY,
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
	const [direction, setDirection] = useState<Direction>('up');
	const [state, setState] = useState<'alive' | 'dead'>('alive');
	const timerRef = useRef<ReturnType<typeof setInterval>>();

	useEffect(() => {
		refCoordinates.current = coordinates;
	}, [coordinates]);

	useEffect(() => {
		onStateChange?.(state);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	useEffect(() => {
		if (playState === 'iddle') {
			clearInterval(timerRef.current);
			timerRef.current = undefined;
			setDirection(DEFAULT_DIRECTION);
			setCoordinates(DEFAULT_SNAKE_SELF);
			setState('alive');

			return;
		}

		if (playState === 'playing') {
			clearInterval(timerRef.current);

			const timerId = setInterval(handleTick, 100);

			timerRef.current = timerId;

			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playState, direction]);

	const handleTick = () => {
		const {
			state,
			self: updatedSnake,
			foodEaten,
		} = getNextTickSnake(refCoordinates.current, direction, dots, food);

		setCoordinates(updatedSnake);
		setState(state);
		if (foodEaten) {
			onFoodEaten(updatedSnake);
		}
	};

	const handleChangeDirection = (e: KeyboardEvent) => {
		if (playState === 'iddle') {
			setPlayState('playing');
		}
		const code = e.code as 'KeyA' | 'KeyD' | 'KeyW' | 'KeyS';

		const newDirection = DIRECTION_BY_KEY[code];

		const isOppositeDirection = direction === OPPOSITE_DIRECTION[newDirection];
		const isSameDirection = direction === newDirection;

		const nextDotTheOwnBody =
			getNextTickSnake(coordinates, direction, dots, food).self[0] === coordinates[1];

		if (isSameDirection || isOppositeDirection) {
			return;
		}
		if (nextDotTheOwnBody) {
			return;
		}
		setDirection(newDirection);
		handleTick();
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
		window.addEventListener('keypress', handleChangeDirection);

		return () => window.removeEventListener('keypress', handleChangeDirection);
	});

	return <React.Fragment>{coordinates.map(renderDot)}</React.Fragment>;
};