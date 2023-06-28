import { Play, type Move } from '$types';
import { generateRandom } from './generate-random';

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
