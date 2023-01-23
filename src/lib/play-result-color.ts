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
		color: '#',
		boardResult: PlayResult.None
	},
	color: {
		color: '#0A2463',
		boardResult: PlayResult.Color
	},
	position: {
		color: '#FB3640',
		boardResult: PlayResult.Position
	}
};
