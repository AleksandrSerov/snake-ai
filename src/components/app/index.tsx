import { FC, useEffect, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';

import { generateDots } from './utils/generate-dots';
import { getRandomEmptyDotPoint } from './utils/get-random-empty-dot-point';
import {
	BORDER_VALUE,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	DEFAULT_DOT_SIZE,
	DEFAULT_SNAKE_SELF,
	EMPTY_VALUE,
	FOOD_VALUE,
} from './constants';
import { Food, Point } from './food';
import { Grid } from './grid';
import { Snake, SnakeProps } from './snake';
import { Stats } from './stats';

import styles from './index.module.css';

export type Dots = Array<Array<typeof EMPTY_VALUE | typeof BORDER_VALUE | typeof FOOD_VALUE>>;
type Food = [number, number] | null;

const DEFAULT_DOTS = (() => {
	const dots = generateDots({
		generateValue: () => 0,
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
		size: DEFAULT_DOT_SIZE,
	});

	return dots;
})();

export const App: FC = () => {
	const [eatenFoodCount, setEatenFoodCount] = useState(0);
	const [playState, setPlayState] = useState<'iddle' | 'playing'>('iddle');
	const [food, setFood] = useState<Point>(
		getRandomEmptyDotPoint(DEFAULT_DOTS, DEFAULT_SNAKE_SELF),
	);

	const handleFoodEaten: SnakeProps['onFoodEaten'] = (snake) => {
		setEatenFoodCount((prevCount) => prevCount + 1);
		setFood(getRandomEmptyDotPoint(DEFAULT_DOTS, snake));
	};

	const handleStateChange: SnakeProps['onStateChange'] = (snakeState) => {
		if (snakeState === 'dead') {
			alert('Game over');
			setPlayState('iddle');

			return;
		}
	};

	useEffect(() => {
		if (playState === 'playing') {
			setEatenFoodCount(0);
		}
	}, [playState]);

	return (
		<div className={ styles.app }>
			<div className={ styles.canvas }>
				<Stats
					className={ styles.stats }
					canvasWidth={ CANVAS_WIDTH }
					canvasHeight={ CANVAS_HEIGHT }
					eatenFoodCount={ eatenFoodCount }
					playState={ playState }
				/>
				<Stage
					width={ CANVAS_WIDTH }
					height={ CANVAS_HEIGHT }
					options={ {
						backgroundColor: string2hex('#20b2aa'),
						powerPreference: 'high-performance',
					} }
				>
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

					<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ DEFAULT_DOT_SIZE } />
				</Stage>
			</div>
		</div>
	);
};
