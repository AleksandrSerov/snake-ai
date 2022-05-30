import React, { FC, useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';

import brain from './snake/brain/brain.json';
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_DOT_SIZE } from './constants';
import { Game, GameProps } from './game';
import { Grid } from './grid';

import styles from './index.module.css';

const PARALLEL_RUNS_COUNT = 25;

const getInitialGames = () =>
	new Array(PARALLEL_RUNS_COUNT).fill(null).map(() => ({
		brain: {
			part1: brain.part1,
			part2: brain.part2,
		},
	}));

const pickRandomByScores = (
	snakes: Array<{
		eatenFoodCount: number;
		lifeSpan: number;
		scores: number;
		brain: {
			part1: Array<Array<number>>;
			part2: Array<Array<number>>;
		};
	}>,
) => {
	const sumScores = snakes.reduce((acc, { scores }) => acc + scores, 0);

	const forRandom = snakes.map(({ scores }, index) => ({
		index,
		res: Math.round((scores * 100) / sumScores),
	}));

	const arrforRandom = forRandom
		.map(({ index, res }) => String(index).repeat(res).split('').map(Number))
		.flat();

	const targetIndex = arrforRandom[Math.trunc(Math.random() * 100)];

	return snakes[targetIndex];
};
const mixBrain = (p1, p2) =>
	p1.map((array, index) =>
		array.map((item, index1) => {
			if (Math.random().toFixed(2) === '0.20') {
				return Math.random() * 2 - 1;
			}
			if (Math.random() >= 0.5) {
				return item;
			}

			return p2[index][index1];
		}),
	);

export const App: FC = () => {
	const [games, setGames] = useState(getInitialGames());
	const [stats, setStats] = useState([]);
	const [best, setBest] = useState(null);
	const [birthTime, setBirthTime] = useState(Date.now() / 1000);

	const handleFinish: (i: number) => GameProps['onFinish'] = (i) => (stat) => {
		const lifespan = Date.now() / 1000 - birthTime;
		const scores = Math.sqrt(lifespan) + Math.pow(2, stat.eatenFoodCount);

		setStats([
			...stats,
			{
				...stat,
				index: i,
				lifespan,
				scores,
			},
		]);
	};

	useEffect(() => {
		if (stats.length !== PARALLEL_RUNS_COUNT) {
			return;
		}
		setBirthTime(Date.now() / 1000);
		const bestResult = stats.sort((a, b) => b.scores - a.scores)[0];

		setBest(bestResult);
		console.log(bestResult);

		setStats([]);
		const newGeneration = new Array(PARALLEL_RUNS_COUNT).fill(null).map(() => {
			const pickFirstParent = pickRandomByScores(stats) || bestResult;

			const pickSecondParent = pickRandomByScores(stats) || bestResult;

			const brain = {
				part1: mixBrain(pickFirstParent.brain.part1, pickSecondParent.brain.part1),
				part2: mixBrain(pickFirstParent.brain.part2, pickSecondParent.brain.part2),
			};

			return {
				brain,
			};
		});

		setGames(newGeneration);
	}, [stats]);

	return (
		<div className={ styles.app }>
			{best && (
				<div>
					<div>eatenFoodCount - {best.eatenFoodCount}</div>
					<div>lifespan - {best.lifespan}</div>
					<div>scores - {best.scores}</div>
				</div>
			)}
			<Stage
				className={ styles.canvas }
				width={ CANVAS_WIDTH }
				height={ CANVAS_HEIGHT }
				options={ {
					backgroundAlpha: 0,
					powerPreference: 'high-performance',
				} }
			>
				{games.map((item, i) => (
					<Game key={ i } onFinish={ handleFinish(i) } brain={ item.brain } birthTime={ birthTime } />
				))}

				<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ DEFAULT_DOT_SIZE } />
			</Stage>
		</div>
	);
};
