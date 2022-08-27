type _Range<
	N extends number,
	Acc extends number[] = []
> = Acc['length'] extends N ? Acc[number] : _Range<N, [...Acc, Acc['length']]>;

export type MidiValue = _Range<128>;

export namespace ModSource {
	export const LFO_2 = 0;
	export const MOD_WHEEL = 1;
	export const VELOCITY = 2;
	export const AFTERTOUCH = 3;
}
export type ModSource = typeof ModSource[keyof typeof ModSource];

export namespace Toggle {
	export const OFF = 0;
	export const ON = 1;
}
export type Toggle = typeof Toggle[keyof typeof Toggle];

export namespace LfoType {
	export const BPM = 0;
	export const LOW = 1;
	export const HIGH = 2;
	export const TRACK = 3;
}
export type LfoType = typeof LfoType[keyof typeof LfoType];

export namespace PlayMode {
	export const POLY = 0;
	export const UNI_A = 1;
	export const UNI_B = 2;
	export const TRI = 3;
	export const DUO = 4;
	export const MONO = 5;
}
export type PlayMode = typeof PlayMode[keyof typeof PlayMode];

export interface Envelope {
	readonly attack: MidiValue;
	readonly decay: MidiValue;
	readonly sustain: MidiValue;
	readonly release: MidiValue;
}

export interface EnvelopeModulation {
	readonly attackDepth: MidiValue;
	readonly decayDepth: MidiValue;
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
	readonly aftertouchModulation: Modulation;

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
