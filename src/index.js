document.addEventListener('DOMContentLoaded', () => {
  const high808 = document.getElementById('high808')
  const low808 = document.getElementById('low808')
  const slowHiHat = document.getElementById('slow-hihat')
  const fastHiHat = document.getElementById('fast-hihat')
  const kickElement = document.getElementById('kick')
  const snareElement = document.getElementById('snare')
  const synthSelector = document.getElementById('synthSelector')
  const synthC3 = document.getElementById('C3')
  const synthD3 = document.getElementById('D3')
  const synthEb3 = document.getElementById('Eb3')
  const synthF3 = document.getElementById('F3')
  const synthG3 = document.getElementById('G3')
  const synthAb3 = document.getElementById('Ab3')
  const synthBb3 = document.getElementById('Bb3')
  const synthC4 = document.getElementById('C4')
  const cChord = document.getElementById('c-chord')
  const dChord = document.getElementById('d-chord')
  const ebChord = document.getElementById('eb-chord')
  const fChord = document.getElementById('f-chord')
  const gChord = document.getElementById('g-chord')
  const abChord = document.getElementById('ab-chord')
  const bbChord = document.getElementById('bb-chord')
  const cChordHigh = document.getElementById('c-chord-high')

  /*
    808 BASS
  */
  const bass808 = new Tone.Synth({
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
    volume: -10,
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

  const hihatCallback = () => {
    slowHiHat.style.border = '5px solid #62b233'
    hihat.triggerAttackRelease(ratios, '16n')
    setTimeout(() => {
      slowHiHat.style.border = 'none'
    }, 50)
  }
  const fastHihatCallback = () => {
    fastHiHat.style.border = '5px solid #62b233'
    hihat.triggerAttackRelease(ratios, '32n')
    setTimeout(() => {
      fastHiHat.style.border = 'none'
    }, 50)
  }
  const hihatLoop = new Tone.Loop(hihatCallback, '8n')
  const fastHihatLoop = new Tone.Loop(fastHihatCallback, '16n')

  /*
    SNARE
  */

  const lowPass = new Tone.Filter({
    frequency: 11000
  }).toMaster()

  const noise = new Tone.NoiseSynth({
    volume: -10,
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
    volume: -10,
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


  /*
    FM SYNTH 1
  */
  const phaser = new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: 1000
  }).toMaster()

  const autoWah = new Tone.AutoWah(50, 6, -30).toMaster()
  const fmSynth1 = new Tone.FMSynth({
    volume: -15,
    modulationType: 'triangle',
    harmonicity: 0,
    modulationIndex: 14,
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.01,
      decay: 2,
      sustain: 1,
      release: 0.01
    },
    modulation: {
      type: 'square'
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 2,
      sustain: 1,
      release: 0.01
    }
  }).chain(phaser).chain(autoWah)
  autoWah.Q.value = 6

  /*
    FM SYNTH 2
  */
  const fmSynth2 = new Tone.FMSynth({
    harmonicity: 0.5,
    modulationIndex: 1.4,
    oscillator: {
      type: 'fmsawtooth',
      modulationType: 'sine',
      modulationIndex: 1.4,
      harmonicity: 0.7
    },
    envelope: {
      attack: 0.01,
      decay: 20,
      sustain: 0.01,
      release: 1.2
    },
    modulation: {
      volume: 0,
      type: 'fmsawtooth'
    },
    modulationEnvelope: {
      attack: 0.61,
      decay: 0.1,
      sustain: 1,
      release: 0.01
    }
  }).toMaster()

  /*
    FM SYNTH 3
  */
  const fmSynth3 = new Tone.FMSynth({
    harmonicity: 6.0,
    modulationIndex: 30,
    oscillator: {
      type: 'triangle',
      modulationType: 'square',
      modulationIndex: 10.0,
      harmonicity: 3.0
    },
    envelope: {
      attack: 0.01,
      decay: 5.0,
      sustain: 0.03,
      release: 1.2
    },
    modulation: {
      volume: 10,
      type: 'triangle'
    },
    modulationEnvelope: {
      attack: 0.61,
      decay: 0.01,
      sustain: 1,
      release: 0.50
    }
  }).toMaster()

  /*
    FM SYNTH 4
  */
  const fmSynth4 = new Tone.FMSynth({
    volume: -10,
    harmonicity: 20,
    modulationIndex: 14,
    oscillator: {
      type: 'fmsawtooth'
    },
    envelope: {
      attack: 0.001,
      decay: 2,
      sustain: 0.1,
      release: 2
    },
    modulation: {
      type: 'triangle'
    },
    modulationEnvelope: {
      attack: 0.002,
      decay: 0.2,
      sustain: 0,
      release: 0.2
    }
  }).toMaster()

  /*
    AM SYNTH 1
  */
  const amSynth1 = new Tone.AMSynth({
    volume: -10,
    harmonicity: 15,
    oscillator: {
      type: 'sawtooth'
    },
    envelope: {
      attack: 0.1,
      decay: 5,
      sustain: 0.20,
      release: 0.30
    },
    modulation: {
      volume: 20,
      type: 'sawtooth'
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.01,
      sustain: 0.8,
      release: 1
    }
  }).toMaster()

  /*
    DUO SYNTH 1
  */

  const duoSynth1 = new Tone.DuoSynth({
    volume: -10,
    oscillator: {
      type: 'triangle'
    },
    filterEnvelope: {
      baseFrequency: 20,
      octaves: 4,
      attack: 0.1,
      decay: 0
    },
    envelope: {
      attack: 0.1,
      decay: 5,
      sustain: 0.20,
      release: 0.30
    },
    modulation: {
      volume: 20,
      type: 'sawtooth'
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.01,
      sustain: 0.8,
      release: 0.50
    }
  }).toMaster()

  /*
    DUO SYNTH 2
  */
  const duoSynth2 = new Tone.DuoSynth({
    volume: -10,
    voice0: {
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.1,
        release: 0.1,
        releaseCurve: 'linear'
      },
      filterEnvelope: {
        baseFrequency: 200,
        octaves: 2,
        attack: 0,
        decay: 0,
        release: 100
      }
    },
    voice1: {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.1,
        release: 0.1,
        releaseCurve: 'linear'
      },
      filterEnvelope: {
        baseFrequency: 200,
        octaves: 4,
        attack: 0,
        decay: 0,
        release: 1000
      }
    }
  }).toMaster()

  /*
    DUO SYNTH 3
  */

  const duoSynth3 = new Tone.DuoSynth({
    volume: -10,
    voice0: {
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.1,
        release: 0.1,
        releaseCurve: 'linear'
      },
      filterEnvelope: {
        baseFrequency: 200,
        octaves: 2,
        attack: 0,
        decay: 0,
        release: 100
      }
    },
    voice1: {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.1,
        release: 0.1,
        releaseCurve: 'linear'
      },
      filterEnvelope: {
        baseFrequency: 200,
        octaves: 4,
        attack: 0,
        decay: 0,
        release: 1000
      }
    }
  }).toMaster()

  /*
    DUO SYNTH 4
  */
  const duoSynth4 = new Tone.DuoSynth({
    volume: -10,
    vibratoAmount: 0.5,
    vibratoRate: 5,
    harmonicity: 1.5,
    voice0: {
      portamento: 0,
      oscillator: {
        type: 'sine'
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5
      },
      envelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5
      }
    },
    voice1: {
      portamento: 0,
      oscillator: {
        type: 'sine'
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5
      },
      envelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5
      }
    }
  })

  /*
    DUO SYNTH 5
  */
  const duoSynth5 = new Tone.DuoSynth({
    volume: -10,
    vibratoAmount: 0.5,
    vibratoRate: 5,
    harmonicity: 4.0,
    voice0: {
      portamento: 0,
      oscillator: {
        type: 'square4'
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 3,
        release: 0.8
      },
      envelope: {
        attack: 4,
        decay: 0,
        sustain: 1,
        release: 0.5
      }
    },
    voice1: {
      portamento: 0.02,
      oscillator: {
        type: 'sine'
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5
      },
      envelope: {
        attack: 0.1,
        decay: 0,
        sustain: 1,
        release: 0.5
      }
    }
  })

  const polySynth1 = new Tone.PolySynth(8,
    Tone.Synth,
    {
      volume: -15,
      oscillator: {
        type: 'fmsquare',
        partials: [0, 2, 3, 4, 5, 6, 7, 8],
        spread: 40,
        modulationType: 'sawtooth',
        modulationIndex: 1,
        harmonicity: 2
      },
      envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 1,
        release: 0.1
      }
    }).toMaster()

  let synth = fmSynth1
  synthSelector.addEventListener('change', event => {
    const selection = event.target.value
    if (selection === 'fmSynth1') {
      synth = fmSynth1
    } else if (selection === 'fmSynth2') {
      synth = fmSynth2
    } else if (selection === 'fmSynth3') {
      synth = fmSynth3
    } else if (selection === 'fmSynth4') {
      synth = fmSynth4
    } else if (selection === 'amSynth1') {
      synth = amSynth1
    } else if (selection === 'duoSynth1') {
      synth = duoSynth1
    } else if (selection === 'duoSynth2') {
      synth = duoSynth2
    } else if (selection === 'duoSynth3') {
      synth = duoSynth3
    } else if (selection === 'duoSynth4') {
      synth = duoSynth4
    } else if (selection === 'duoSynth5') {
      synth = duoSynth5
    }
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'a') {
      bass808.triggerAttackRelease('C1', '1n')
      kick.triggerAttackRelease('C1', '8n')
      low808.style.border = '5px solid #62b233'
    } else if (event.key === 's') {
      bass808.triggerAttackRelease('C2', '1n')
      kick.triggerAttackRelease('C1', '8n')
      high808.style.border = '5px solid #62b233'
    } else if (event.key === 'd') {
      if (hihatLoop.state === 'stopped') {
        Tone.Transport.start()
        hihatLoop.start(0)
        fastHihatLoop.stop()
      } else {
        Tone.Transport.stop()
        hihatLoop.stop()
      }
      slowHiHat.style.border = '5px solid #62b233'
    } else if (event.key === 'c') {
      if (fastHihatLoop.state === 'stopped') {
        Tone.Transport.start()
        fastHihatLoop.start(0)
        hihatLoop.stop()
      } else {
        Tone.Transport.stop()
        fastHihatLoop.stop()
      }
      fastHiHat.style.border = '5px solid #62b233'
    } else if (event.key === 'x') {
      snareElement.style.border = '5px solid #62b233'
      noise.triggerAttack()
      snare.triggerAttackRelease(['Eb3', 'G4', 'C5'], '16n')
    } else if (event.key === 'z') {
      kick.triggerAttackRelease('C1', '8n')
      kickElement.style.border = '5px solid #62b233'
    } else if (event.key === 'e') {
      synth.triggerAttackRelease('C4', '8n')
      synthC3.style.border = '5px solid #62b233'
    } else if (event.key === 'r') {
      synth.triggerAttackRelease('D4', '8n')
      synthD3.style.border = '5px solid #62b233'
    } else if (event.key === 't') {
      synth.triggerAttackRelease('Eb4', '8n')
      synthEb3.style.border = '5px solid #62b233'
    } else if (event.key === 'y') {
      synth.triggerAttackRelease('F4', '8n')
      synthF3.style.border = '5px solid #62b233'
    } else if (event.key === 'u') {
      synth.triggerAttackRelease('G4', '8n')
      synthG3.style.border = '5px solid #62b233'
    } else if (event.key === 'i') {
      synth.triggerAttackRelease('Ab4', '8n')
      synthAb3.style.border = '5px solid #62b233'
    } else if (event.key === 'o') {
      synth.triggerAttackRelease('Bb4', '8n')
      synthBb3.style.border = '5px solid #62b233'
    } else if (event.key === 'p') {
      synth.triggerAttackRelease('C5', '8n')
      synthC4.style.border = '5px solid #62b233'
    } else if (event.key === 'h') {
      polySynth1.triggerAttackRelease(['C4', 'Eb4', 'G4'], '8n')
      cChord.style.border = '5px solid #62b233'
    } else if (event.key === 'j') {
      polySynth1.triggerAttackRelease(['D4', 'F4', 'Ab5'], '8n')
      dChord.style.border = '5px solid #62b233'
    } else if (event.key === 'k') {
      polySynth1.triggerAttackRelease(['Eb4', 'G4', 'Bb5'], '8n')
      ebChord.style.border = '5px solid #62b233'
    } else if (event.key === 'l') {
      polySynth1.triggerAttackRelease(['F4', 'Ab5', 'C5'], '8n')
      fChord.style.border = '5px solid #62b233'
    } else if (event.key === 'v') {
      polySynth1.triggerAttackRelease(['G4', 'Bb5', 'D5'], '8n')
      gChord.style.border = '5px solid #62b233'
    } else if (event.key === 'b') {
      polySynth1.triggerAttackRelease(['Ab5', 'C5', 'Eb5'], '8n')
      abChord.style.border = '5px solid #62b233'
    } else if (event.key === 'n') {
      polySynth1.triggerAttackRelease(['Bb5', 'D5', 'F5'], '8n')
      bbChord.style.border = '5px solid #62b233'
    } else if (event.key === 'm') {
      polySynth1.triggerAttackRelease(['C5', 'Eb5', 'G5'], '8n')
      cChordHigh.style.border = '5px solid #62b233'
    }
  })

  document.addEventListener('keyup', event => {
    if (event.key === 'a') {
      low808.style.border = 'none'
    } else if (event.key === 's') {
      high808.style.border = 'none'
    } else if (event.key === 'd') {
      slowHiHat.style.border = 'none'
    } else if (event.key === 'c') {
      fastHiHat.style.border = 'none'
    } else if (event.key === 'x') {
      snareElement.style.border = 'none'
    } else if (event.key === 'z') {
      kickElement.style.border = 'none'
    } else if (event.key === 'e') {
      synthC3.style.border = 'none'
    } else if (event.key === 'r') {
      synthD3.style.border = 'none'
    } else if (event.key === 't') {
      synthEb3.style.border = 'none'
    } else if (event.key === 'y') {
      synthF3.style.border = 'none'
    } else if (event.key === 'u') {
      synthG3.style.border = 'none'
    } else if (event.key === 'i') {
      synthAb3.style.border = 'none'
    } else if (event.key === 'o') {
      synthBb3.style.border = 'none'
    } else if (event.key === 'p') {
      synthC4.style.border = 'none'
    } else if (event.key === 'h') {
      cChord.style.border = 'none'
    } else if (event.key === 'j') {
      dChord.style.border = 'none'
    } else if (event.key === 'k') {
      ebChord.style.border = 'none'
    } else if (event.key === 'l') {
      fChord.style.border = 'none'
    } else if (event.key === 'v') {
      gChord.style.border = 'none'
    } else if (event.key === 'b') {
      abChord.style.border = 'none'
    } else if (event.key === 'n') {
      bbChord.style.border = 'none'
    } else if (event.key === 'm') {
      cChordHigh.style.border = 'none'
    }
  })
})
