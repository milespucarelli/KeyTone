document.addEventListener('DOMContentLoaded', () => {
  const synth = new Tone.Synth({
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.01,
      attackCurve: 'exponential',
      decay: 2.00,
      decayCurve: 'exponential',
      sustain: 0.50,
      release: 4.0,
      releaseCurve: 'exponential'
    }
  }).toMaster()
  document.addEventListener('keydown', event => {
    console.log(event)
    if (event.key === 'a') {
      synth.triggerAttackRelease('C1', '1n')
    } else if (event.key === 's') {
      synth.triggerAttackRelease('C2', '1n')
    }
  })
})
