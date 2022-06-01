import { multiplyMatrix } from '../../../../utils/multiply-matrix';
import { SCAN_DIRECTIONS, SCAN_VECTOR_BY_SCAN_DIRECTION } from '../../constants';
import { Point } from '../../food';

import { activate } from './utils/activate';
import { getDistanceToBorder } from './utils/get-distance-to-border';
import { getDistanceToFood } from './utils/get-distance-to-food';
import { getDistanceToTail } from './utils/get-distance-to-tail';
import { normalize } from './utils/normalize';

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
	const inputLayer = SCAN_DIRECTIONS.map((direction) => scanDirection({ snake, food, direction }))
		.flat()
		.map(normalize);

	const hiddenLayer = multiplyMatrix([[...inputLayer, 1]], brain.part1)[0].map(activate);

	const outputLayer = multiplyMatrix([[...hiddenLayer, 1]], brain.part2)[0];

	const maxValue = Math.max(...outputLayer);
	const maxIndex = outputLayer.findIndex((value) => value === maxValue);

	const directions = ['KeyW', 'KeyA', 'KeyS', 'KeyD'] as const;

	return directions[maxIndex];
};

export const brain = {
	think,
};
