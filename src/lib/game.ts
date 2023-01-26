import { PlayResult } from '../types/play-result.enum';
import { GameResult } from '../types/game-result.enum';
import type { Move } from '../types/move.type';
import { generateRandomMove, Play } from '../types/play.enum';
import { derived, writable, readable, get } from 'svelte/store';
import type { MoveResult } from '../types/move-result.type';
import { arrayEquals } from './utils/array-equals';
import { useId } from '@svelteuidev/composables';

export function createGame(t = 12) {
	const targetResultStore = readable<Move>(generateRandomMove());
	const turns = t;
	let id = useId();
	const boardStore = writable<Array<Move>>(
		Array(turns).fill([Play.None, Play.None, Play.None, Play.None])
	);
	const currentTurnStore = writable<number>(0);
	const playResultStore = derived(
		[targetResultStore, boardStore],
		([$targetResultStore, $boardStore]) => {
			return $boardStore.map((m) => getResultFromMove($targetResultStore, m));
		}
	);
	const currentMoveStore = writable<Move>([Play.None, Play.None, Play.None, Play.None]);
	const gameResultStore = derived(
		[targetResultStore, boardStore, currentTurnStore],
		([$targetResultStore, $boardStore, $currentTurnStore]) => {
			if (arrayEquals($boardStore.at($currentTurnStore - 1) ?? [], $targetResultStore)) {
				return GameResult.Won;
			} else {
				if ($currentTurnStore == turns) {
					return GameResult.Lost;
				}
				return GameResult.Playing;
			}
		},
		GameResult.Playing
	);

	// actions
	const setMove = (idx: number, play: Play) => {
		currentMoveStore.update((val) => {
			const res: Move = Object.assign([], val);
			res[idx] = play;
			return res;
		});
	};
	currentMoveStore.subscribe((v) => {
		const t = get(currentTurnStore);
		if (t == turns) return;
		boardStore.update((val) => {
			const res: Array<Move> = Object.assign([], val);
			res[t] = v;
			return res;
		});
	});

	const nextTurn = (): boolean => {
		if (get(currentMoveStore).some((el) => el == Play.None)) {
			return false;
		}
		currentTurnStore.update((val) => {
			const nextTurn = val + 1;
			return nextTurn;
		});
		currentMoveStore.update((val) => {
			const res: Move = Object.assign([], val);
			return res;
		});
		return true;
	};
	const reset = () => {
		id = useId();
		boardStore.set(Array(turns).fill([Play.None, Play.None, Play.None, Play.None]));
		currentTurnStore.set(0);
		currentMoveStore.set([Play.None, Play.None, Play.None, Play.None]);
                targetResultStore.set(generateRandomMove());
	};

	return {
		// stores
		targetResultStore,
		boardStore,
		currentTurnStore,
		currentMoveStore,
		playResultStore,
		gameResultStore,
		// actions
		setMove,
		nextTurn,
		reset,
		// var
		turns,
		id
	};
}

export const getResultFromMove = (targetResult: Move, move: Move): MoveResult => {
	const tmp: Array<Play> = Object.assign([], targetResult);
	const res: MoveResult = [PlayResult.None, PlayResult.None, PlayResult.None, PlayResult.None];
	let idx = 0;
	// check for strict position and color equal correct, remove option from copy target result.
	const restMoves = move.map((m, i) => {
		// At position and color check
		if (m == tmp.at(i) && tmp.at(i) != Play.None && m != Play.None) {
			// Save and then increment index
			res[idx++] = PlayResult.Position;
			// remove from copy target
			tmp[i] = Play.None;
			return Play.None;
		}
		return m;
	});
	// check for color match where results for position where remove, remove first where found from target result
	restMoves.forEach((m) => {
		if (m == Play.None) {
			return;
		}
		// get index of first match
		const elIdx = tmp.indexOf(m);
		if (elIdx != -1) {
			res[idx++] = PlayResult.Color;
			tmp[elIdx] = Play.None;
		}
	});

	return res.sort();
};
