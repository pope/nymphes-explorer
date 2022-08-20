console.log('Hello, world');

async function trySomething(): Promise<void> {
    const midiAccess = await navigator.requestMIDIAccess();
    //handleUpdates(midiAccess);
    midiAccess.addEventListener('statechange', (event) => {
        console.log(event);
        handleUpdates(midiAccess);
    });
}

function handleUpdates(midiAccess: WebMidi.MIDIAccess): void {
    printInputs(midiAccess);
    printOutputs(midiAccess);

    const input = getNymphesInput(midiAccess);
    input.onmidimessage = (event) => {
        let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
        for (const character of event.data) {
            str += `0x${character.toString(16)} `;
        }
        console.log(str);
    };
    console.log(input);
}

function printInputs(midiAccess: WebMidi.MIDIAccess): void {
    console.log(midiAccess.inputs.size);
    midiAccess.inputs.forEach((input, key) => {
        console.log(`Key: ${key}`);
        console.log(`Input port [type:'${input.type}']` +
            ` id:'${input.id}'` +
            ` manufacturer:'${input.manufacturer}'` +
            ` name:'${input.name}'` +
            ` version:'${input.version}'`);
    });
}

function printOutputs(midiAccess: WebMidi.MIDIAccess): void {
    console.log(midiAccess.inputs.size);
    midiAccess.outputs.forEach((output, key) => {
        console.log(`Key: ${key}`);
        console.log(`Output port [type:'${output.type}']` +
            ` id:'${output.id}'` +
            ` manufacturer:'${output.manufacturer}'` +
            ` name:'${output.name}'` +
            ` version:'${output.version}'`);
    });
}

function getNymphesInput(midiAccess: WebMidi.MIDIAccess): WebMidi.MIDIInput {
    for (const input of midiAccess.inputs.values()) {
        if (input.manufacturer === 'STMicroelectronics' && input.name === 'Nymphes') {
            return input;
        }
    }
    throw new Error('Unable to find Nymphes');
}

function getNymphesOutput(midiAccess: WebMidi.MIDIAccess): WebMidi.MIDIOutput {
    for (const output of midiAccess.outputs.values()) {
        if (output.manufacturer === 'STMicroelectronics' && output.name === 'Nymphes') {
            return output;
        }
    }
    throw new Error('Unable to find Nymphes');
}

trySomething();