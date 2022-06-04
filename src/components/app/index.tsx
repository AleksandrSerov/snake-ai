import { FC, useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import defaultBrain from './snake/brain/brain.json';
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_DOT_SIZE, PARALLEL_RUNS_COUNT } from './constants';
import { Game, GameProps } from './game';
import { Grid } from './grid';

import styles from './index.module.css';

const getInitialGames = () =>
	new Array(PARALLEL_RUNS_COUNT).fill(null).map(() => ({
		brain: {
			part1: defaultBrain.part1,
			part2: defaultBrain.part2,
		},
	}));

const pickRandomByScores = (
	snakes: Array<{
		index: number;
		scores: number;
		eatenFoodCount: number;
		brain: {
			part1: Array<Array<number>>;
			part2: Array<Array<number>>;
		};
	}>,
) => {
	const sumScores = Math.round(snakes.reduce((acc, { scores }) => acc + scores, 0));

	const forRandom = snakes.map(({ scores, index }) => ({
		index,
		res: Math.round((scores / sumScores) * 100),
	}));

	const arrforRandom = forRandom
		.map(({ index, res }) => String(index).repeat(res).split('').map(Number))
		.flat();

	const targetIndex = arrforRandom[Math.trunc(Math.random() * forRandom.length)];
	const result = snakes[targetIndex];

	return result;
};
const mixBrain = (p1: Array<Array<number>>, p2: Array<Array<number>>) => {
	let mutationCount = 0;
	let firstParentGenes = 0;
	let secondParentGenes = 0;
	const mutationPercent = 0.02;
	const totalGenes = p1.length * p1[0].length;
	const maxMutationsCount = totalGenes * mutationPercent;

	const newBrain = p1.map((array, index) =>
		array.map((item, index1) => {
			const random = Math.random().toFixed(2);

			if (['0.01', '0.02'].includes(random) && mutationCount < maxMutationsCount) {
				const newValue = Math.random() * 2 - 1;

				mutationCount += 1;

				return newValue;
			}
			if (index1 >= array.length / 2) {
				firstParentGenes += 1;

				return item;
			}
			secondParentGenes += 1;

			return p2[index][index1];
		}),
	);
	const mutationRate = parseFloat(((mutationCount / totalGenes) * 100).toFixed(2));
	const maxMutationRate = parseFloat(((maxMutationsCount / totalGenes) * 100).toFixed(2));
	const firstParentGenesRate = parseFloat(((firstParentGenes / totalGenes) * 100).toFixed(2));
	const secondParentGenesRate = parseFloat(((secondParentGenes / totalGenes) * 100).toFixed(2));

	// console.log('mutation rate - ', mutationRate, '%');
	// console.log('firstParentGenes rate - ', firstParentGenesRate, '%');
	// console.log('secondParentGenesRate rate - ', secondParentGenesRate, '%');

	return newBrain;
};
// console.log(getRandomBrain());

export const App: FC = () => {
	const [games, setGames] = useState(getInitialGames());
	const statsRef = useRef<
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
	const [speed, setSpeed] = useState(100);

	const [best, setBest] = useState<{
		index: number;
		lifespan: number;
		scores: number;
		eatenFoodCount: number;
	} | null>(null);
	const [generation, setGeneration] = useState(0);
	const [data, setData] = useState<Array<{ generation: number; average: number; best: number }>>(
		[],
	);

	const handleFinish: GameProps['onFinish'] = (stat) => {
		// console.log(stat);
		statsRef.current.push({
			...stat,
		});

		if (statsRef.current.length === PARALLEL_RUNS_COUNT) {
			const bestResult = [...statsRef.current].sort((a, b) => b.scores - a.scores)[0];
			const sumScores = Math.trunc(
				statsRef.current.reduce((acc, { scores }) => acc + scores, 0),
			);

			setData((prevData) => [
				...prevData,
				{ generation, best: bestResult.scores, average: sumScores / PARALLEL_RUNS_COUNT },
			]);
			setBest(bestResult);
			// console.table(bestResult);
			setGeneration((prev) => prev + 1);

			const newGeneration = new Array(PARALLEL_RUNS_COUNT).fill(null).map(() => {
				const pickFirstParent = pickRandomByScores(statsRef.current) || bestResult;
				const pickSecondParent = pickRandomByScores(statsRef.current) || bestResult;

				const brain = {
					part1: mixBrain(pickFirstParent.brain.part1, pickSecondParent.brain.part1),
					part2: mixBrain(pickFirstParent.brain.part2, pickSecondParent.brain.part2),
				};

				return {
					brain,
				};
			});

			statsRef.current = [];
			setGames(newGeneration);
		}
	};

	const handleSpeedChange = (e: KeyboardEvent) => {
		if (e.code === 'Minus') {
			setSpeed((prevSpeed) => prevSpeed - 10);

			return;
		}
		if (e.code === 'Equal') {
			setSpeed((prevSpeed) => prevSpeed + 10);

			return;
		}
	};

	useEffect(() => {
		window.document.addEventListener('keydown', handleSpeedChange);

		return () => window.document.removeEventListener('keydown', handleSpeedChange);
	}, []);

	return (
		<div className={ styles.app }>
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
						index={ i }
						onFinish={ handleFinish }
						brain={ item.brain }
						speed={ speed }
					/>
				))}
				<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ DEFAULT_DOT_SIZE } />
			</Stage>
			<div>
				<div>
					<div>generation number - {generation}</div>
					<div>current speed - {speed} %</div>

					<div>eatenFoodCount - {best?.eatenFoodCount}</div>
					<div>lifespan - {best?.lifespan}</div>
					<div>scores - {best?.scores}</div>
				</div>
				Average scores/generation
				<LineChart width={ 500 } height={ 300 } data={ data }>
					<Line type='monotone' dataKey='average' stroke='#1884d8' />
					<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
					<XAxis dataKey='generation' />
					<YAxis />
				</LineChart>
				Last generation best scores
				<LineChart width={ 500 } height={ 300 } data={ data }>
					<Line type='monotone' dataKey='best' stroke='#8884d8' />
					<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
					<XAxis dataKey='generation' />
					<YAxis />
				</LineChart>
			</div>
		</div>
	);
};
