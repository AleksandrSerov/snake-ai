import React, { FC, useEffect, useState } from 'react';

import {
	BORDER_VALUE,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	DEFAULT_DOT_SIZE,
	EMPTY_VALUE,
	FOOD_VALUE,
	getDefaultSnake,
} from '../constants';
import { Food, Point } from '../food';
import { Snake, SnakeProps } from '../snake';
import { generateDots } from '../utils/generate-dots';
import { getRandomEmptyDotPoint } from '../utils/get-random-empty-dot-point';

const DEFAULT_DOTS = (() => {
	const dots = generateDots({
		generateValue: () => 0,
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
		size: DEFAULT_DOT_SIZE,
	});

	return dots;
})();

const success = (lifespan: number, eatenFoodCount: number) =>
	Math.pow(lifespan, 2) * Math.pow(2, eatenFoodCount);

export type Dots = Array<Array<typeof EMPTY_VALUE | typeof BORDER_VALUE | typeof FOOD_VALUE>>;
type Food = [number, number] | null;
export type Brain = {
	part1: Array<Array<number>>;
	part2: Array<Array<number>>;
};
export type Stat = {
	index: number;
	lifespan: number;
	scores: number;
	eatenFoodCount: number;
	brain: Brain;
};
export type GameProps = {
	speed: number;
	index: number;
	brain: Brain;
	onFinish: (stat: Stat) => void;
};

export const Game: FC<GameProps> = ({ onFinish, brain, index, speed }) => {
	const [snake, setSnake] = useState(getDefaultSnake());
	const [eatenFoodCount, setEatenFoodCount] = useState(0);
	const [playState, setPlayState] = useState<'iddle' | 'playing' | 'finish'>('playing');
	const [food, setFood] = useState<Point>(getRandomEmptyDotPoint(DEFAULT_DOTS, snake.self));
	const handleFoodEaten: SnakeProps['onFoodEaten'] = (snake) => {
		setEatenFoodCount((prevCount) => prevCount + 1);
		setFood(getRandomEmptyDotPoint(DEFAULT_DOTS, snake));
	};

	useEffect(() => {
		setSnake(getDefaultSnake());
		setEatenFoodCount(0);
		setFood(getRandomEmptyDotPoint(DEFAULT_DOTS, snake.self));
		setPlayState('playing');
	}, [brain]);

	const handleStateChange: SnakeProps['onStateChange'] = (snakeState, lifespan) => {
		if (snakeState === 'dead') {
			setPlayState('finish');
			const scores = success(lifespan, eatenFoodCount);

			onFinish({
				index,
				eatenFoodCount,
				brain,
				lifespan,
				scores,
			});

			return;
		}
	};

	return (
		<React.Fragment>
			<Snake
				snake={ snake }
				dotSize={ DEFAULT_DOT_SIZE }
				dots={ DEFAULT_DOTS }
				food={ food }
				onFoodEaten={ handleFoodEaten }
				onStateChange={ handleStateChange }
				brain={ brain }
				speed={ speed }
				eatenFoodCount={ eatenFoodCount }
			/>
			{playState === 'playing' && <Food point={ food } dotSize={ DEFAULT_DOT_SIZE } />}
		</React.Fragment>
	);
};
