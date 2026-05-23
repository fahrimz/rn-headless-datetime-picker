import type { PickerRequest } from '../types';

function makeRequest(id: string): PickerRequest {
  return {
    id,
    options: {},
    resolve: () => {},
  };
}

describe('bus', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function loadBus(): typeof import('../bus') {
    return require('../bus');
  }

  test('emit before subscribe queues, drains on subscribe', () => {
    const { emit, subscribe } = loadBus();
    const received: PickerRequest[] = [];

    emit(makeRequest('1'));
    emit(makeRequest('2'));
    expect(received).toHaveLength(0);

    subscribe((req) => received.push(req));

    expect(received.map((r) => r.id)).toEqual(['1', '2']);
  });

  test('emit after subscribe calls listener synchronously', () => {
    const { emit, subscribe } = loadBus();
    const received: PickerRequest[] = [];
    subscribe((req) => received.push(req));

    emit(makeRequest('1'));

    expect(received.map((r) => r.id)).toEqual(['1']);
  });

  test('unsubscribe stops receiving events', () => {
    const { emit, subscribe } = loadBus();
    const received: PickerRequest[] = [];
    const unsubscribe = subscribe((req) => received.push(req));

    unsubscribe();
    emit(makeRequest('1'));

    expect(received).toHaveLength(0);
  });

  test('subscribe replaces previous listener', () => {
    const { emit, subscribe } = loadBus();
    const receivedA: PickerRequest[] = [];
    const receivedB: PickerRequest[] = [];
    subscribe((req) => receivedA.push(req));
    subscribe((req) => receivedB.push(req));

    emit(makeRequest('1'));

    expect(receivedA).toHaveLength(0);
    expect(receivedB).toHaveLength(1);
  });

  test('unsubscribe does not clear listener if a newer one is active', () => {
    const { emit, subscribe } = loadBus();
    const receivedA: PickerRequest[] = [];
    const receivedB: PickerRequest[] = [];
    const unsubscribeA = subscribe((req) => receivedA.push(req));
    subscribe((req) => receivedB.push(req));

    // Stale unsubscribe from the replaced listener must not detach the active one.
    unsubscribeA();
    emit(makeRequest('1'));

    expect(receivedA).toHaveLength(0);
    expect(receivedB).toHaveLength(1);
  });
});
