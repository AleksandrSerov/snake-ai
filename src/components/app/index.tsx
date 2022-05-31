import { FC, useEffect, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import brain from './snake/brain/brain.json';
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_DOT_SIZE } from './constants';
import { Game, GameProps } from './game';
import { Grid } from './grid';

import styles from './index.module.css';

const PARALLEL_RUNS_COUNT = 1;

const getInitialGames = () =>
	new Array(PARALLEL_RUNS_COUNT).fill(null).map(() => ({
		brain: {
			part1: brain.part1,
			part2: brain.part2,
		},
	}));

const pickRandomByScores = (
	snakes: Array<{
		index: number;
		lifespan: number;
		scores: number;
		eatenFoodCount: number;
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
const mixBrain = (p1, p2) => {
	let count = 0;
	const newBrain = p1.map((array, index) =>
		array.map((item, index1) => {
			const random = Math.random().toFixed(2);

			if (random === '0.01' || random === '0.02') {
				const newValue = Math.random() * 2 - 1;

				count += 1;

				return newValue;
			}
			if (Math.random() >= 0.5) {
				return item;
			}

			return p2[index][index1];
		}),
	);

	console.log('mutation percent - ', (count / (p1.length * p1[0].length)) * 100, ' %');

	return newBrain;
};

export const App: FC = () => {
	const [games, setGames] = useState(getInitialGames());
	const [stats, setStats] = useState<
		Array<{
			index: number;
			lifespan: number;
			scores: number;
			eatenFoodCount: number;
			brain: {
				part1: Array<Array<number>>;
				part2: Array<Array<number>>;
			};
		}>
	>([]);
	const [best, setBest] = useState<{
		index: number;
		lifespan: number;
		scores: number;
		eatenFoodCount: number;
	} | null>(null);
	const [generation, setGeneration] = useState(0);
	const [birthTime, setBirthTime] = useState(Date.now() / 1000);
	const [data, setData] = useState<Array<{ generation: number; scores: number }>>([]);

	const handleFinish: (i: number) => GameProps['onFinish'] = (i) => (stat) => {
		const lifespan = Date.now() / 1000 - birthTime;
		const scores = Math.pow(lifespan, 2) * Math.pow(2, stat.eatenFoodCount);

		setStats((prevStats) => [
			...prevStats,
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

		setData((prevData) => [...prevData, { generation, scores: bestResult.scores }]);
		setBest(bestResult);
		setGeneration((prev) => prev + 1);
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
			<LineChart
				width={ 600 }
				height={ 300 }
				data={ data }
				margin={ { top: 5, right: 20, bottom: 5, left: 0 } }
			>
				<Line type='monotone' dataKey='scores' stroke='#8884d8' />
				<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
				<XAxis dataKey='generation' />
				<YAxis />
			</LineChart>
			{best && (
				<div>
					<div>generation number - {generation}</div>
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
					<Game
						// eslint-disable-next-line react/no-array-index-key
						key={ i }
						onFinish={ handleFinish(i) }
						brain={ item.brain }
						birthTime={ birthTime }
					/>
				))}

				<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ DEFAULT_DOT_SIZE } />
			</Stage>
		</div>
	);
};
