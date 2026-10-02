let sharedContext;
let muted = false;
const setMuted = value => { muted = Boolean(value); };
const playSound = (type) => {
        if (muted) return;
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;
          const ctx = sharedContext || (sharedContext = new AudioContext());
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          if (type === 'item') {
            osc.frequency.setValueAtTime(350, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
          } else if (type === 'coin') {
            osc.frequency.setValueAtTime(987.77, ctx.currentTime);
            osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
          } else if (type === 'success') {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.connect(g);
              g.connect(ctx.destination);
              o.frequency.value = freq;
              g.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
              g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.22);
              o.start(ctx.currentTime + idx * 0.08);
              o.stop(ctx.currentTime + idx * 0.08 + 0.22);
            });
          } else if (type === 'hint') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(329.63, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
          } else if (type === 'click') {
            osc.frequency.setValueAtTime(250, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
          }
        } catch (e) {
          // Audio suppressed
        }
      };
export { playSound, setMuted };
