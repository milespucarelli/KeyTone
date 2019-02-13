document.addEventListener('DOMContentLoaded', () => {
  /*
    808 BASS
  */
  const bass808 = new Tone.Synth({
    volume: +15,
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

  /*
    HIHAT
  */
  const ratios = [80, 120, 166.4, 217.2, 271.6, 328.4]

  // Bandpass
  const bandpass = new Tone.Filter({
    type: 'bandpass',
    frequency: 10000
  })

  // Highpass
  const highpass = new Tone.Filter({
    type: 'highpass',
    frequency: 7000
  })

  const hihat = new Tone.PolySynth(6, Tone.Synth).chain(bandpass).chain(highpass, Tone.Master)
  hihat.set({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.001,
      attackCurve: 'exponential',
      decay: 0.1,
      decayCurve: 'exponential',
      sustain: 0.0,
      release: 0.1,
      releaseCurve: 'exponential'
    }
  })

  const hihatCallback = () => hihat.triggerAttackRelease(ratios, '16n')
  const fastHihatCallback = () => hihat.triggerAttackRelease(ratios, '32n')
  const hihatLoop = new Tone.Loop(hihatCallback, '8n')
  const fastHihatLoop = new Tone.Loop(fastHihatCallback, '16n')

  /*
    SNARE
  */

  const lowPass = new Tone.Filter({
    frequency: 11000
  }).toMaster()

  const noise = new Tone.NoiseSynth({
    noise: {
      type: 'white',
      playbackRate: 1
    },
    envelope: {
      attackCurve: 'exponential',
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.1
    }
  }).connect(lowPass)

  const snare = new Tone.PolySynth(6, Tone.Synth, {
    oscillator: {
      partials: [0, 2, 3, 4]
    },
    envelope: {
      attack: 0.001,
      decay: 0.17,
      sustain: 0,
      release: 0.05
    }
  }).toMaster()

  const notes = ['C2', 'D#2', 'G2']

  snare.voices.forEach((v, i) => {
    const env = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.08,
      release: 0.08,
      baseFrequency: Tone.Frequency(notes[i]),
      octaves: Math.log2(13),
      releaseCurve: 'exponential',
      exponent: 3.5
    })
    env.connect(v.oscillator.frequency)
  })

  /*
  KICK
  */

  const kick = new Tone.MembraneSynth(
    {
      volume: +15,
      pitchDecay: 0.2,
      octaves: 2.0,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0.01,
        release: 0.1,
        attackCurve: 'linear'
      }
    }).toMaster()

  document.addEventListener('keydown', event => {
    if (event.key === 'a') {
      bass808.triggerAttackRelease('C1', '1n')
      kick.triggerAttackRelease('C1', '8n')
    } else if (event.key === 's') {
      bass808.triggerAttackRelease('C2', '1n')
      kick.triggerAttackRelease('C1', '8n')
    } else if (event.key === 'd') {
      if (hihatLoop.state === 'stopped') {
        Tone.Transport.start()
        hihatLoop.start(0)
        fastHihatLoop.stop()
      } else {
        Tone.Transport.stop()
        hihatLoop.stop()
      }
    } else if (event.key === 'c') {
      if (fastHihatLoop.state === 'stopped') {
        Tone.Transport.start()
        fastHihatLoop.start(0)
        hihatLoop.stop()
      } else {
        Tone.Transport.stop()
        fastHihatLoop.stop()
      }
    } else if (event.key === 'x') {
      noise.triggerAttack()
      snare.triggerAttackRelease(['Eb3', 'G4', 'C5'], '16n')
    } else if (event.key === 'z') {
      kick.triggerAttackRelease('C1', '8n')
    }
  })
})
