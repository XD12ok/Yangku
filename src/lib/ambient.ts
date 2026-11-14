export type AmbientLoop = {
  start: () => Promise<void>;
  stop: () => void;
  dispose: () => void;
};

const MELODY = [523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33];
const BASS = [130.81, 130.81, 174.61, 174.61, 196.0, 196.0, 164.81, 164.81];

export function createAmbientLoop(): AmbientLoop {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let step = 0;
  let running = false;

  function ensure() {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!Ctor) throw new Error("Web Audio tidak didukung");

      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);
    }

    return { context: ctx, output: master! };
  }

  function note(
    freq: number,
    time: number,
    duration: number,
    volume: number,
    type: OscillatorType = "sine",
  ) {
    if (!ctx || !master) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  function tick() {
    if (!ctx) return;

    const time = ctx.currentTime + 0.06;
    const melody = MELODY[step % MELODY.length];

    note(melody, time, 1.6, 0.16);
    note(melody * 2, time + 0.02, 1.1, 0.05, "triangle");

    if (step % 4 === 0) {
      note(BASS[step % BASS.length], time, 3.2, 0.09);
    }

    step += 1;
  }

  return {
    async start() {
      const { context, output } = ensure();
      await context.resume();

      if (running) return;
      running = true;

      output.gain.cancelScheduledValues(context.currentTime);
      output.gain.setValueAtTime(0.0001, context.currentTime);
      output.gain.exponentialRampToValueAtTime(0.6, context.currentTime + 1.2);

      tick();
      timer = setInterval(tick, 1600);
    },
    stop() {
      if (!ctx || !master || !running) return;

      running = false;

      if (timer) {
        clearInterval(timer);
        timer = null;
      }

      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    },
    dispose() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }

      running = false;
      void ctx?.close();
      ctx = null;
      master = null;
    },
  };
}
