import type { PickerRequest } from './types';

type Listener = (request: PickerRequest) => void;

let listener: Listener | null = null;
const pending: PickerRequest[] = [];

export function subscribe(fn: Listener): () => void {
  listener = fn;
  while (pending.length > 0) {
    const next = pending.shift();
    if (next) fn(next);
  }
  return () => {
    if (listener === fn) listener = null;
  };
}

export function emit(request: PickerRequest) {
  if (listener) {
    listener(request);
  } else {
    pending.push(request);
  }
}
