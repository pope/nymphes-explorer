import * as deepEqual from 'fast-deep-equal';
import { concat, debounceTime, distinctUntilChanged, filter, from, fromEvent, map, of, scan, switchMap } from 'rxjs';

const CC_MIDI_COMMAND = 0xB0;

interface NymphesPorts {
    readonly midiAccess: WebMidi.MIDIAccess;
    readonly input: WebMidi.MIDIInput;
    readonly output: WebMidi.MIDIOutput;
}

const midiAccess$ = from(navigator.requestMIDIAccess());

const nymphesPorts$ = midiAccess$.pipe(
    switchMap((midiAccess) => concat(
        of(getNymphesPorts(midiAccess)),
        fromEvent(midiAccess, 'statechange').pipe((map(() => getNymphesPorts(midiAccess)))))),
    distinctUntilChanged(deepEqual),
);

const currentCcValues$ = nymphesPorts$.pipe(
    switchMap((ports) => {
        if (!ports) {
            return of(null);
        }
        return fromEvent<WebMidi.MIDIMessageEvent>(ports.input, 'midimessage')
    }),
    filter((event) => !event || (event.data.length === 3 && event.data.at(0) === CC_MIDI_COMMAND)),
    distinctUntilChanged((prev, cur) => deepEqual(prev?.data, cur?.data)),
    scan((state, event) => {
        if (!event) {
            // Reset
            return {};
        }
        return {
            ...state,
            [event.data.at(1)!]: event.data.at(2)!,
        };
    }, {} as { [key: number]: number }),
)

function getNymphesPorts(midiAccess: WebMidi.MIDIAccess): NymphesPorts | undefined {
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

currentCcValues$
    .pipe(debounceTime(5))
    .subscribe((obj) => console.log(obj));