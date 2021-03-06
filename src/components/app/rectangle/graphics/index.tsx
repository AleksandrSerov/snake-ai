/* eslint-disable react/display-name */
import { FC, memo, useCallback } from 'react';
import { Graphics as PixiGraphics } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

import { RectangleProps } from '..';

export const Graphics: FC<RectangleProps> = memo(
	({ x, y, width, height, color, onClick, onMouseOver, onPointerDown }) => {
		const draw = useCallback(
			(g: PIXI.Graphics) => {
				g.clear();
				g.removeAllListeners();
				g.interactive = true;
				if (onMouseOver) {
					g.on('mouseover', onMouseOver);
				}
				if (onPointerDown) {
					g.on('pointerdown', onPointerDown);
				}
				if (onClick) {
					g.on('click', onClick);
				}
				g.beginFill(string2hex(color));
				g.drawRect(x, y, width, height);
				g.endFill();
			},
			[color, height, onClick, onMouseOver, onPointerDown, width, x, y],
		);

		return <PixiGraphics x={ 0 } y={ 0 } draw={ draw } />;
	},
);
