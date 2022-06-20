import React from 'react';
import ReactDOM from 'react-dom';
import Stats from 'stats.js';

import { App } from './app';

import './global.module.css';

const initStats = () => {
	const stats = new Stats();

	stats.showPanel(0);
	console.log(stats.dom);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	stats.dom.style =
		'position: fixed; top: 0px; right: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;';
	document.body.appendChild(stats.dom);

	const animate = () => {
		stats.begin();

		// monitored code goes here

		stats.end();

		requestAnimationFrame(animate);
	};

	requestAnimationFrame(animate);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
process.env.NODE_ENV !== 'production' && initStats();

const root = document.getElementById('app');

ReactDOM.render(<App />, root);
