import { debounceTime, scan } from 'rxjs';

import { CC_NUMBERS } from './nymphes/constants';
import { MidiValue } from './nymphes/types';
import { ccValue$ } from './nymphes/webmidi';

ccValue$
	.pipe(
		scan((state, data) => {
			if (!data) {
				// Reset
				return {};
			}
			return {
				...state,
				[CC_NUMBERS[data.ccNum]]: data.ccVal,
			};
		}, {} as { [key: string]: MidiValue }),
		debounceTime(5)
	)
	.subscribe((obj) => void console.log(obj));
