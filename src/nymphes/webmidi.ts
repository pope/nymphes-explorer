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

import { assertKnownCcNumber, assertValidMidiValue } from './asserts';
import { CC_MIDI_COMMAND, CcNumber } from './constants';
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
	{ ccNum: CcNumber; ccVal: MidiValue } | undefined
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
