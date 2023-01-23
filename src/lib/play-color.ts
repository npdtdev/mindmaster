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
		color: '#729EA1',
		selected_color: '#729EA1',
		play: Play.None
	},
	one: {
		color: '#729EA1',
		selected_color: '#729EA1',
		play: Play.One
	},
	two: {
		color: '#474448',
		selected_color: '#474448',
		play: Play.Two
	},
	three: {
		color: '#EC9192',
		selected_color: '#EC9192',
		play: Play.Three
	},
	four: {
		color: '#DFBE99',
		selected_color: '#DFBE99',
		play: Play.Four
	},
	five: {
		color: '#B5BD89',
		selected_color: '#B5BD89',

		play: Play.Five
	},
	six: {
		color: '#DB5375',
		selected_color: '#DB5375',
		play: Play.Six
	}
};
