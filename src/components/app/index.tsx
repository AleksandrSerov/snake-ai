import { FC, useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';

import { generateDots } from './utils/generate-dots';
import { getNextTickSnake } from './utils/get-next-tick-snake';
import { getRandomEmptyDotPoint } from './utils/get-random-empty-dot-point';
import { ClickableAria } from './clickable-aria';
import {
	BORDER_VALUE,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	DEFAULT_DIRECTION,
	DEFAULT_DOT_SIZE,
	DEFAULT_SNAKE,
	DEFAULT_SNAKE_SELF,
	DIRECTION_BY_KEY,
	EMPTY_VALUE,
	FOOD_VALUE,
	OPPOSITE_DIRECTION,
} from './constants';
import { Grid } from './grid';
import { Rectangle } from './rectangle';
import { Stats } from './stats';

import styles from './index.module.css';

export type Direction = 'up' | 'down' | 'left' | 'right';
type SnakePart = [number, number];
export type Snake = Array<SnakePart>;
export type Dots = Array<Array<typeof EMPTY_VALUE | typeof BORDER_VALUE | typeof FOOD_VALUE>>;
type Food = [number, number] | null;

const DEFAULT_DOTS = (() => {
	const dots = generateDots({
		generateValue: () => 0,
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
		size: DEFAULT_DOT_SIZE,
	});

	DEFAULT_SNAKE_SELF.forEach(([i, j]) => {
		dots[i][j] = BORDER_VALUE;
	});

	return dots;
})();

export const App: FC = () => {
	const [snake, setSnake] = useState<{
		state: 'alive' | 'dead';
		foodEaten: boolean;
		self: Snake;
	}>({
		state: 'alive',
		foodEaten: false,
		self: DEFAULT_SNAKE_SELF,
	});
	const [direction, setDirection] = useState<Direction>('up');
	const [playState, setPlayState] = useState<'iddle' | 'playing'>('iddle');
	const [dotSize] = useState(DEFAULT_DOT_SIZE);
	const [dots, setDots] = useState(DEFAULT_DOTS);
	const dotsRef = useRef(dots);
	const [food, setFood] = useState<Food>(getRandomEmptyDotPoint(dots));
	const timerRef = useRef<ReturnType<typeof setInterval>>();
	const [startTime, setStartTime] = useState<null | number>(null);

	useEffect(() => {
		dotsRef.current = dots;
	}, [dots]);

	const handleChangeDirection = (e: KeyboardEvent) => {
		if (playState === 'iddle') {
			setPlayState('playing');
			setStartTime(Date.now());
		}
		const code = e.code as 'KeyA' | 'KeyD' | 'KeyW' | 'KeyS';

		const newDirection = DIRECTION_BY_KEY[code];

		const isOppositeDirection = direction === OPPOSITE_DIRECTION[newDirection];
		const isSameDirection = direction === newDirection;

		const nextDotTheOwnBody =
			getNextTickSnake(snake.self, direction, dots).self[0] === snake.self[1];

		if (isSameDirection || isOppositeDirection) {
			return;
		}
		if (nextDotTheOwnBody) {
			return;
		}
		setDirection(newDirection);
		handleTick();
	};

	const handleTick = () => {
		setSnake((prevSnake) => {
			const {
				state,
				self: updatedSnake,
				foodEaten,
			} = getNextTickSnake(prevSnake.self, direction, dotsRef.current);

			if (foodEaten) {
				setFood(null);
			}

			return { state, self: updatedSnake, foodEaten };
		});
	};

	useEffect(() => {
		if (playState === 'iddle') {
			clearInterval(timerRef.current);
			timerRef.current = undefined;
			setDots(DEFAULT_DOTS);
			setDirection(DEFAULT_DIRECTION);
			setSnake(DEFAULT_SNAKE);

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

	const renderDot = ([i, j]: [number, number]) => {
		const dotValue = dots[i][j];

		if (dotValue === 0) {
			return null;
		}

		return (
			<Rectangle.Graphics
				key={ `${i}_${j}` }
				x={ j * dotSize }
				y={ i * dotSize }
				width={ dotSize }
				height={ dotSize }
				dotValue={ dotValue }
			/>
		);
	};

	useEffect(() => {
		if (food === null) {
			setFood(getRandomEmptyDotPoint(dots));

			return;
		}

		const nextDots = generateDots({
			generateValue: () => 0,
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			size: DEFAULT_DOT_SIZE,
		});

		snake.self.forEach((snakeBody) => {
			const [i, j] = snakeBody;

			nextDots[i][j] = BORDER_VALUE;
		});

		const [foodI, foodJ] = food;

		nextDots[foodI][foodJ] = FOOD_VALUE;
		setDots(nextDots);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [food, snake.self]);

	useEffect(() => {
		if (snake.state === 'dead') {
			alert('Game over');
			setPlayState('iddle');

			return;
		}
	}, [snake.state]);

	useEffect(() => {
		window.addEventListener('keypress', handleChangeDirection);

		return () => window.removeEventListener('keypress', handleChangeDirection);
	});
	const lifeTime = !startTime
		? Number((0).toFixed(2))
		: Number(((Date.now() - startTime) / 1000).toFixed(2));
	const eatenFoodCount = snake.self.length - DEFAULT_SNAKE_SELF.length;
	const scores = parseFloat(Math.pow(lifeTime, 0.5)) + eatenFoodCount * 10;
	const ramainingTime = 30 - lifeTime;

	return (
		<div className={ styles.app }>
			<div className={ styles.canvas }>
				<Stats
					className={ styles.stats }
					canvasWidth={ CANVAS_WIDTH }
					canvasHeight={ CANVAS_HEIGHT }
					scores={ scores.toFixed(2) }
					remainingTime={ ramainingTime.toFixed(2) }
					lifeTime={ lifeTime.toFixed(2) }
					eatenFoodCount={ eatenFoodCount }
				/>
				<Stage
					width={ CANVAS_WIDTH }
					height={ CANVAS_HEIGHT }
					options={ {
						backgroundColor: string2hex('#ffffff'),
						powerPreference: 'high-performance',
					} }
				>
					<ClickableAria width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } />

					{dots.map((dotsArray, i) => dotsArray.map((_, j) => renderDot([i, j])))}

					<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ dotSize } />
				</Stage>
			</div>
			<div className={ styles.controls }>{playState}</div>
		</div>
	);
};
