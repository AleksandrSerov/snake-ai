import React, { FC, useEffect, useRef, useState } from 'react';

import {
	BORDER_VALUE,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	DEFAULT_DOT_SIZE,
	EMPTY_VALUE,
	FOOD_VALUE,
	getDefaultSnakeSelf,
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

export type Dots = Array<Array<typeof EMPTY_VALUE | typeof BORDER_VALUE | typeof FOOD_VALUE>>;
type Food = [number, number] | null;

export type GameProps = {
	birthTime: number;
	brain: {
		part1: Array<Array<number>>;
		part2: Array<Array<number>>;
	};
	onFinish: ({
		eatenFoodCount,
		brain,
	}: {
		eatenFoodCount: number;
		brain: {
			part1: Array<Array<number>>;
			part2: Array<Array<number>>;
		};
	}) => void;
};
export const Game: FC<GameProps> = ({ onFinish, brain, birthTime }) => {
	const defaultSnakeRef = useRef(getDefaultSnakeSelf());
	const [eatenFoodCount, setEatenFoodCount] = useState(0);
	const [playState, setPlayState] = useState<'iddle' | 'playing' | 'finish'>('playing');
	const [food, setFood] = useState<Point>(
		getRandomEmptyDotPoint(DEFAULT_DOTS, defaultSnakeRef.current),
	);
	const handleFoodEaten: SnakeProps['onFoodEaten'] = (snake) => {
		setEatenFoodCount((prevCount) => prevCount + 1);
		setFood(getRandomEmptyDotPoint(DEFAULT_DOTS, snake));
	};

	useEffect(() => {
		if (playState === 'finish') {
			setPlayState('iddle');
			setPlayState('playing');
		}
	}, [brain]);

	const handleStateChange: SnakeProps['onStateChange'] = (snakeState) => {
		if (snakeState === 'dead') {
			setPlayState('finish');
			onFinish({
				eatenFoodCount,
				brain,
			});

			return;
		}
	};

	useEffect(() => {
		if (playState === 'playing') {
			setEatenFoodCount(0);
		}
	}, [playState]);

	return (
		<React.Fragment>
			{playState !== 'finish' && (
				<Snake
					defaultCoordinates={ defaultSnakeRef.current }
					dotSize={ DEFAULT_DOT_SIZE }
					playState={ playState }
					setPlayState={ setPlayState }
					dots={ DEFAULT_DOTS }
					food={ food }
					onFoodEaten={ handleFoodEaten }
					onStateChange={ handleStateChange }
					brain={ brain }
					birthTime={ birthTime }
				/>
			)}
			{food && playState !== 'finish' && <Food point={ food } dotSize={ DEFAULT_DOT_SIZE } />}
		</React.Fragment>
	);
};
