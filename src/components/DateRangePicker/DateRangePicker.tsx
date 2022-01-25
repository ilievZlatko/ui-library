import { KeyboardConstants } from 'leanplum-lib-common';
import { DateTime, Interval } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { parseDateTime } from '../../utils/parseDateTime';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Button } from '../Button/Button';
import { Calendar } from '../Calendar/Calendar';
import { Icon } from '../icon/Icon';
import { TextInput } from '../TextInput/TextInput';
import { WrappedTextInput } from '../WrappedTextInput/WrappedTextInput';
import { DateRangeShortcuts } from './Shortcuts/DateRangeShortcuts';

import './DateRangePicker.scss';

interface LocalState {
  day?: DateTime | null;
  errorMessage?: string | null;
  dateString?: string;
}

@Component({ name: 'DateRangePicker' })
class DateRangePicker extends Vue {
  private static readonly EVENT_CHANGE = 'change';

  private static readonly DATE_FORMAT = 'MM/dd/yyyy';
  private static readonly DEFAULT_PLACEHOLDER = 'YYYY/MM/DD - YYYY/MM/DD';
  private static readonly INPUT_PLACEHOLDER: string = '__/__/____';
  private static readonly ACCEPTABLE_FORMATS: Array<string> = [
    DateRangePicker.DATE_FORMAT,
    'M/d/yyyy',
    'M-d-yyyy',
    'M/d/yy'
  ];

  private shouldShowDropdown: boolean = false;
  private rightMonth: DateTime | null = null;
  private localStart: DateTime | null = null;
  private localEnd: DateTime | null = null;
  private startInput: string = '';
  private endInput: string = '';
  private startInputErrorMessage: string | null = null;
  private endInputErrorMessage: string | null = null;

  @Prop({ required: false, default: null })
  readonly label: string | null;

  @Prop({ required: false, default: false })
  readonly disabled: boolean;

  @Prop({ required: false, default: false })
  readonly autoFocus: boolean;

  @Prop({ required: false, default: false })
  readonly outline: boolean;

  @Prop({ required: false, default: DateRangePicker.DEFAULT_PLACEHOLDER })
  readonly placeholder: string;

  @Prop({ type: Object, required: false, default: null })
  readonly range: Interval | null;

  @Prop({ type: Object, required: false, default: null })
  readonly excludeDatesBefore: DateTime | null;

  @Prop({ type: Object, required: false, default: null })
  readonly excludeDatesAfter: DateTime | null;

  @Prop({ type: Array, required: false, default: null })
  readonly quickOptions: Array<DateRangeShortcuts.Option> | null;

  private get shouldValidateEmptyValues(): boolean {
    // When both start and end are empty either:
    // - the user has edited the inputs manually -> validation has already been done.
    // - the user has selected a quick link that set them to null -> validation should not be done.
    return (!!this.localStart && !this.localEnd) || (!this.localStart && !!this.localEnd);
  }

  @Watch('range', { immediate: true })
  onValueChange(): void {
    this.resetLocalValues();
  }

  render(): VNode {
    const Input = this.label ? WrappedTextInput : TextInput;

    return (
      <AnchoredPopup
        class="lp-daterangepicker"
        onToggle={this.onClose}
        opened={this.shouldShowDropdown}
        placement={AnchoredPopup.Placement.BOTTOM}
      >
        <div class="lp-daterangepicker-anchor" slot="anchor" onClick={this.openDropdown} onKeydown={this.onKeydown}>
          <Input
            class={cx('lp-daterangepicker-input', { active: this.shouldShowDropdown, outline: this.outline })}
            readonly={true}
            label={this.label}
            placeholder={this.placeholder}
            autoFocus={this.autoFocus}
            value={this.appliedRange}
            disabled={this.disabled}
            onFocus={this.openDropdown}
          >
            {this.renderCalendarIcon()}
          </Input>
        </div>
        <div class="lp-daterangepicker-dropdown" slot="content">
          <div class="col">
            <div class="row">
              {this.quickOptions && <DateRangeShortcuts options={this.quickOptions} onSelect={this.onQuickSelect} />}
              <div class="col">
                <div class="lp-daterangepicker-header">
                  Period:
                  <TextInput
                    placeholder={DateRangePicker.INPUT_PLACEHOLDER}
                    value={this.startInput}
                    onInput={this.onStartInput}
                    error={this.startInputErrorMessage}
                  />
                  -
                  <TextInput
                    placeholder={DateRangePicker.INPUT_PLACEHOLDER}
                    value={this.endInput}
                    onInput={this.onEndInput}
                    error={this.endInputErrorMessage}
                  />
                </div>
                <div class="lp-daterangepicker-calendars">
                  <Calendar
                    shadow={false}
                    selected={this.selectedValues}
                    highlighted={this.highlighted}
                    currentMonth={this.displayedLeftMonth}
                    excludeDatesBefore={this.excludeDatesBefore}
                    excludeDatesAfter={this.excludeDatesAfter}
                    onUpdate={this.onUpdateCalendar}
                    onUpdateMonth={this.onClickLeftArrow}
                    showArrow={Calendar.Arrow.LEFT}
                    includeDaysOutsideMonth={false}
                  />
                  <Calendar
                    shadow={false}
                    selected={this.selectedValues}
                    highlighted={this.highlighted}
                    currentMonth={this.displayedRightMonth}
                    excludeDatesBefore={this.excludeDatesBefore}
                    excludeDatesAfter={this.excludeDatesAfter}
                    onUpdate={this.onUpdateCalendar}
                    onUpdateMonth={this.onClickRightArrow}
                    showArrow={Calendar.Arrow.RIGHT}
                    includeDaysOutsideMonth={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="lp-daterangepicker-footer">
            <Button color={Button.Color.LIGHT} text="Cancel" onClick={this.closeDropdown} />
            <Button color={Button.Color.PRIMARY} text="Apply" onClick={this.apply} />
          </div>
        </div>
      </AnchoredPopup>
    );
  }

  private renderCalendarIcon(): VNode {
    return (
      <div slot="after">
        <Icon type={Icon.Type.CALENDAR} clickable={!this.disabled} stopPropagation={false} />
      </div>
    );
  }

  private get start(): DateTime | null {
    return this.range && this.range.start;
  }

  private get end(): DateTime | null {
    return this.range && this.range.end;
  }

  private get highlighted(): Array<Interval> {
    if (!this.localStart || !this.localEnd) {
      return [];
    }

    return [Interval.fromDateTimes(this.localStart, this.localEnd)];
  }

  private get selectedValues(): Array<DateTime> {
    return [this.localStart, this.localEnd].filter((day): day is DateTime => day !== null);
  }

  private get displayedLeftMonth(): DateTime {
    return this.rightMonth || this.start || DateTime.local();
  }

  private get displayedRightMonth(): DateTime {
    return this.displayedLeftMonth.plus({ months: 1 });
  }

  private get appliedRange(): string {
    if (!this.start || !this.end) {
      return '';
    }

    return this.start.equals(this.end)
      ? DateRangePicker.formatDate(this.start)
      : `${DateRangePicker.formatDate(this.start)} - ${DateRangePicker.formatDate(this.end)}`;
  }

  private get minDate(): DateTime | null {
    return this.excludeDatesBefore;
  }

  private get maxDate(): DateTime | null {
    return this.excludeDatesAfter;
  }

  private parseDateString(dateString: string): LocalState {
    const date: DateTime | null = parseDateTime(dateString, DateRangePicker.ACCEPTABLE_FORMATS);
    let errorMessage: string | null = null;

    if (date) {
      if (this.maxDate && date > this.maxDate) {
        errorMessage = `Please choose a date on or before ${this.maxDate.toFormat(DateRangePicker.DATE_FORMAT)}`;
      }

      if (this.minDate && date < this.minDate) {
        errorMessage = `Please choose a date on or after ${this.minDate.toFormat(DateRangePicker.DATE_FORMAT)}`;
      }
    } else {
      errorMessage = 'Please enter a valid date';
    }

    return {
      day: date,
      dateString,
      errorMessage
    };
  }

  private isMonthVisible({ month, year }: DateTime): boolean {
    return (
      (this.displayedLeftMonth.month === month && this.displayedLeftMonth.year === year) ||
      (this.displayedRightMonth.month === month && this.displayedRightMonth.year === year)
    );
  }

  private onKeydown(e: KeyboardEvent): void {
    // Prevent event from bubbling to document listeners in popup.
    e.stopPropagation();

    // Handle ESC and TAB the same.
    switch (e.key) {
      case KeyboardConstants.ESC_KEY:
      case KeyboardConstants.TAB_KEY:
        this.closeDropdown();
        break;
      default:
        break;
    }
  }

  private onClose(): void {
    this.resetLocalValues();
    this.closeDropdown();
  }

  private onQuickSelect(interval: Interval | null): void {
    if (!interval) {
      this.setStartValues({ day: null });
      this.setEndValues({ day: null });

      return;
    }

    const { start, end } = interval;

    let endDay = end;
    if (this.excludeDatesAfter && this.excludeDatesAfter < end) {
      endDay = this.excludeDatesAfter;
    }

    this.setEndValues({ day: endDay });

    let startDay = start;
    if (this.excludeDatesBefore && start < this.excludeDatesBefore) {
      startDay = this.excludeDatesBefore;
    }

    this.setStartValues({ day: startDay });
  }

  private openDropdown(): void {
    if (!this.disabled) {
      this.shouldShowDropdown = true;
    }
  }

  private closeDropdown(): void {
    this.shouldShowDropdown = false;
  }

  private onStartInput(value: string): void {
    const state = this.parseDateString(value);

    if (state.day && this.localEnd && state.day > this.localEnd) {
      state.errorMessage = `Please choose a date on or before ${DateRangePicker.formatDate(this.localEnd)}`;
    }

    this.setStartValues(state);
  }

  private onEndInput(value: string): void {
    const state = this.parseDateString(value);

    if (state.day && this.localStart && this.localStart > state.day) {
      state.errorMessage = `Please choose a date on or after ${DateRangePicker.formatDate(this.localStart)}`;
    }

    this.setEndValues(state);
  }

  private onUpdateCalendar(value: DateTime): void {
    // We're trusting that the calendar obeys the min/max dates.

    // Reset end and set start.
    if (this.localEnd || !this.localStart || this.localStart > value) {
      this.setStartValues({ day: value });

      this.setEndValues();
    } else {
      // Set end.
      this.setEndValues({ day: value });
    }
  }

  private onClickLeftArrow(value: DateTime): void {
    this.rightMonth = value;
  }

  private onClickRightArrow(value: DateTime): void {
    this.rightMonth = value.minus({ months: 1 });
  }

  private setStartValues({ day, errorMessage, dateString }: LocalState = {}): void {
    this.localStart = day?.startOf('day') || null;
    this.startInput = dateString || DateRangePicker.formatDate(this.localStart);
    this.startInputErrorMessage = errorMessage || null;

    if (day && !this.isMonthVisible(day)) {
      this.rightMonth = day;
    }
  }

  private setEndValues({ day, errorMessage, dateString }: LocalState = {}): void {
    this.localEnd = day?.endOf('day') || null;
    this.endInput = dateString || DateRangePicker.formatDate(this.localEnd);
    this.endInputErrorMessage = errorMessage || null;

    if (day && !this.isMonthVisible(day)) {
      this.rightMonth = day.minus({ months: 1 });
    }
  }

  private resetLocalValues(): void {
    this.setEndValues({ day: this.end });
    this.setStartValues({ day: this.start });
  }

  private apply(): void {
    if (this.disabled || this.startInputErrorMessage || this.endInputErrorMessage) {
      return;
    }

    if (this.shouldValidateEmptyValues) {
      if (!this.localStart) {
        this.onStartInput('');
      }

      if (!this.localEnd) {
        this.onEndInput('');
      }

      return;
    }

    if (!this.localStart || !this.localEnd) {
      this.$emit(DateRangePicker.EVENT_CHANGE, null);
    } else if (!this.start || !this.end || !this.start.equals(this.localStart) || !this.end.equals(this.localEnd)) {
      this.$emit(DateRangePicker.EVENT_CHANGE, Interval.fromDateTimes(this.localStart, this.localEnd));
    }

    this.closeDropdown();
  }

  private static formatDate(value: DateTime | null): string {
    if (!value) {
      return '';
    }

    return value.toFormat(DateRangePicker.DATE_FORMAT);
  }
}

namespace DateRangePicker {
  export interface Props {
    range?: Interval | null;
    label?: string;
    disabled?: boolean;
    outline?: boolean;
    excludeDatesBefore?: DateTime;
    excludeDatesAfter?: DateTime;
    quickOptions?: Array<DateRangeShortcuts.Option>;
  }
}

export { DateRangePicker };
