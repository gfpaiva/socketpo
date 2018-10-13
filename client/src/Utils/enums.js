const statusValues = {
	0: 'Stand By',
	1: 'In progress',
	2: 'Fished'
};

const playValues = {
	1: 'Rock',
	2: 'Paper',
	3: 'Scissors'
}

export const parseStatus = statusNum => statusValues[statusNum];
export const parsePlay = playNum => playValues[playNum];
