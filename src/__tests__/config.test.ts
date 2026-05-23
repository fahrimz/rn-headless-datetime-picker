describe('config', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function loadConfig(): typeof import('../config') {
    return require('../config');
  }

  test('getDefaults returns an empty object initially', () => {
    const { getDefaults } = loadConfig();
    expect(getDefaults()).toEqual({});
  });

  test('configureDateTimePicker sets defaults', () => {
    const { configureDateTimePicker, getDefaults } = loadConfig();
    configureDateTimePicker({ accentColor: '#FFD443' });
    expect(getDefaults()).toEqual({ accentColor: '#FFD443' });
  });

  test('multiple calls merge non-overlapping keys', () => {
    const { configureDateTimePicker, getDefaults } = loadConfig();
    configureDateTimePicker({ accentColor: '#FFD443' });
    configureDateTimePicker({ themeVariant: 'dark' });
    expect(getDefaults()).toEqual({
      accentColor: '#FFD443',
      themeVariant: 'dark',
    });
  });

  test('later calls override overlapping keys', () => {
    const { configureDateTimePicker, getDefaults } = loadConfig();
    configureDateTimePicker({ accentColor: '#FFD443' });
    configureDateTimePicker({ accentColor: '#FF0000' });
    expect(getDefaults()).toEqual({ accentColor: '#FF0000' });
  });

  test('getDefaults returns a snapshot (mutating it does not affect future calls)', () => {
    const { configureDateTimePicker, getDefaults } = loadConfig();
    configureDateTimePicker({ accentColor: '#FFD443' });

    const snapshot = getDefaults();
    // Force a mutation on the returned object — config.ts holds the
    // authoritative copy and should not be affected.
    (snapshot as Record<string, unknown>).accentColor = '#000';

    expect(getDefaults().accentColor).toBe('#FFD443');
  });
});
