import * as deepEqual from 'fast-deep-equal';
import {
	Observable,
	concat,
	distinctUntilChanged,
	filter,
	from,
	fromEvent,
	map,
	of,
	switchMap,
} from 'rxjs';

import { assert, assertExists } from '../asserts';
import { CC_MIDI_COMMAND, CC_NUMBERS } from './constants';
import { MidiValue } from './types';

interface NymphesPorts {
	readonly midiAccess: WebMidi.MIDIAccess;
	readonly input: WebMidi.MIDIInput;
	readonly output: WebMidi.MIDIOutput;
}

function getNymphesPorts(
	midiAccess: WebMidi.MIDIAccess
): NymphesPorts | undefined {
	let input: WebMidi.MIDIInput | undefined;
	let output: WebMidi.MIDIOutput | undefined;

	for (const port of midiAccess.inputs.values()) {
		if (port.manufacturer === 'STMicroelectronics' && port.name === 'Nymphes') {
			input = port;
			break;
		}
	}
	for (const port of midiAccess.outputs.values()) {
		if (port.manufacturer === 'STMicroelectronics' && port.name === 'Nymphes') {
			output = port;
			break;
		}
	}
	if (!input || !output) {
		return undefined;
	}
	return {
		midiAccess,
		input,
		output,
	};
}

function assertKnownCcNumber(
	ccNum: number | undefined
): asserts ccNum is CC_NUMBERS {
	assertExists(ccNum, `CC Number is not a number: ${ccNum}`);
	if (!(ccNum in CC_NUMBERS)) {
		throw new Error(`Unknown CC Number: ${ccNum}`);
	}
}

function assertValidMidiValue(
	midiVal: number | undefined
): asserts midiVal is MidiValue {
	assertExists(midiVal, `Midi value is not a number: ${midiVal}`);
	assert(
		midiVal >= 0 && midiVal < 128,
		`Midi value is not within range of [0, 128): ${midiVal}`
	);
}

const midiAccess$ = from(navigator.requestMIDIAccess());

const nymphesPorts$ = midiAccess$.pipe(
	switchMap((midiAccess) =>
		concat(
			of(getNymphesPorts(midiAccess)),
			fromEvent(midiAccess, 'statechange').pipe(
				map(() => getNymphesPorts(midiAccess))
			)
		)
	),
	distinctUntilChanged(deepEqual)
);

export const ccValue$: Observable<
	{ ccNum: CC_NUMBERS; ccVal: MidiValue } | undefined
> = nymphesPorts$.pipe(
	switchMap((ports) =>
		ports
			? fromEvent<WebMidi.MIDIMessageEvent>(ports.input, 'midimessage')
			: of(null)
	),
	filter(
		(event) =>
			!event ||
			(event.data.length === 3 && event.data.at(0) === CC_MIDI_COMMAND)
	),
	distinctUntilChanged((prev, cur) => deepEqual(prev?.data, cur?.data)),
	map((event) => {
		if (!event) {
			return undefined;
		}
		const ccNum = event.data.at(1);
		const ccVal = event.data.at(2);
		assertKnownCcNumber(ccNum);
		assertValidMidiValue(ccVal);
		return {
			ccNum,
			ccVal,
		};
	}),
	distinctUntilChanged(deepEqual)
);
