import React, { useEffect, useRef, useState } from 'react';
import { matches, zip } from 'lodash';

import { getRandomInt } from '../../../utils/get-random-int';
import { multiplyMatrix } from '../../../utils/multiply-matrix';
import {
	CANVAS_WIDTH,
	DEFAULT_DIRECTION,
	DEFAULT_DOT_SIZE,
	DEFAULT_SNAKE_SELF,
	DIRECTION_BY_KEY,
	OPPOSITE_DIRECTION,
	SCAN_DIRECTIONS,
	SCAN_VECTOR_BY_SCAN_DIRECTION,
	TICK_MS,
} from '../constants';
import { Dots } from '../game';
import { Rectangle } from '../rectangle';
import { getNextTickSnake } from '../utils/get-next-tick-snake';
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

const getRandomMatrix = (columns: number, rows: number) =>
	new Array(rows)
		.fill(null)
		.map(() => new Array(columns).fill(null).map(() => Math.random() * 2 - 1));

const activationFunc = (x: number) => Math.max(0, x);

const inputToHidden = getRandomMatrix(12, 25);

const hiddenToOutput = getRandomMatrix(4, 13);
const getDistanceBetween = (a: Point, b: Point) => {
	const [x1, y1] = a;
	const [x2, y2] = b;

	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
const sumVectors = (vector1: Point, vector2: Point) => {
	const [x1, y1] = vector1;
	const [x2, y2] = vector2;

	return [x1 + x2, y1 + y2] as Point;
};
const scaleVector = (vector: Point, scale: number) => vector.map((coord) => coord * scale) as Point;

const isBorderPoint = (point: Point) =>
	point.some((coord) => coord < 0 || coord > CANVAS_WIDTH / DEFAULT_DOT_SIZE - 1);
const getDistanceToBorder = (head: Point, vector: Point) => {
	let scale = 1;
	let targetPoint = sumVectors(head, scaleVector(vector, scale));

	while (!isBorderPoint(targetPoint)) {
		scale += 1;
		targetPoint = sumVectors(head, scaleVector(vector, scale));
	}

	return getDistanceBetween(head, targetPoint);
};

const isTailPoint = (point: Point, tail: Array<Point>) =>
	tail.some((tailPoint) => matches(point)(tailPoint));
const getDistanceToTail = (head: Point, vector: Point, tail: Coordinates) => {
	let scale = 1;
	let targetPoint = sumVectors(head, scaleVector(vector, scale));

	while (!isTailPoint(targetPoint, tail) && !isBorderPoint(targetPoint)) {
		scale += 1;
		targetPoint = sumVectors(head, scaleVector(vector, scale));
	}

	if (!isTailPoint(targetPoint, tail)) {
		return 0;
	}

	return getDistanceBetween(head, targetPoint);
};

const isFoodPoint = (point: Point, foodPoint: Point) => matches(point)(foodPoint);

const getDistanceToFood = (head: Point, vector: Point, food: Point) => {
	let scale = 1;
	let targetPoint = sumVectors(head, scaleVector(vector, scale));

	while (!isFoodPoint(targetPoint, food) && !isBorderPoint(targetPoint)) {
		scale += 1;
		targetPoint = sumVectors(head, scaleVector(vector, scale));
	}

	if (!isFoodPoint(targetPoint, food)) {
		return 0;
	}

	return getDistanceBetween(head, targetPoint);
};

type TupleToUnion<T extends Array<any>> = T[number];
const scanDirection = ({
	snake,
	food,
	direction,
}: {
	snake: Array<Point>;
	food: Point;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	direction: TupleToUnion<typeof SCAN_DIRECTIONS>;
}) => {
	const vector = SCAN_VECTOR_BY_SCAN_DIRECTION[direction] as Point;
	const [head, ...tail] = snake;
	const distanceToBorder = getDistanceToBorder(head, vector);
	const distanceToTail = getDistanceToTail(head, vector, tail);
	const distanceToFood = getDistanceToFood(head, vector, food);

	return [distanceToBorder, distanceToTail, distanceToFood];
};

const isControlKey = (key: string): key is keyof typeof DIRECTION_BY_KEY =>
	Object.keys(DIRECTION_BY_KEY).includes(key);
const normalize = (value: number) => {
	if (value === 0) {
		return 0.00001;
	}

	return 1 / value;
};

const d = ['up', 'down', 'left', 'right'];
const chooseDirection = ({
	dots,
	snake,
	food,
}: {
	dots: Dots;
	snake: Coordinates;
	food: Point;
}) => {
	const info = Object.values(SCAN_DIRECTIONS)
		.map((direction) => scanDirection({ snake, food, direction }))
		.flat()
		.map(normalize);
	const inputLayer = info;

	const hiddenLayer = multiplyMatrix([[...inputLayer, 1]], inputToHidden)[0].map(activationFunc);

	const outputLayer = multiplyMatrix([[...hiddenLayer, 1]], hiddenToOutput)[0];
	const maxValue = Math.max(...outputLayer);
	const maxIndex = outputLayer.findIndex((value) => value === maxValue);
	const directions = Object.keys(DIRECTION_BY_KEY);

	return directions[maxIndex];
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

		if (elapsed <= TICK_MS) {
			window.requestAnimationFrame(handleTick);

			return;
		}
		startRef.current = timestamp;
		const dir = chooseDirection({ dots, snake: refCoordinates.current, food });

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
