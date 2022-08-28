# Nymphes Explorer

A web app for poking around the Dreadbox Nymphes.

## Nymphes Setup

First, to get this to work, the global settings of the Nymphes have to be
adjusted to allow MIDI CCs to send and respond CC values.

From the [manual](https://www.dreadbox-fx.com/wp-content/uploads/2022/02/Nymphes_Owners-Manual-v2.0.pdf), in part 6 of Global Settings:

> To access the Global Settings:
>
> 1. Press the MENU button, which will light
> 2. Select option 7 (MIDI CHANNELS)
> 3. With SHIFT lit, press the MENU button again, which will start flashing slowly
> 4. With the rotary switch, select options 1 through 6 to access to the various Global Settings
> 5. With either the LFO RATE slider (slider 13) or the LFO WAVE slider (slider 14), adjust the settings as desired.

CC values are controlled by option 5. Select that and move the LFO RATE and the LFO WAVE slider sliders up to set them to on.

## Notes

So with some code that does not handle errors, I was able to get `Observable` instances for when the Nymphes sends CC events over the input channel. I can move a slider, see the CC event and update an `Object` containing the last received value. Whenever I load a preset on the Nymphes, the Nymphes sends out all of the CC values for the patch and I can get a good readout of the selected
options.

If I load a preset on the Nymphes, a burst of CC events are sent out to correspond to all of the values of the patch.

### Mod Source Behavior

One thing I need to investigate is how I'm handling modulation values. There are three modulation sources - LFO 2, Mod Wheel, Velocity, and Aftertouch. Upon selecting one of those sources, the CC that control modulation depth are anchored to the selected source.

So for example, if LFO 2 (option 2 in the Menu) is selected and I adjust the OSC wave depth (CC #31), I get the following:

```
0xb0 0x1e 0    // CC event, CC# 30, Value 0
0xb0 0x1f 90   // CC event, CC# 31, Value 90
```

Those events happen real quickly - basically at the same time. Then if I change the menu to Mod Wheel (option 4 in the menu) and then change the OSC wave I get:

```
0xb0 0x1e 1    // CC event, CC# 30, Value 1
0xb0 0x1f 95   // CC event, CC# 31, Value 95
```

At this point, in the Nymphes it has:

- LFO 2 - OSC wave depth = 90
- Mod Wheel - OSC wave depth = 95

In my naive implementation, where I'm only storing the latest CC value, I'm not capturing that complexity on the read.

### UI Ideas

#### Vertical Slider

- [How to display a range input slider vertically](https://stackoverflow.com/questions/15935837/how-to-display-a-range-input-slider-vertically)
- https://material.preactjs.com/
- https://github.com/material-components/material-components-web/tree/master/packages/mdc-slider
- https://open-ui.org/components/slider.research
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
- https://developer.mozilla.org/en-US/docs/Web/CSS/appearance

#### Other Web Midi Control Software

- https://github.com/benc-uk/touchmidi
