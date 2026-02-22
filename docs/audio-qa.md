# Audio QA Checklist

Manual verification targets for Gameplay V2 procedural audio.

## Setup
- Start local dev server: `npm run dev`
- Use a browser with Web Audio support (Chrome/Firefox/Safari).
- Interact once with the game surface to unlock audio context.

## Rhythm and Charge
- [ ] Rhythm ticks are audible and distinct for perfect vs good timing.
- [ ] Rhythm ticks are not spammed when holding or mashing input.
- [ ] Entering charge phase has a clear transition cue.

## Throw and Flight
- [ ] Throw release plays a whoosh.
- [ ] Faster release produces brighter/stronger whoosh character.
- [ ] During flight, wind layer fades in and tracks perceived javelin speed.
- [ ] Wind layer fades out after flight ends.

## Landing and Outcomes
- [ ] Landing plays one impact sound per throw.
- [ ] Tip-first landing includes an extra bright accent.
- [ ] Valid result triggers positive crowd reaction.
- [ ] Foul/fault results trigger negative crowd reaction.
- [ ] Fault phase includes retro-style short oof cue.

## Stability
- [ ] No console audio errors during 10 consecutive rounds.
- [ ] Sounds remain stable after switching tabs and returning.
- [ ] Mobile touch interaction starts audio correctly after first gesture.
