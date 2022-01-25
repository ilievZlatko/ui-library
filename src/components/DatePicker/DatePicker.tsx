import isEqual from 'lodash/isEqual';
import { DateTime } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { parseDateTime } from '../../utils/parseDateTime';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Calendar } from '../Calendar/Calendar';
import { Icon } from '../icon/Icon';
import { TextInput } from '../TextInput/TextInput';
import { WrappedTextInput } from '../WrappedTextInput/WrappedTextInput';

@Component({ name: 'DatePicker' })
class DatePicker extends Vue {
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_FOCUS_OUT = 'focusOut';
  static readonly SUPPORTED_FORMATS = ['MM/dd/yyyy', 'MM/dd/yy', 'yyyy-MM-dd', 'dd.MM.yyyy'];
  static readonly DEFAULT_FORMAT = DatePicker.SUPPORTED_FORMATS[0];

  @Prop({ required: false })
  readonly label: string;

  @Prop({ type: Object, required: false, default: (): DateTime | null => null })
  readonly value: DateTime | null;

  @Prop({ type: [String, Array], required: false, default: null })
  readonly error: string | Array<string> | null;

  @Prop({ type: [String, Array], required: false, default: null })
  readonly warning: string | Array<string> | null;

  @Prop({ required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Object, required: false, default: (): DateTime | null => null })
  readonly excludeDatesBefore: DateTime | null;

  @Prop({ type: Object, required: false, default: (): DateTime | null => null })
  readonly excludeDatesAfter: DateTime | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly autoFocus: boolean;

  private isCalendarOpen: boolean = false;
  private currentMonth: DateTime | null = null;
  private inputText: string = '';
  private localValue: DateTime = DatePicker.defaultValue();
  private parsingError: string | null = null;

  private get selectedValues(): Array<DateTime> {
    return [this.localValue];
  }

  private get displayedMonth(): DateTime {
    return this.currentMonth ?? this.value ?? DateTime.local();
  }

  render(): VNode {
    const Input = this.label ? WrappedTextInput : TextInput;

    return (
      <AnchoredPopup
        class="lp-date-picker"
        onToggle={this.onClose}
        opened={this.isCalendarOpen}
        placement={AnchoredPopup.Placement.BOTTOM}
      >
        <Input
          slot="anchor"
          label={this.label}
          autoFocus={this.autoFocus}
          placeholder={DatePicker.DEFAULT_FORMAT}
          value={this.inputText}
          disabled={this.disabled}
          error={this.parsingError ?? this.error}
          warning={this.warning}
          onFocus={this.openCalendar}
          onInput={this.onInput}
          onBlur={this.onBlur}
          onSubmit={this.onClose}
        >
          <Icon slot="after" type={Icon.Type.CALENDAR} clickable={false} stopPropagation={false} />
        </Input>
        <div slot="content" onMousedown={(e: MouseEvent) => e.preventDefault()}>
          <Calendar
            selected={this.selectedValues}
            currentMonth={this.displayedMonth}
            excludeDatesBefore={this.excludeDatesBefore}
            excludeDatesAfter={this.excludeDatesAfter}
            onUpdate={this.onUpdateDay}
            onUpdateMonth={this.onUpdateMonth}
          />
        </div>
      </AnchoredPopup>
    );
  }

  private openCalendar(): void {
    this.isCalendarOpen = !this.disabled;
  }

  private closeCalendar(): void {
    this.isCalendarOpen = false;
  }

  private onClose(): void {
    this.closeCalendar();
    this.blurInput();
  }

  private applyChanges(): void {
    this.emitLocalValue();
    this.resetLocalState();
  }

  private onBlur(): void {
    this.applyChanges();
    this.emitFocusOut();
  }

  private onInput(value: string): void {
    let error: string | null = null;
    let date: DateTime | null = parseDateTime(value, DatePicker.SUPPORTED_FORMATS);

    if (date) {
      if (this.excludeDatesAfter && date > this.excludeDatesAfter) {
        error = `Please choose a date on or before ${this.excludeDatesAfter.toFormat(DatePicker.DEFAULT_FORMAT)}`;
        date = null;
      } else if (this.excludeDatesBefore && date < this.excludeDatesBefore) {
        error = `Please choose a date on or after ${this.excludeDatesBefore.toFormat(DatePicker.DEFAULT_FORMAT)}`;

        date = null;
      }
    } else {
      error = `Date should match one of the supported formats: ${DatePicker.SUPPORTED_FORMATS.join('\n')}`;
    }

    this.localValue = date ?? this.localValue;
    this.currentMonth = date;
    this.inputText = value;
    this.parsingError = error;
  }

  private onUpdateDay(value: DateTime): void {
    this.localValue = value;
    this.currentMonth = value;
    this.inputText = value.toFormat(DatePicker.DEFAULT_FORMAT);
    this.parsingError = null;

    this.onClose();
  }

  private onUpdateMonth(value: DateTime): void {
    this.currentMonth = value;
  }

  @Watch('value', { immediate: true })
  private resetLocalState(): void {
    this.localValue = this.value ?? DatePicker.defaultValue();
    this.currentMonth = this.value;
    this.parsingError = null;
    this.inputText = this.value?.toFormat(DatePicker.DEFAULT_FORMAT) ?? '';
  }

  private emitLocalValue(): void {
    if (!isEqual(this.value, this.localValue)) {
      this.$emit(DatePicker.EVENT_CHANGE, this.localValue);
    }
  }

  private emitFocusOut(): void {
    this.$emit(DatePicker.EVENT_FOCUS_OUT);
  }

  private blurInput(): void {
    this.$el.querySelector('input')?.blur();
  }

  private static defaultValue(): DateTime {
    return DateTime.local();
  }
}

namespace DatePicker {
  export interface Props {
    value?: DateTime | null;
    label?: string;
    disabled?: boolean;
    excludeDatesBefore?: DateTime | null;
    excludeDatesAfter?: DateTime | null;
  }
}

export { DatePicker };
