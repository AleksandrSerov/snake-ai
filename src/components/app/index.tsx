import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import defaultBrain from './snake/brain/brain.json';
import { getInitialGames } from './utils/get-initial-games';
import { getNewGeneration } from './utils/get-new-generation';
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_DOT_SIZE, PARALLEL_RUNS_COUNT } from './constants';
import { Game, GameProps, Stat } from './game';
import { Grid } from './grid';

import styles from './index.module.css';

export const App: FC = () => {
	const [games, setGames] = useState(getInitialGames(PARALLEL_RUNS_COUNT, defaultBrain));
	const statsRef = useRef<Array<Stat>>([]);
	const [speed, setSpeed] = useState(100);

	const [best, setBest] = useState<Stat | null>(null);
	const [generation, setGeneration] = useState(0);
	const [data, setData] = useState<Array<{ generation: number; average: number; best: number }>>(
		[],
	);

	const handleFinish: GameProps['onFinish'] = useCallback(
		(stat) => {
			statsRef.current.push({
				...stat,
			});

			if (statsRef.current.length !== PARALLEL_RUNS_COUNT) {
				return;
			}

			const bestResult = [...statsRef.current].sort((a, b) => b.scores - a.scores)[0];

			console.log(bestResult);
			const sumScores = Math.trunc(
				statsRef.current.reduce((acc, { scores }) => acc + scores, 0),
			);

			setData((prevData) => [
				...prevData,
				{ generation, best: bestResult.scores, average: sumScores / PARALLEL_RUNS_COUNT },
			]);
			setBest(bestResult);
			setGeneration((prev) => prev + 1);

			const newGeneration = getNewGeneration({
				length: PARALLEL_RUNS_COUNT,
				stats: statsRef.current,
			});

			statsRef.current = [];
			setGames(newGeneration);
		},
		[generation],
	);

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
