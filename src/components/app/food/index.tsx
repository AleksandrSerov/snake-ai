import React from 'react';

import { Rectangle } from '../rectangle';

export type Point = [number, number];

type Props = {
	point: Point;
	dotSize: number;
};

const redColorCode = '#FF0000';

export const Food: React.FC<Props> = ({ point, dotSize }) => {
	const [i, j] = point;

	return (
		<Rectangle.Graphics
			key={ `${i}_${j}` }
			x={ j * dotSize }
			y={ i * dotSize }
			width={ dotSize }
			height={ dotSize }
			color={ redColorCode }
		/>
	);
};
