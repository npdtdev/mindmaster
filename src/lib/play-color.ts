import { Play } from '../types/play.enum';

interface IPlay {
	color: string;
	play: Play;
	selected_color: string;
}

export const playColor: {
	none: IPlay;
	one: IPlay;
	two: IPlay;
	three: IPlay;
	four: IPlay;
	five: IPlay;
	six: IPlay;
} = {
	none: {
		color: '#BFBDC1',
		selected_color: '#6D6A75',
		play: Play.None
	},
	one: {
		color: '#AE002B',
		selected_color: '#75001D',
		play: Play.One
	},
	two: {
		color: '#3cb44b',
		selected_color: '#2B7F36',
		play: Play.Two
	},
	three: {
		color: '#ffe119',
		selected_color: '#AE9A1A',
		play: Play.Three
	},
	four: {
		color: '#0E39D3',
		selected_color: '#0C2993',
		play: Play.Four
	},
	five: {
		color: '#EE6300',
		selected_color: '#B54C01',

		play: Play.Five
	},
	six: {
		color: '#f032e6',
		selected_color: '#A929A2',
		play: Play.Six
	}
};
