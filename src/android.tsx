import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { PickerRequest } from './types';

interface Props {
  request: PickerRequest;
  onResult: (date: Date | null) => void;
}

export function AndroidPicker({ request, onResult }: Props) {
  const { options } = request;
  const initial = options.initial ?? new Date();
  const mode = options.mode ?? 'date';

  return (
    <DateTimePicker
      value={initial}
      mode={mode}
      onChange={(e: DateTimePickerEvent, d?: Date) => {
        if (e.type === 'set' && d) {
          onResult(d);
        } else {
          onResult(null);
        }
      }}
      minimumDate={options.min}
      maximumDate={options.max}
      display={options.androidDisplay}
      is24Hour={options.is24Hour}
    />
  );
}
