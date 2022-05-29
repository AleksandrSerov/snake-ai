import { FC } from 'react';
import { Stage } from '@inlet/react-pixi';

import { getRandomInt } from '../../utils/get-random-int';

import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_DOT_SIZE } from './constants';
import { Game } from './game';
import { Grid } from './grid';

import styles from './index.module.css';

const PARALLEL_RUNS_COUNT = 1;
const array = new Array(PARALLEL_RUNS_COUNT).fill(getRandomInt(PARALLEL_RUNS_COUNT));

export const App: FC = () => (
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
			{array.map((item, i) => (
				<Game key={ item } onFinish={ () => null } />
			))}

			<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ DEFAULT_DOT_SIZE } />
		</Stage>
	</div>
);
