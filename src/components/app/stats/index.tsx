import { VFC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type Props = {
	canvasWidth: number;
	canvasHeight: number;
	className?: string;
	scores: number;
	eatenFoodCount: number;
	lifeTime: number;
	remainingTime: string;
};

export const Stats: VFC<Props> = ({
	canvasWidth,
	canvasHeight,
	scores,
	className,
	lifeTime,
	eatenFoodCount,
	remainingTime,
}) => (
	<div className={ cn(styles.stats, className) }>
		<div>
			{canvasWidth}px X {canvasHeight}px
		</div>
		<div>Scores: {scores}</div>
		<div>Life time: {lifeTime}</div>
		<div>Remaining time: {remainingTime}</div>
		<div>Eaten food: {eatenFoodCount}</div>
	</div>
);
