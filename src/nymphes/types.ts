type _Range<
	N extends number,
	Acc extends number[] = []
> = Acc['length'] extends N ? Acc[number] : _Range<N, [...Acc, Acc['length']]>;

export type MidiValue = _Range<128>;

export enum ModSource {
	LFO_2 = 0,
	MOD_WHEEL = 1,
	VELOCITY = 2,
	AFTERTOUCH = 3,
}

export enum Toggle {
	OFF = 0,
	ON = 1,
}

export enum LfoType {
	BPM = 0,
	LOW = 1,
	HIGH = 2,
	TRACK = 3,
}

export enum PlayMode {
	POLY = 0,
	UNI_A = 1,
	UNI_B = 2,
	TRI = 3,
	DUO = 4,
	MONO = 5,
}

export interface Envelope {
	readonly attack: MidiValue;
	readonly delay: MidiValue;
	readonly sustain: MidiValue;
	readonly release: MidiValue;
}

export interface EnvelopeModulation {
	readonly attackDepth: MidiValue;
	readonly delayDepth: MidiValue;
	readonly sustainDepth: MidiValue;
	readonly releaseDepth: MidiValue;
}

export interface Lfo {
	readonly delay: MidiValue;
	readonly fade: MidiValue;
	readonly keySync: Toggle;
	readonly rate: MidiValue;
	readonly type: LfoType;
	readonly wave: MidiValue;
}

export interface LfoModulation {
	readonly delayDepth: MidiValue;
	readonly fadeDepth: MidiValue;
	readonly rateDepth: MidiValue;
	readonly waveDepth: MidiValue;
}

export interface Modulation {
	readonly oscWaveDepth: MidiValue;
	readonly oscLevelDepth: MidiValue;
	readonly subLevelDepth: MidiValue;
	readonly noiseLevelDepth: MidiValue;
	readonly lfoPitchDepthDepth: MidiValue;
	readonly pulseWidthDepth: MidiValue;
	readonly glideDepth: MidiValue;
	readonly detuneDepth: MidiValue;
	readonly chordSelectorDepth: MidiValue;
	readonly egPitchDepthDepth: MidiValue;
	readonly lfoCutoffDepth: MidiValue;
	readonly resonanceDepth: MidiValue;
	readonly lpfEgDepthDepth: MidiValue;
	readonly hpfCutoffDepth: MidiValue;
	readonly lfpTrackingDepth: MidiValue;
	readonly lfoCutoffLfoDepthDepth: MidiValue;

	readonly filterEgModulation: EnvelopeModulation;
	readonly filterAmpModulation: EnvelopeModulation;
	readonly lfo1Modulation: LfoModulation;
	readonly lfo2Modulation: LfoModulation;

	readonly reverbSizeDepth: MidiValue;
	readonly reverbDecayDepth: MidiValue;
	readonly reverbFilterDepth: MidiValue;
	readonly reverbMixDepth: MidiValue;
}

export interface Parameters {
	readonly modWheel: MidiValue;

	readonly lpfEgDepth: MidiValue;
	readonly lpfTracking: MidiValue;
	readonly glide: MidiValue;
	readonly ampLevel: MidiValue;
	readonly lfoCutoffDepth: MidiValue;

	readonly oscLevel: MidiValue;
	readonly subLevel: MidiValue;
	readonly noiseLevel: MidiValue;
	readonly pulseWidth: MidiValue;
	readonly lfoPitchDepth: MidiValue;
	readonly egPitchDepth: MidiValue;
	readonly detune: MidiValue;
	readonly chordSelector: MidiValue;
	readonly playMode: PlayMode;

	readonly lfo1: Lfo;
	readonly lfo2: Lfo;

	readonly lfo2Modulation: Modulation;
	readonly modWheelModulation: Modulation;
	readonly velocityModulation: Modulation;
	readonly aftertouchModuler: Modulation;

	readonly sustainPedal: Toggle;
	readonly legato: Toggle;
	readonly oscWave: MidiValue;
	readonly resonance: MidiValue;

	readonly ampEgEnvelope: Envelope;
	readonly filterEgEnvelope: Envelope;

	readonly lfpCutoff: MidiValue;
	readonly reverbSize: MidiValue;
	readonly reverbDecay: MidiValue;
	readonly reverbFilter: MidiValue;
	readonly reverbMix: MidiValue;
	readonly hpfCutoff: MidiValue;
}
