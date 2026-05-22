import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  pickDate,
  pickTime,
  configureDateTimePicker,
  DateTimePickerHost,
} from 'rn-headless-datetime-picker';

configureDateTimePicker({
  accentColor: '#FFD443',
  doneLabel: 'Done',
});

export default function App() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  const onPickDate = async () => {
    const picked = await pickDate({
      initial: date ?? new Date(),
      min: new Date(2020, 0, 1),
      max: new Date(2030, 11, 31),
    });
    if (picked) setDate(picked);
  };

  const onPickTime = async () => {
    const picked = await pickTime({
      initial: time ?? new Date(),
      is24Hour: false,
    });
    if (picked) setTime(picked);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>rn-headless-datetime-picker</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {date ? date.toLocaleDateString() : '—'}
        </Text>
      </View>
      <Pressable style={styles.button} onPress={onPickDate}>
        <Text style={styles.buttonText}>Pick date</Text>
      </Pressable>

      <View style={[styles.row, styles.rowSpaced]}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>
          {time
            ? time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—'}
        </Text>
      </View>
      <Pressable style={styles.button} onPress={onPickTime}>
        <Text style={styles.buttonText}>Pick time</Text>
      </Pressable>

      <DateTimePickerHost />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: '#FAFAFA',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowSpaced: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#111',
  },
  button: {
    backgroundColor: '#FFD443',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
});
