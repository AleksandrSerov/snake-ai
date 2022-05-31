import { matches } from 'lodash';

import { multiplyMatrix } from '../../../../utils/multiply-matrix';
import {
	CANVAS_WIDTH,
	DEFAULT_DOT_SIZE,
	DIRECTION_BY_KEY,
	SCAN_DIRECTIONS,
	SCAN_VECTOR_BY_SCAN_DIRECTION,
} from '../../constants';
import { Point } from '../../food';

const normalize = (value: number) => {
	if (value === 0) {
		return 0.00001;
	}

	return 1 / value;
};

type TupleToUnion<T extends Array<any>> = T[number];
const getRandomMatrix = (columns: number, rows: number) =>
	new Array(rows)
		.fill(null)
		.map(() => new Array(columns).fill(null).map(() => Math.random() * 2 - 1));

const activationFunc = (x: number) => Math.max(0, x);

// const inputToHidden = getRandomMatrix(12, 25);

// const hiddenToOutput = getRandomMatrix(4, 13);

// const br = {
// 	part1: inputToHidden,
// 	part2: hiddenToOutput,
// };

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
const getDistanceToTail = (head: Point, vector: Point, tail: Array<Point>) => {
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

const think = ({
	snake,
	food,
	brain,
}: {
	snake: Array<Point>;
	food: Point;
	brain: {
		part1: Array<Array<number>>;
		part2: Array<Array<number>>;
	};
}) => {
	const info = Object.values(SCAN_DIRECTIONS)
		.map((direction) => scanDirection({ snake, food, direction }))
		.flat()
		.map(normalize);
	const inputLayer = info;

	const hiddenLayer = multiplyMatrix([[...inputLayer, 1]], brain.part1)[0].map(activationFunc);

	const outputLayer = multiplyMatrix([[...hiddenLayer, 1]], brain.part2)[0];
	const maxValue = Math.max(...outputLayer);
	const maxIndex = outputLayer.findIndex((value) => value === maxValue);
	const directions = Object.keys(DIRECTION_BY_KEY);

	return directions[maxIndex];
};

export const brain = {
	think,
};
