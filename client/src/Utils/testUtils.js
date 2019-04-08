export const fakePlayer = (rewrite) => ({
	__typename: 'Player',
	avatar: 3,
	id: 'player01',
	name: 'Player 01',
	ready: false,
	roundsWin: 0,
	...rewrite
});

export const fakeGame = (fullPlayers = true, matchWinner = null, rounds = [], rewrite) => {

	const players = fullPlayers ? [fakePlayer(), fakePlayer({ id: 'player02', name: 'Player 02' })] : [fakePlayer()]

	return {
		__typename: 'Game',
		id: 'game01',
		hash: 'game01',
		name: 'Game 01',
		players,
		results: {
			__typename: "Result",
			matchWinner,
			message: null,
			rounds
		},
		status: 0,
		...rewrite
	};
};

export const fakeRound = (rewrite) => ({
	__typename: 'Round',
	isDraw: false,
	finished: true,
	plays: [
		fakePlay({ play: 1 }),
		fakePlay({ player: fakePlayer({ id: 'player02', name: 'Player 02' }), play: 3 })
	],
	winner: fakePlayer(),
	...rewrite
});

export const fakePlay = (rewrite) => ({
	__typename: 'Play',
	player: fakePlayer(),
	play: 0,
	...rewrite
});
