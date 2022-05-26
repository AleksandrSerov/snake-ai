import { useEffect, useRef, useState, VFC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type Props = {
	canvasWidth: number;
	playState: 'iddle' | 'playing';
	canvasHeight: number;
	className?: string;
	eatenFoodCount: number;
};

export const Stats: VFC<Props> = ({
	canvasWidth,
	canvasHeight,
	className,
	eatenFoodCount,
	playState,
}) => {
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const birthTimeRef = useRef<number | null>(null);
	const [lifeSpan, setLifeSpan] = useState(0);
	const [scores, setScores] = useState(0);

	const handleTick = () => {
		const newlifeSpan =
			birthTimeRef.current === null ? 0 : (Date.now() - birthTimeRef.current) / 1000;

		setLifeSpan(newlifeSpan);
	};

	useEffect(() => {
		const newScores = Math.pow(lifeSpan, 0.5) + eatenFoodCount * 10;

		setScores(newScores);
	}, [eatenFoodCount, lifeSpan]);

	useEffect(() => {
		if (playState === 'playing') {
			birthTimeRef.current = Date.now();
			setScores(0);
			timerRef.current = setInterval(handleTick, 16);
		}
		if (playState === 'iddle') {
			birthTimeRef.current = null;

			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}
	}, [playState]);

	return (
		<div className={ cn(styles.stats, className) }>
			<div>
				{canvasWidth}px X {canvasHeight}px
			</div>
			<div>Scores: {scores.toFixed(2)}</div>
			<div>Life time: {lifeSpan.toFixed(2)}</div>
			<div>Eaten food: {eatenFoodCount}</div>
		</div>
	);
};