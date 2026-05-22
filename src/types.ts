export type PickerMode = 'date' | 'time';

export type IosDisplay = 'default' | 'inline' | 'spinner' | 'compact';

export type AndroidDisplay = 'default' | 'spinner' | 'calendar' | 'clock';

export interface PickDateTimeOptions {
  mode?: PickerMode;
  initial?: Date;
  min?: Date;
  max?: Date;
  accentColor?: string;
  themeVariant?: 'light' | 'dark';
  textColor?: string;
  doneLabel?: string;
  is24Hour?: boolean;
  iosDisplay?: IosDisplay;
  androidDisplay?: AndroidDisplay;
}

export interface PickerRequest {
  id: string;
  options: PickDateTimeOptions;
  resolve: (date: Date | null) => void;
}
