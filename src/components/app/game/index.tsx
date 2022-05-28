import React, { FC, useEffect, useRef, useState } from 'react';

import {
	BORDER_VALUE,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	DEFAULT_DOT_SIZE,
	DEFAULT_SNAKE_SELF,
	EMPTY_VALUE,
	FOOD_VALUE,
} from '../constants';
import { Food, Point } from '../food';
import { Snake, SnakeProps } from '../snake';
import { Stats } from '../stats';
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

export type Dots = Array<Array<typeof EMPTY_VALUE | typeof BORDER_VALUE | typeof FOOD_VALUE>>;
type Food = [number, number] | null;

type GameProps = {
	onFinish: ({
		eatenFoodCount,
		lifeSpan,
		scores,
	}: {
		eatenFoodCount: number;
		lifeSpan: number;
		scores: number;
	}) => void;
};
export const Game: FC<GameProps> = ({ onFinish }) => {
	const [eatenFoodCount, setEatenFoodCount] = useState(0);
	const [playState, setPlayState] = useState<'iddle' | 'playing'>('iddle');
	const [food, setFood] = useState<Point>(
		getRandomEmptyDotPoint(DEFAULT_DOTS, DEFAULT_SNAKE_SELF),
	);
	const [birthTime, setBirthTime] = useState<number | null>(null);

	const handleFoodEaten: SnakeProps['onFoodEaten'] = (snake) => {
		setEatenFoodCount((prevCount) => prevCount + 1);
		setFood(getRandomEmptyDotPoint(DEFAULT_DOTS, snake));
	};

	const handleStateChange: SnakeProps['onStateChange'] = (snakeState) => {
		if (snakeState === 'dead') {
			if (birthTime === null) {
				return;
			}
			const lifeSpan = Date.now() / 1000 - birthTime;

			onFinish({
				eatenFoodCount,
				lifeSpan: lifeSpan,
				scores: Math.pow(lifeSpan, 0.5) + eatenFoodCount * 10,
			});
			setPlayState('iddle');

			return;
		}
	};

	useEffect(() => {
		if (playState === 'playing') {
			setEatenFoodCount(0);
			setBirthTime(Date.now() / 1000);
		}
	}, [playState]);

	return (
		<React.Fragment>
			<Stats
				canvasWidth={ CANVAS_WIDTH }
				canvasHeight={ CANVAS_HEIGHT }
				eatenFoodCount={ eatenFoodCount }
				playState={ playState }
			/>
			<Snake
				dotSize={ DEFAULT_DOT_SIZE }
				playState={ playState }
				setPlayState={ setPlayState }
				dots={ DEFAULT_DOTS }
				food={ food }
				onFoodEaten={ handleFoodEaten }
				onStateChange={ handleStateChange }
			/>
			{food && <Food point={ food } dotSize={ DEFAULT_DOT_SIZE } />}
		</React.Fragment>
	);
};
