import { FC, useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from 'recharts';

import { getInitialGames } from './utils/get-initial-games';
import { getNewGeneration } from './utils/get-new-generation';
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_DOT_SIZE, PARALLEL_RUNS_COUNT } from './constants';
import { Game, GameProps, Stat } from './game';
import { Grid } from './grid';

import styles from './index.module.css';
const initalGames = getInitialGames(PARALLEL_RUNS_COUNT);

export const App: FC = () => {
	const [games, setGames] = useState(initalGames);
	const statsRef = useRef<Array<Stat>>([]);
	const [speed, setSpeed] = useState(100);

	const [best, setBest] = useState<Stat | null>(null);
	const [generation, setGeneration] = useState(0);
	const [data, setData] = useState<Array<{ generation: number; average: number; best: number }>>(
		[],
	);

	const handleFinish: GameProps['onFinish'] = (stat) => {
		statsRef.current.push({
			...stat,
		});

		if (statsRef.current.length !== games.length) {
			return;
		}

		const bestResult = [...statsRef.current].sort((a, b) => b.scores - a.scores)[0];

		console.log(bestResult);
		const sumScores = Math.trunc(statsRef.current.reduce((acc, { scores }) => acc + scores, 0));

		setData((prevData) => [
			...prevData,
			{ generation, best: bestResult.scores, average: sumScores / games.length },
		]);
		setBest(bestResult);
		setGeneration((prev) => prev + 1);
		const newGeneration = getNewGeneration({
			length: games.length,
			stats: statsRef.current,
		});

		statsRef.current = [];
		setGames(newGeneration);
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

	const handleTrainedClick = (e: any) => {
		const checked = e.target.checked;

		setGeneration(1);
		statsRef.current = [];
		setBest(null);
		setData([]);
		if (checked) {
			const newGeneration = getNewGeneration({
				length: 3,
				stats: statsRef.current,
				useTrained: true,
			});

			setGames(newGeneration);

			return;
		}

		setGames(initalGames);
	};

	useEffect(() => {
		window.document.addEventListener('keydown', handleSpeedChange);

		return () => window.document.removeEventListener('keydown', handleSpeedChange);
	}, []);

	return (
		<div className={ styles.app }>
			<Stage
				width={ CANVAS_WIDTH }
				height={ CANVAS_HEIGHT }
				options={ {
					backgroundAlpha: 0,
					powerPreference: 'high-performance',
				} }
			>
				{games.map((item, i) => (
					// eslint-disable-next-line react/jsx-key
					<Game index={ i } onFinish={ handleFinish } brain={ item.brain } speed={ speed } />
				))}
				<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ DEFAULT_DOT_SIZE } />
			</Stage>
			<div>
				<div>
					<label
						htmlFor='trained'
						onClick={ handleTrainedClick }
						className={ styles.checkbox }
					>
						<input type='checkbox' id='trained' />
						<span>Use trained snake</span>
					</label>
				</div>
				<div>
					<div>Generation number - {generation}</div>
					<br />
					<div>Last generation best stat:</div>
					<div>Eaten food - {best?.eatenFoodCount}</div>
					<div>Lifespan - {best?.lifespan}</div>
					<div>Scores - {best?.scores}</div>
				</div>
				<LineChart width={ 500 } height={ 300 } data={ data }>
					<Line type='monotone' dataKey='average' stroke='#1884d8' />
					<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
					<XAxis dataKey='generation' height={ 45 }>
						<Label position='insideBottom' value='Average scores/generation' />
					</XAxis>
					<YAxis />
				</LineChart>
				<LineChart width={ 500 } height={ 300 } data={ data }>
					<Line type='monotone' dataKey='best' stroke='#8884d8' />
					<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
					<XAxis dataKey='generation' height={ 45 }>
						<Label position='insideBottom' value='Last generation best scores' />
					</XAxis>
					<YAxis />
				</LineChart>
			</div>
		</div>
	);
};
