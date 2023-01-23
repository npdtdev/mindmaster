import { PlayResult } from '../types/play-result.enum';
import { GameResult } from '../types/game-result.enum';
import type { Move } from '../types/move.type';
import { generateRandomMove, Play } from '../types/play.enum';
import { derived, writable, readable, get } from 'svelte/store';
import type { MoveResult } from '../types/move-result.type';
import { arrayEquals } from './utils/array-equals';

export function createGame(t = 12, gameId: string) {
	const targetResultStore = readable<Move>(generateRandomMove());
	const turns = t;
	const id = gameId;
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
			if ($currentTurnStore != turns) {
				if (arrayEquals($boardStore.at($currentTurnStore - 1) ?? [], $targetResultStore)) {
					return GameResult.Won;
				} else {
					return GameResult.Playing;
				}
			}
			return GameResult.Lost;
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
		// var
		turns,
		id
	};
}

const getResultFromMove = (targetResult: Move, move: Move): MoveResult => {
	return move.map((el, i) => {
		if (el == targetResult.at(i)) {
			return PlayResult.Position;
		}
		if (targetResult.some((v) => v == el)) {
			return PlayResult.Color;
		}
		return PlayResult.None;
	}) as MoveResult;
};
