const statusValues = {
	0: 'Stand By',
	1: 'In progress',
	2: 'Fished'
};

export const status = statusNum => statusValues[statusNum];
