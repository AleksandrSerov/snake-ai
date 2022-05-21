import ReactDOM from 'react-dom';
import Stats from 'stats.js';

import { App } from './app';

import './index.module.css';

const initStats = () => {
	const stats = new Stats();

	stats.showPanel(0);
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
