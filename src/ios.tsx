import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { PickerRequest } from './types';

interface Props {
  request: PickerRequest;
  onResult: (date: Date | null) => void;
  containerStyle?: ViewStyle;
  backdropStyle?: ViewStyle;
  doneTextStyle?: TextStyle;
}

export function IosPicker({
  request,
  onResult,
  containerStyle,
  backdropStyle,
  doneTextStyle,
}: Props) {
  const { options } = request;
  const initial = options.initial ?? new Date();
  const [draft, setDraft] = useState<Date>(initial);
  const mode = options.mode ?? 'date';
  const display =
    options.iosDisplay ?? (mode === 'date' ? 'inline' : 'spinner');

  const accentColored = options.accentColor
    ? { color: options.accentColor }
    : null;

  const containerBg =
    options.themeVariant === 'dark'
      ? styles.containerDark
      : styles.containerLight;

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={() => onResult(null)}
    >
      <Pressable
        style={[styles.backdrop, backdropStyle]}
        onPress={() => onResult(null)}
      >
        <Pressable
          style={[styles.container, containerBg, containerStyle]}
          onPress={() => {}}
        >
          <DateTimePicker
            value={draft}
            mode={mode}
            onChange={(_e: DateTimePickerEvent, d?: Date) => {
              if (d) setDraft(d);
            }}
            minimumDate={options.min}
            maximumDate={options.max}
            themeVariant={options.themeVariant}
            textColor={options.textColor}
            accentColor={options.accentColor}
            display={display}
            is24Hour={options.is24Hour}
            style={styles.picker}
          />
          <View style={styles.footer}>
            <Pressable
              style={styles.doneBtn}
              onPress={() => onResult(draft)}
              accessibilityRole="button"
            >
              <Text style={[styles.doneText, accentColored, doneTextStyle]}>
                {options.doneLabel ?? 'Done'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    width: '90%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  containerLight: {
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  picker: {
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  doneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  doneText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
