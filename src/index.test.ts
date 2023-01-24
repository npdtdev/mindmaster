import { describe, it, expect } from 'vitest';
import type { Move } from './types/move.type';
import type { MoveResult } from './types/move-result.type';
import { Play } from './types/play.enum';
import { getResultFromMove } from './lib/game';
import { PlayResult } from './types/play-result.enum';

describe('Game tests', () => {
	it('tells a win with complete match of one color', () => {
		const targetMove: Move = [Play.One, Play.One, Play.One, Play.One];
		const move: Move = [Play.One, Play.One, Play.One, Play.One];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Position
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells a win with complete match of different colors', () => {
		const targetMove: Move = [Play.One, Play.One, Play.One, Play.Two];
		const move: Move = [Play.One, Play.One, Play.One, Play.Two];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Position
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells not a win with input lacking Play', () => {
		const targetMove: Move = [Play.One, Play.One, Play.One, Play.None];
		const move: Move = [Play.One, Play.One, Play.One, Play.None];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.None
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells correct number of positions without other colors', () => {
		const targetMove: Move = [Play.One, Play.Two, Play.Three, Play.Four];
		const move: Move = [Play.One, Play.Two, Play.Five, Play.Five];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.None,
			PlayResult.None
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells correct number of positions with one other color', () => {
		const targetMove: Move = [Play.One, Play.Two, Play.Three, Play.Four];
		const move: Move = [Play.One, Play.Two, Play.Five, Play.Three];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.None,
			PlayResult.Color
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells correct number of positions with two other colors', () => {
		const targetMove: Move = [Play.One, Play.Two, Play.Three, Play.Four];
		const move: Move = [Play.One, Play.Two, Play.Four, Play.Three];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Color,
			PlayResult.Color
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells correct number of positions with another of same color', () => {
		const targetMove: Move = [Play.One, Play.Two, Play.Three, Play.Three];
		const move: Move = [Play.One, Play.Four, Play.Two, Play.Four];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.None,
			PlayResult.None,
			PlayResult.Color
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells correct number of positions with repeated color and in another place', () => {
		const targetMove: Move = [Play.One, Play.Two, Play.Two, Play.One];
		const move: Move = [Play.One, Play.One, Play.Three, Play.Three];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.None,
			PlayResult.None,
			PlayResult.Color
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells correct number of positions with repeated colors everywhere', () => {
		const targetMove: Move = [Play.One, Play.Two, Play.Three, Play.One];
		const move: Move = [Play.One, Play.Two, Play.One, Play.Three];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Color,
			PlayResult.Color
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
	it('tells correct number of positions with repeated', () => {
		const targetMove: Move = [Play.One, Play.Two, Play.Three, Play.One];
		const move: Move = [Play.One, Play.Two, Play.One, Play.One];
		const result: MoveResult = [
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.Position,
			PlayResult.None
		];
		expect(getResultFromMove(targetMove, move).sort()).toStrictEqual(result.sort());
	});
});
