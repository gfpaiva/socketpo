module.exports = {
	gameNotFound: (argValue, argTitle = 'hash') => {
		throw new Error(`Game with ${argTitle}: ${argValue} not found!`);
	},
	playerNotFound: (argValue, argTitle = 'id') => {
		throw new Error(`Player with ${argTitle}: ${argValue} not found!`);
	},
};
