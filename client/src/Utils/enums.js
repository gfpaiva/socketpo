import React from 'react';
import Avatar from 'avataaars';

import {
	Rock,
	Paper,
	Scissors,
} from '../Components/Icons/Icons';

const statusValues = {
	0: 'Stand By',
	1: 'In progress',
	2: 'Finished'
};

const playValues = {
	0: 'Miss Play',
	1: 'Rock',
	2: 'Paper',
	3: 'Scissors'
};

const playIcons = {
	1: <Rock />,
	2: <Paper />,
	3: <Scissors />
}

const avatarValues = {
	1: <Avatar
		topType='LongHairMiaWallace'
		accessoriesType='Prescription02'
		hairColor='BrownDark'
		facialHairType='Blank'
		clotheType='Hoodie'
		clotheColor='PastelBlue'
		eyeType='Happy'
		eyebrowType='Default'
		mouthType='Smile'
		skinColor='Light'
	/>,
	2: <Avatar
		topType='LongHairBigHair'
		accessoriesType='Blank'
		hairColor='Blonde'
		facialHairType='Blank'
		clotheType='ShirtVNeck'
		clotheColor='PastelYellow'
		eyeType='Wink'
		eyebrowType='RaisedExcitedNatural'
		mouthType='Serious'
		skinColor='DarkBrown'
	/>,
	3: <Avatar
		topType='ShortHairShortFlat'
		accessoriesType='Prescription01'
		hairColor='Blonde'
		facialHairType='Blank'
		clotheType='BlazerSweater'
		eyeType='Default'
		eyebrowType='DefaultNatural'
		mouthType='Serious'
		skinColor='Pale'
	/>,
	4: <Avatar
		topType='ShortHairShortWaved'
		accessoriesType='Blank'
		hairColor='Auburn'
		facialHairType='BeardLight'
		facialHairColor='Red'
		clotheType='BlazerShirt'
		clotheColor='Gray01'
		eyeType='WinkWacky'
		eyebrowType='UnibrowNatural'
		mouthType='Grimace'
		skinColor='DarkBrown'
	/>,
};

export const parseStatus = statusNum => statusValues[statusNum];
export const parsePlay = playNum => playValues[playNum];
export const parsePlayIcons = playNum => playIcons[playNum];
export const parseAvatar = avatarNum => avatarValues[avatarNum];
