import { generateRandom } from '../lib/utils/generate-random';
import type { Move } from './move.type';

export enum Play {
	None,
	One,
	Two,
	Three,
	Four,
	Five,
	Six
}

export function generateRandomMove(): Move {
	const getRandomPositivePlay = (): Play => {
		const values = [Play.One, Play.Two, Play.Three, Play.Four, Play.Five, Play.Six];
		const idx = generateRandom(values.length);
		return values.at(idx) as Play;
	};
	return [
		getRandomPositivePlay(),
		getRandomPositivePlay(),
		getRandomPositivePlay(),
		getRandomPositivePlay()
	];
}
