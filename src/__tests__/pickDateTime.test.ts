import type { PickerRequest } from '../types';

describe('pickDateTime', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function load() {
    return {
      bus: require('../bus') as typeof import('../bus'),
      config: require('../config') as typeof import('../config'),
      picker: require('../pickDateTime') as typeof import('../pickDateTime'),
    };
  }

  test('pickDate emits a request with mode=date', async () => {
    const { bus, picker } = load();
    let captured: PickerRequest | null = null;
    bus.subscribe((req) => {
      captured = req;
      req.resolve(null);
    });

    await picker.pickDate();

    expect(captured).not.toBeNull();
    expect(captured!.options.mode).toBe('date');
  });

  test('pickTime emits a request with mode=time', async () => {
    const { bus, picker } = load();
    let captured: PickerRequest | null = null;
    bus.subscribe((req) => {
      captured = req;
      req.resolve(null);
    });

    await picker.pickTime();

    expect(captured!.options.mode).toBe('time');
  });

  test('resolves to the value the subscriber passes', async () => {
    const { bus, picker } = load();
    const expected = new Date(2026, 0, 1, 12, 30);
    bus.subscribe((req) => req.resolve(expected));

    const result = await picker.pickDate();

    expect(result).toBe(expected);
  });

  test('resolves to null when subscriber resolves null (dismiss)', async () => {
    const { bus, picker } = load();
    bus.subscribe((req) => req.resolve(null));

    const result = await picker.pickTime();

    expect(result).toBeNull();
  });

  test('global defaults merge with per-call options', async () => {
    const { bus, config, picker } = load();
    config.configureDateTimePicker({
      accentColor: '#FFD443',
      themeVariant: 'dark',
      doneLabel: 'OK',
    });
    let captured: PickerRequest | null = null;
    bus.subscribe((req) => {
      captured = req;
      req.resolve(null);
    });

    await picker.pickDate({ themeVariant: 'light' });

    expect(captured!.options.accentColor).toBe('#FFD443'); // from defaults
    expect(captured!.options.themeVariant).toBe('light'); // per-call wins
    expect(captured!.options.doneLabel).toBe('OK'); // from defaults
    expect(captured!.options.mode).toBe('date'); // pickDate forces this
  });

  test('pickDate forces mode=date even if caller smuggles mode in options', async () => {
    const { bus, picker } = load();
    let captured: PickerRequest | null = null;
    bus.subscribe((req) => {
      captured = req;
      req.resolve(null);
    });

    // The TypeScript signature blocks this at compile-time (Omit<…,'mode'>),
    // but at runtime callers can bypass it. The wrapper must still win.
    await picker.pickDate({ mode: 'time' } as never);

    expect(captured!.options.mode).toBe('date');
  });

  test('pickDateTime queues when no subscriber, drains when one mounts', async () => {
    const { bus, picker } = load();

    // Fire the call before any subscriber exists.
    const pending = picker.pickDate({ initial: new Date(2026, 5, 1) });

    // Subscriber mounts later (mirrors DateTimePickerHost mounting late).
    bus.subscribe((req) => {
      expect(req.options.mode).toBe('date');
      req.resolve(new Date(2026, 5, 2));
    });

    const result = await pending;
    expect(result).toEqual(new Date(2026, 5, 2));
  });

  test('each call generates a unique request id', async () => {
    const { bus, picker } = load();
    const ids: string[] = [];
    bus.subscribe((req) => {
      ids.push(req.id);
      req.resolve(null);
    });

    await Promise.all([
      picker.pickDate(),
      picker.pickDate(),
      picker.pickDate(),
    ]);

    expect(new Set(ids).size).toBe(3);
  });
});
