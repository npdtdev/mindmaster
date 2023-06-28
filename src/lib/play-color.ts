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
		color: '#cbc7d1',
		selected_color: '#a4a0a8',
		play: Play.None
	},
	one: {
		color: '#db1a47',
		selected_color: '#b5163b',
		play: Play.One
	},
	two: {
		color: '#20d629',
		selected_color: '#13ad1b',
		play: Play.Two
	},
	three: {
		color: '#ffe119',
		selected_color: '#d4bb13',
		play: Play.Three
	},
	four: {
		color: '#22aff5',
		selected_color: '#1b91cc',
		play: Play.Four
	},
	five: {
		color: '#EE6300',
		selected_color: '#d15b06',

		play: Play.Five
	},
	six: {
		color: '#f032e6',
		selected_color: '#cf29c6',
		play: Play.Six
	}
};
