import type { PickDateTimeOptions } from './types';

let defaults: Partial<PickDateTimeOptions> = {};

export function configureDateTimePicker(next: Partial<PickDateTimeOptions>) {
  defaults = { ...defaults, ...next };
}

export function getDefaults(): Partial<PickDateTimeOptions> {
  return defaults;
}
