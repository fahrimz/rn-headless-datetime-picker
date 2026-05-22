import { useCallback, useEffect, useState } from 'react';
import { Platform, type TextStyle, type ViewStyle } from 'react-native';
import { subscribe } from './bus';
import { IosPicker } from './ios';
import { AndroidPicker } from './android';
import type { PickerRequest } from './types';

export interface DateTimePickerHostProps {
  containerStyle?: ViewStyle;
  backdropStyle?: ViewStyle;
  doneTextStyle?: TextStyle;
}

export function DateTimePickerHost({
  containerStyle,
  backdropStyle,
  doneTextStyle,
}: DateTimePickerHostProps = {}) {
  const [active, setActive] = useState<PickerRequest | null>(null);

  useEffect(() => {
    return subscribe((req) => {
      if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
        req.resolve(null);
        return;
      }
      setActive((prev) => {
        if (prev) prev.resolve(null);
        return req;
      });
    });
  }, []);

  const handleResult = useCallback((date: Date | null) => {
    setActive((prev) => {
      if (prev) prev.resolve(date);
      return null;
    });
  }, []);

  if (!active) return null;

  if (Platform.OS === 'ios') {
    return (
      <IosPicker
        request={active}
        onResult={handleResult}
        containerStyle={containerStyle}
        backdropStyle={backdropStyle}
        doneTextStyle={doneTextStyle}
      />
    );
  }

  if (Platform.OS === 'android') {
    return <AndroidPicker request={active} onResult={handleResult} />;
  }

  return null;
}
