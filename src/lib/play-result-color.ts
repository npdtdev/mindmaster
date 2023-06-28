import { PlayResult } from '../types/play-result.enum';

interface IPlayResultColor {
	color: string;
	boardResult: PlayResult;
}

export const playResultColor: {
	none: IPlayResultColor;
	color: IPlayResultColor;
	position: IPlayResultColor;
} = {
	none: {
		color: '#fff',
		boardResult: PlayResult.None
	},
	color: {
		color: '#0e50f0',
		boardResult: PlayResult.Color
	},
	position: {
		color: '#FB3640',
		boardResult: PlayResult.Position
	}
};
