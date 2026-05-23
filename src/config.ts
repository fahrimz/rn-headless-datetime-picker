import type { PickDateTimeOptions } from './types';

let defaults: Partial<PickDateTimeOptions> = {};

export function configureDateTimePicker(next: Partial<PickDateTimeOptions>) {
  defaults = { ...defaults, ...next };
}

export function getDefaults(): Partial<PickDateTimeOptions> {
  // Return a shallow copy so callers can't mutate the internal store.
  return { ...defaults };
}
