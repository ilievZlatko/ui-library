import isEqual from 'lodash/isEqual';
import { DateTime, Info } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Dropdown } from '../Dropdown/Dropdown';
import { NumberInput } from '../NumberInput/NumberInput';
import { Pill } from '../Pill/Pill';

import './PartialDatePicker.scss';

@Component({ name: 'PartialDatePicker' })
class PartialDatePicker extends Vue {
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_FOCUS_OUT = 'focusOut';

  static readonly MONTH_OPTIONS = Info.months('long').map((label, i) => ({ label, value: i + 1 }));

  @Prop({ type: Object, required: false, default: null })
  readonly value: PartialDatePicker.PartialDate | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly requireYear: boolean;

  @Prop({ type: String, required: false, default: '' })
  readonly dayInputError: string;

  @Prop({ type: String, required: false, default: '' })
  readonly monthInputError: string;

  private internalDay: number | null = null;
  private internalMonth: number | null = null;

  private get maxDay(): number {
    if (!this.internalMonth) {
      return 31;
    }

    return DateTime.local()
      .set({ year: 2020, month: this.internalMonth })
      .endOf('month')
      .get('day');
  }

  private get monthLabel(): string | null {
    return PartialDatePicker.MONTH_OPTIONS.find((x) => x.value === this.internalMonth)?.label ?? null;
  }

  private get internalValue(): PartialDatePicker.PartialDate {
    return {
      day: this.internalDay,
      month: this.internalMonth
    };
  }

  private get internalDayInputError(): string {
    if (!this.internalDay) {
      return '';
    }

    if (this.internalDay > this.maxDay) {
      return `Day value can not be over ${this.maxDay} for the month of ${this.monthLabel}`;
    }

    return '';
  }

  @Watch('value', { immediate: true })
  onValueChange(): void {
    this.internalDay = this.value?.day || null;
    this.internalMonth = this.value?.month || null;
  }

  render(): VNode {
    return (
      <div class="lp-partial-date-picker">
        <NumberInput
          class="lp-partial-date-picker-day-input"
          placeholder="Day"
          value={this.internalDay}
          min={1}
          max={this.maxDay}
          hideArrows={false}
          disabled={this.disabled}
          error={this.internalDayInputError || this.dayInputError}
          useIconForFeedback={false}
          onInput={this.onDayInput}
          onFocusOut={this.emitFocusOut}
        />
        <Dropdown options={PartialDatePicker.MONTH_OPTIONS} disabled={this.disabled} onSelect={this.onSelect}>
          <Pill
            placeholder="Month"
            text={this.monthLabel}
            disabled={this.disabled}
            showClose={false}
            focusable={true}
            error={this.monthInputError}
          />
        </Dropdown>
      </div>
    );
  }

  private onDayInput(value: number | null): void {
    this.internalDay = value;
    this.emitChange();
  }

  private onSelect({ value }: Dropdown.Item<number>): void {
    this.internalMonth = value!;
    this.emitChange();
    this.emitFocusOut();
  }

  private emitFocusOut(): void {
    this.$emit(PartialDatePicker.EVENT_FOCUS_OUT);
  }

  private emitChange(): void {
    if (isEqual(this.internalValue, this.value)) {
      return;
    }

    this.$emit(PartialDatePicker.EVENT_CHANGE, this.internalValue);
  }
}

namespace PartialDatePicker {
  export interface PartialDate {
    /**
     * starts from 1
     */
    day?: number | null;

    /**
     * starts from 1
     */
    month?: number | null;
  }
}

export { PartialDatePicker };
