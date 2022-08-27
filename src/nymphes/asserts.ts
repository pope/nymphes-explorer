import { assert, assertExists, assertNever } from '../asserts';
import { CcNumber } from './constants';
import { LfoType, MidiValue, ModSource, PlayMode, Toggle } from './types';

export function assertKnownCcNumber(
	ccNum: number | undefined
): asserts ccNum is CcNumber {
	assertExists(ccNum, `CC Number is not a number: ${ccNum}`);
	if (!(ccNum in CcNumber)) {
		throw new Error(`Unknown CC Number: ${ccNum}`);
	}
}

export function assertValidMidiValue(
	midiVal: number | undefined
): asserts midiVal is MidiValue {
	assertExists(midiVal, `Midi value is not a number: ${midiVal}`);
	assert(
		midiVal >= 0 && midiVal < 128,
		`Midi value is not within range of [0, 128): ${midiVal}`
	);
}

export function assertPlayMode(
	midiVal: MidiValue
): asserts midiVal is PlayMode {
	// Casting to enable lint checks that all cases are covered.
	const val = midiVal as PlayMode;
	switch (val) {
		case PlayMode.DUO:
		case PlayMode.MONO:
		case PlayMode.POLY:
		case PlayMode.TRI:
		case PlayMode.UNI_A:
		case PlayMode.UNI_B:
			return;
	}
	assertNever(val);
}

export function castPlayMode(midiVal: MidiValue): PlayMode {
	assertPlayMode(midiVal);
	return midiVal;
}

export function assertLfoType(midiVal: MidiValue): asserts midiVal is LfoType {
	// Casting to enable lint checks that all cases are covered.
	const val = midiVal as LfoType;
	switch (val) {
		case LfoType.BPM:
		case LfoType.HIGH:
		case LfoType.LOW:
		case LfoType.TRACK:
			return;
	}
	assertNever(val);
}

export function castLfoType(midiVal: MidiValue): LfoType {
	assertLfoType(midiVal);
	return midiVal;
}

export function assertToggle(midiVal: MidiValue): asserts midiVal is Toggle {
	// Casting to enable lint checks that all cases are covered.
	const val = midiVal as Toggle;
	switch (val) {
		case Toggle.OFF:
		case Toggle.ON:
			return;
	}
	assertNever(val);
}

export function castToggle(midiVal: MidiValue): Toggle {
	assertToggle(midiVal);
	return midiVal;
}

export function assertModSource(
	midiVal: MidiValue
): asserts midiVal is ModSource {
	// Casting to enable lint checks that all cases are covered.
	const val = midiVal as ModSource;
	switch (val) {
		case ModSource.AFTERTOUCH:
		case ModSource.LFO_2:
		case ModSource.MOD_WHEEL:
		case ModSource.VELOCITY:
			return;
	}
	assertNever(val);
}

export function castModSource(midiVal: MidiValue): ModSource {
	assertModSource(midiVal);
	return midiVal;
}
