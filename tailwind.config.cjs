/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		logs: false,
		themes: [
			{
				mytheme: {
					primary: '#bd93f9',

					secondary: '#ff79c6',

					accent: '#6272a4',

					neutral: '#161a1d',

					'base-100': '#282a36',

					info: '#73afe8',

					success: '#50fa7b',

					warning: '#ffb86c',

					error: '#eb2d3a'
				}
			}
		]
	}
};
