import { Observable, debounceTime, scan, startWith } from 'rxjs';

import { assertExists, assertNever } from './asserts';
import {
	castLfoType,
	castModSource,
	castPlayMode,
	castToggle,
} from './nymphes/asserts';
import { CcNumber, EMPTY_PATCH } from './nymphes/constants';
import {
	Envelope,
	EnvelopeModulation,
	Lfo,
	LfoModulation,
	ModSource,
	Modulation,
	Parameters,
} from './nymphes/types';
import { ccValue$ } from './nymphes/webmidi';

type KeysWithValueTypes<T, V> = {
	[Prop in keyof T]: T[Prop] extends V ? Prop : never;
}[keyof T];

type ParameterKey = keyof Parameters;
type ParameterValue<Type extends ParameterKey> = Parameters[Type];

type EnvelopeParameterKey = KeysWithValueTypes<Parameters, Envelope>;
type EnvelopeKey = keyof Envelope;
type EnvelopeValue<T extends EnvelopeKey> = Envelope[T];

type LfoParameterKey = KeysWithValueTypes<Parameters, Lfo>;
type LfoKey = keyof Lfo;
type LfoValue<T extends LfoKey> = Lfo[T];

type ModulationParameterKey = KeysWithValueTypes<Parameters, Modulation>;
type ModulationKey = keyof Modulation;
type ModulationValue<T extends ModulationKey> = Modulation[T];

type EnvelopeModulationModulationKey = KeysWithValueTypes<
	Modulation,
	EnvelopeModulation
>;
type EnvelopeModulationKey = keyof EnvelopeModulation;
type EnvelopeModulationValue<T extends EnvelopeModulationKey> =
	EnvelopeModulation[T];

type LfoModulationModulationKey = KeysWithValueTypes<Modulation, LfoModulation>;
type LfoModulationKey = keyof LfoModulation;
type LfoModulationValue<T extends LfoModulationKey> = LfoModulation[T];

interface State {
	readonly patch: Parameters;
	readonly selectedModulator: ModSource | undefined;
}

const INIT_STATE: State = {
	patch: EMPTY_PATCH,
	selectedModulator: undefined,
} as const;

const state$: Observable<State> = ccValue$.pipe(
	startWith(undefined),
	scan((state, input) => {
		if (!input) {
			return INIT_STATE;
		}
		const { ccNum, ccVal } = input;

		const setTopLevelPatchValue = <T extends ParameterKey>(
			key: T,
			value: ParameterValue<T>
		) =>
			({
				...state,
				patch: {
					...state.patch,
					[key]: value,
				},
			} as State);

		type SetTopLevelPatchObjectValue = {
			<T extends EnvelopeKey>(
				patchKey: EnvelopeParameterKey,
				key: T,
				value: EnvelopeValue<T>
			): State;
			<T extends LfoKey>(
				patchKey: LfoParameterKey,
				key: T,
				value: LfoValue<T>
			): State;
			<T extends ModulationKey>(
				patchKey: ModulationParameterKey,
				key: T,
				value: ModulationValue<T>
			): State;
		};
		const setTopLevelPatchObjectValue: SetTopLevelPatchObjectValue = <
			E extends EnvelopeKey,
			L extends LfoKey,
			M extends ModulationKey
		>(
			patchKey: EnvelopeParameterKey | LfoParameterKey | ModulationParameterKey,
			key: E | L | M,
			value: EnvelopeValue<E> | LfoValue<L> | ModulationValue<M>
		) =>
			setTopLevelPatchValue(patchKey, {
				...state.patch[patchKey],
				[key]: value,
			});

		const setModulationSourceValue = <T extends ModulationKey>(
			key: T,
			value: ModulationValue<T>
		) => {
			const mod = state.selectedModulator;
			assertExists(mod);
			switch (mod) {
				case ModSource.AFTERTOUCH:
					return setTopLevelPatchObjectValue(
						'aftertouchModulation',
						key,
						value
					);
				case ModSource.LFO_2:
					return setTopLevelPatchObjectValue('lfo2Modulation', key, value);
				case ModSource.MOD_WHEEL:
					return setTopLevelPatchObjectValue('modWheelModulation', key, value);
				case ModSource.VELOCITY:
					return setTopLevelPatchObjectValue('velocityModulation', key, value);
			}
			assertNever(mod);
		};

		const getCurrentModulationSourceValue = () => {
			const mod = state.selectedModulator;
			assertExists(mod);
			switch (mod) {
				case ModSource.AFTERTOUCH:
					return state.patch.aftertouchModulation;
				case ModSource.LFO_2:
					return state.patch.lfo2Modulation;
				case ModSource.MOD_WHEEL:
					return state.patch.modWheelModulation;
				case ModSource.VELOCITY:
					return state.patch.velocityModulation;
			}
			assertNever(mod);
		};

		type SetModulationSourceObjectValue = {
			<T extends EnvelopeModulationKey>(
				patchKey: EnvelopeModulationModulationKey,
				key: T,
				value: EnvelopeModulationValue<T>
			): State;
			<T extends LfoModulationKey>(
				patchKey: LfoModulationModulationKey,
				key: T,
				value: LfoModulationValue<T>
			): State;
		};
		const setModulationSourceObjectValue: SetModulationSourceObjectValue = <
			E extends EnvelopeModulationKey,
			L extends LfoModulationKey
		>(
			modKey: EnvelopeModulationModulationKey | LfoModulationModulationKey,
			key: E | L,
			value: EnvelopeModulationValue<E> | LfoModulationValue<L>
		) =>
			setModulationSourceValue(modKey, {
				...getCurrentModulationSourceValue()[modKey],
				[key]: value,
			});

		switch (ccNum) {
			case CcNumber.MOD_WHEEL:
				return setTopLevelPatchValue('modWheel', ccVal);
			case CcNumber.LPF_EG_DEPTH:
				return setTopLevelPatchValue('lpfEgDepth', ccVal);
			case CcNumber.LPF_TRACKING:
				return setTopLevelPatchValue('lpfTracking', ccVal);
			case CcNumber.GLIDE:
				return setTopLevelPatchValue('glide', ccVal);
			case CcNumber.AMP_LEVEL:
				return setTopLevelPatchValue('ampLevel', ccVal);
			case CcNumber.LFO_CUTOFF_DEPTH:
				return setTopLevelPatchValue('lfoCutoffDepth', ccVal);
			case CcNumber.OSC_LEVEL:
				return setTopLevelPatchValue('oscLevel', ccVal);
			case CcNumber.SUB_LEVEL:
				return setTopLevelPatchValue('subLevel', ccVal);
			case CcNumber.NOISE_LEVEL:
				return setTopLevelPatchValue('noiseLevel', ccVal);
			case CcNumber.PULSE_WIDTH:
				return setTopLevelPatchValue('pulseWidth', ccVal);
			case CcNumber.LFO_PITCH_DEPTH:
				return setTopLevelPatchValue('lfoPitchDepth', ccVal);
			case CcNumber.EG_PITCH_DEPTH:
				return setTopLevelPatchValue('egPitchDepth', ccVal);
			case CcNumber.DETUNE:
				return setTopLevelPatchValue('detune', ccVal);
			case CcNumber.CHORD_SELECTOR:
				return setTopLevelPatchValue('chordSelector', ccVal);
			case CcNumber.PLAY_MODE:
				return setTopLevelPatchValue('playMode', castPlayMode(ccVal));
			case CcNumber.LFO_1_RATE:
				return setTopLevelPatchObjectValue('lfo1', 'rate', ccVal);
			case CcNumber.LFO_1_WAVE:
				return setTopLevelPatchObjectValue('lfo1', 'wave', ccVal);
			case CcNumber.LFO_1_DELAY:
				return setTopLevelPatchObjectValue('lfo1', 'delay', ccVal);
			case CcNumber.LFO_1_FADE:
				return setTopLevelPatchObjectValue('lfo1', 'fade', ccVal);
			case CcNumber.LFO_1_TYPE:
				return setTopLevelPatchObjectValue('lfo1', 'type', castLfoType(ccVal));
			case CcNumber.LFO_1_KEY_SYNC:
				return setTopLevelPatchObjectValue(
					'lfo1',
					'keySync',
					castToggle(ccVal)
				);
			case CcNumber.LFO_2_RATE:
				return setTopLevelPatchObjectValue('lfo2', 'rate', ccVal);
			case CcNumber.LFO_2_WAVE:
				return setTopLevelPatchObjectValue('lfo2', 'wave', ccVal);
			case CcNumber.LFO_2_DELAY:
				return setTopLevelPatchObjectValue('lfo2', 'delay', ccVal);
			case CcNumber.LFO_2_FADE:
				return setTopLevelPatchObjectValue('lfo2', 'fade', ccVal);
			case CcNumber.LFO_2_TYPE:
				return setTopLevelPatchObjectValue('lfo2', 'type', castLfoType(ccVal));
			case CcNumber.LFO_2_KEY_SYNC:
				return setTopLevelPatchObjectValue(
					'lfo2',
					'keySync',
					castToggle(ccVal)
				);
			case CcNumber.MOD_SOURCE_SELECTOR:
				return {
					...state,
					selectedModulator: castModSource(ccVal),
				} as State;
			case CcNumber.MOD_SOURCE_OSC_WAVE_DEPTH:
				return setModulationSourceValue('oscWaveDepth', ccVal);
			case CcNumber.MOD_SOURCE_OSC_LEVEL_DEPTH:
				return setModulationSourceValue('oscLevelDepth', ccVal);
			case CcNumber.MOD_SOURCE_SUB_LEVEL_DEPTH:
				return setModulationSourceValue('subLevelDepth', ccVal);
			case CcNumber.MOD_SOURCE_NOISE_LEVEL_DEPTH:
				return setModulationSourceValue('noiseLevelDepth', ccVal);
			case CcNumber.MOD_SOURCE_LFO_PITCH_DEPTH_DEPTH:
				return setModulationSourceValue('lfoPitchDepthDepth', ccVal);
			case CcNumber.MOD_SOURCE_PULSEWIDTH_DEPTH:
				return setModulationSourceValue('pulseWidthDepth', ccVal);
			case CcNumber.MOD_SOURCE_GLIDE_DEPTH:
				return setModulationSourceValue('glideDepth', ccVal);
			case CcNumber.MOD_SOURCE_DETUNE_DEPTH:
				return setModulationSourceValue('detuneDepth', ccVal);
			case CcNumber.MOD_SOURCE_CHORD_SELECTOR_DEPTH:
				return setModulationSourceValue('chordSelectorDepth', ccVal);
			case CcNumber.MOD_SOURCE_EG_PITCH_DEPTH_DEPTH:
				return setModulationSourceValue('egPitchDepthDepth', ccVal);
			case CcNumber.MOD_SOURCE_LPF_CUTOFF_DEPTH:
				return setModulationSourceValue('lfoCutoffDepth', ccVal);
			case CcNumber.MOD_SOURCE_RESONANCE_DEPTH:
				return setModulationSourceValue('resonanceDepth', ccVal);
			case CcNumber.MOD_SOURCE_LPF_EG_DEPTH_DEPTH:
				return setModulationSourceValue('lpfEgDepthDepth', ccVal);
			case CcNumber.MOD_SOURCE_HPF_CUTOFF_DEPTH:
				return setModulationSourceValue('hpfCutoffDepth', ccVal);
			case CcNumber.MOD_SOURCE_LPF_TRACKING_DEPTH:
				return setModulationSourceValue('lfpTrackingDepth', ccVal);
			case CcNumber.MOD_SOURCE_LPF_CUTOFF_LFO_DEPTH_DEPTH:
				return setModulationSourceValue('lfoCutoffLfoDepthDepth', ccVal);
			case CcNumber.MOD_SOURCE_FILTER_EG_ATTACK_DEPTH:
				return setModulationSourceObjectValue(
					'filterEgModulation',
					'attackDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_FILTER_EG_DECAY_DEPTH:
				return setModulationSourceObjectValue(
					'filterEgModulation',
					'decayDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_FILTER_EG_SUSTAIN_DEPTH:
				return setModulationSourceObjectValue(
					'filterEgModulation',
					'sustainDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_FILTER_EG_RELEASE_DEPTH:
				return setModulationSourceObjectValue(
					'filterEgModulation',
					'releaseDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_FILTER_AMP_ATTACK_DEPTH:
				return setModulationSourceObjectValue(
					'filterAmpModulation',
					'attackDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_FILTER_AMP_DECAY_DEPTH:
				return setModulationSourceObjectValue(
					'filterAmpModulation',
					'decayDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_FILTER_AMP_SUSTAIN_DEPTH:
				return setModulationSourceObjectValue(
					'filterAmpModulation',
					'sustainDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_FILTER_AMP_RELEASE_DEPTH:
				return setModulationSourceObjectValue(
					'filterAmpModulation',
					'releaseDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_1_RATE_DEPTH:
				return setModulationSourceObjectValue(
					'lfo1Modulation',
					'rateDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_1_WAVE_DEPTH:
				return setModulationSourceObjectValue(
					'lfo1Modulation',
					'waveDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_1_DELAY_DEPTH:
				return setModulationSourceObjectValue(
					'lfo1Modulation',
					'delayDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_1_FADE_DEPTH:
				return setModulationSourceObjectValue(
					'lfo1Modulation',
					'fadeDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_2_RATE_DEPTH:
				return setModulationSourceObjectValue(
					'lfo2Modulation',
					'rateDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_2_WAVE_DEPTH:
				return setModulationSourceObjectValue(
					'lfo2Modulation',
					'waveDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_2_DELAY_DEPTH:
				return setModulationSourceObjectValue(
					'lfo2Modulation',
					'delayDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_LFO_2_FADE_DEPTH:
				return setModulationSourceObjectValue(
					'lfo2Modulation',
					'fadeDepth',
					ccVal
				);
			case CcNumber.MOD_SOURCE_REVERB_SIZE_DEPTH:
				return setModulationSourceValue('reverbSizeDepth', ccVal);
			case CcNumber.MOD_SOURCE_REVERB_DECAY_DEPTH:
				return setModulationSourceValue('reverbDecayDepth', ccVal);
			case CcNumber.MOD_SOURCE_REVERB_FILTER_DEPTH:
				return setModulationSourceValue('reverbFilterDepth', ccVal);
			case CcNumber.MOD_SOURCE_REVERB_MIX_DEPTH:
				return setModulationSourceValue('reverbMixDepth', ccVal);
			case CcNumber.SUSTAIN_PEDAL:
				return setTopLevelPatchValue('sustainPedal', castToggle(ccVal));
			case CcNumber.LEGATO:
				return setTopLevelPatchValue('legato', castToggle(ccVal));
			case CcNumber.OSC_WAVE:
				return setTopLevelPatchValue('oscWave', ccVal);
			case CcNumber.RESONANCE:
				return setTopLevelPatchValue('resonance', ccVal);
			case CcNumber.AMP_EG_RELEASE:
				return setTopLevelPatchObjectValue('ampEgEnvelope', 'release', ccVal);
			case CcNumber.AMP_EG_ATTACK:
				return setTopLevelPatchObjectValue('ampEgEnvelope', 'attack', ccVal);
			case CcNumber.LPF_CUTOFF:
				return setTopLevelPatchValue('lfpCutoff', ccVal);
			case CcNumber.REVERB_SIZE:
				return setTopLevelPatchValue('reverbSize', ccVal);
			case CcNumber.REVERB_DECAY:
				return setTopLevelPatchValue('reverbDecay', ccVal);
			case CcNumber.REVERB_FILTER:
				return setTopLevelPatchValue('reverbFilter', ccVal);
			case CcNumber.REVERB_MIX:
				return setTopLevelPatchValue('reverbMix', ccVal);
			case CcNumber.FILTER_EG_ATTACK:
				return setTopLevelPatchObjectValue('filterEgEnvelope', 'attack', ccVal);
			case CcNumber.FILTER_EG_DECAY:
				return setTopLevelPatchObjectValue('filterEgEnvelope', 'decay', ccVal);
			case CcNumber.HPF_CUTOFF:
				return setTopLevelPatchValue('hpfCutoff', ccVal);
			case CcNumber.FILTER_EG_SUSTAIN:
				return setTopLevelPatchObjectValue(
					'filterEgEnvelope',
					'sustain',
					ccVal
				);
			case CcNumber.FILTER_EG_RELEASE:
				return setTopLevelPatchObjectValue(
					'filterEgEnvelope',
					'release',
					ccVal
				);
			case CcNumber.AMP_EG_DECAY:
				return setTopLevelPatchObjectValue('ampEgEnvelope', 'decay', ccVal);
			case CcNumber.AMP_EG_SUSTAIN:
				return setTopLevelPatchObjectValue('ampEgEnvelope', 'sustain', ccVal);
		}
		assertNever(ccNum);
	}, INIT_STATE),
	debounceTime(5)
);

state$.subscribe((val) => {
	console.log(val);
	const elem = document.getElementById('log');
	assertExists(elem);
	elem.innerHTML = JSON.stringify(val, undefined, 2);
});
