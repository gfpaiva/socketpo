export const fakePlayer = (rewrite) => ({
	__typename: 'Player',
	avatar: 3,
	id: 'player01',
	name: 'Player 01',
	ready: false,
	roundsWin: 0,
	...rewrite
});

export const fakeGame = (fullPlayers = true) => {

	const players = fullPlayers ? [fakePlayer(), fakePlayer({ id: 'player02', name: 'Player 02' })] : [fakePlayer()]

	return {
		__typename: 'Game',
		hash: 'game01',
		name: 'Game 01',
		players,
		results: {
			__typename: "Result",
			matchWinner: null,
			message: null,
			rounds: []
		},
		status: 0
	};
};
