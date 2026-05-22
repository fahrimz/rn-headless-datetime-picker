import { emit } from './bus';
import { getDefaults } from './config';
import type { PickDateTimeOptions } from './types';

let nextId = 0;

export function pickDateTime(
  options: PickDateTimeOptions = {}
): Promise<Date | null> {
  const merged: PickDateTimeOptions = { ...getDefaults(), ...options };
  return new Promise((resolve) => {
    emit({
      id: String(++nextId),
      options: merged,
      resolve,
    });
  });
}

export function pickDate(options: Omit<PickDateTimeOptions, 'mode'> = {}) {
  return pickDateTime({ ...options, mode: 'date' });
}

export function pickTime(options: Omit<PickDateTimeOptions, 'mode'> = {}) {
  return pickDateTime({ ...options, mode: 'time' });
}
