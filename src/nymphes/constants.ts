export const CC_MIDI_COMMAND = 0xb0;

export const CC_NAME: { readonly [key: number]: { readonly name: string } } = {
	1: {
		name: 'Mod Wheel',
	},
	3: {
		name: 'LPF EG depth',
	},
	4: {
		name: 'LPF Tracking',
	},
	5: {
		name: 'Glide',
	},
	7: {
		name: 'AMP level',
	},
	8: {
		name: 'LFO Cutoff Depth',
	},
	9: {
		name: 'OSC level',
	},
	10: {
		name: 'Sub level',
	},
	11: {
		name: 'Noise level',
	},
	12: {
		name: 'Pulse width',
	},
	13: {
		name: 'LFO Pitch Depth',
	},
	14: {
		name: 'EG Pitch Depth',
	},
	15: {
		name: 'Detune',
	},
	16: {
		name: 'Chord Selector',
	},
	17: {
		name: 'Play Mode',
	},
	18: {
		name: 'LFO 1 Rate',
	},
	19: {
		name: 'LFO 1 Wave',
	},
	20: {
		name: 'LFO 1 Delay',
	},
	21: {
		name: 'LFO 1 Fade',
	},
	22: {
		name: 'LFO 1 Type',
	},
	23: {
		name: 'LFO 1 Key Sync',
	},
	24: {
		name: 'LFO 2 Rate',
	},
	25: {
		name: 'LFO 2 Wave',
	},
	26: {
		name: 'LFO 2 Delay',
	},
	27: {
		name: 'LFO 2 Fade',
	},
	28: {
		name: 'LFO 2 Type',
	},
	29: {
		name: 'LFO 2 Key Sync',
	},
	30: {
		name: 'Mod Source Selector',
	},
	31: {
		name: 'Mod Source OSC Wave Depth',
	},
	32: {
		name: 'Mod Source OSC Level Depth',
	},
	33: {
		name: 'Mod Source Sub Level Depth',
	},
	34: {
		name: 'Mod Source Noise Level Depth',
	},
	35: {
		name: 'Mod Source LFO Pitch Depth Depth',
	},
	36: {
		name: 'Mod Source PulseWidth Depth',
	},
	37: {
		name: 'Mod Source Glide Depth',
	},
	39: {
		name: 'Mod Source Detune Depth',
	},
	40: {
		name: 'Mod Source Chord Selector Depth',
	},
	41: {
		name: 'Mod Source EG Pitch Depth Depth',
	},
	42: {
		name: 'Mod Source LPF Cutoff Depth',
	},
	43: {
		name: 'Mod Source Resonance Depth',
	},
	44: {
		name: 'Mod Source LPF EG Depth Depth',
	},
	45: {
		name: 'Mod Source HPF Cutoff Depth',
	},
	46: {
		name: 'Mod Source LPF Tracking Depth',
	},
	47: {
		name: 'Mod Source LPF Cutoff LFO Depth Depth',
	},
	48: {
		name: 'Mod Source Filter EG Attack Depth',
	},
	49: {
		name: 'Mod Source Filter EG Decay Depth',
	},
	50: {
		name: 'Mod Source Filter EG Sustain Depth',
	},
	51: {
		name: 'Mod Source Filter EG Release Depth',
	},
	52: {
		name: 'Mod Source Filter AMP Attack Depth',
	},
	53: {
		name: 'Mod Source Filter AMP Decay Depth',
	},
	54: {
		name: 'Mod Source Filter AMP Sustain Depth',
	},
	55: {
		name: 'Mod Source Filter AMP Release Depth',
	},
	56: {
		name: 'Mod Source LFO 1 Rate Depth',
	},
	57: {
		name: 'Mod Source LFO 1 Wave Depth',
	},
	58: {
		name: 'Mod Source LFO 1 Delay Depth',
	},
	59: {
		name: 'Mod Source LFO 1 Fade Depth',
	},
	60: {
		name: 'Mod Source LFO 2 Rate Depth',
	},
	61: {
		name: 'Mod Source LFO 2 Wave Depth',
	},
	62: {
		name: 'Mod Source LFO 2 Delay Depth',
	},
	63: {
		name: 'Mod Source LFO 2 Fade Depth',
	},
	86: {
		name: 'Mod Source Reverb Size Depth',
	},
	87: {
		name: 'Mod Source Reverb Decay Depth',
	},
	88: {
		name: 'Mod Source Reverb Filter Depth',
	},
	89: {
		name: 'Mod Source Reverb Mix Depth',
	},
	64: {
		name: 'Sustain Pedal',
	},
	68: {
		name: 'legato',
	},
	70: {
		name: 'OSC Wave',
	},
	71: {
		name: 'Resonance',
	},
	72: {
		name: 'AMP EG Release',
	},
	73: {
		name: 'AMP EG Attack',
	},
	74: {
		name: 'LPF Cutoff',
	},
	75: {
		name: 'Reverb Size',
	},
	76: {
		name: 'Reverb Decay',
	},
	77: {
		name: 'Reverb Filter',
	},
	78: {
		name: 'Reverb Mix',
	},
	79: {
		name: 'Filter EG Attack',
	},
	80: {
		name: 'Filter EG Decay',
	},
	81: {
		name: 'HPF Cutoff',
	},
	82: {
		name: 'Filter EG Sustain',
	},
	83: {
		name: 'Filter EG Release',
	},
	84: {
		name: 'AMP EG Decay',
	},
	85: {
		name: 'AMP EG Sustain',
	},
} as const;
