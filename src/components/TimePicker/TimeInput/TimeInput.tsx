import { DateTimeConstants } from 'leanplum-lib-common';
import { DateTime } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { IncrementalInput } from '../IncrementalInput/IncrementalInput';

import './TimeInput.scss';

@Component({ name: 'TimeInput' })
class TimeInput extends Vue {
  static readonly EVENT_CHANGE: string = 'change';

  @Prop({ type: Object, required: true })
  readonly value!: DateTime;

  @Prop({ required: false, default: 5 })
  readonly minuteIncrement: number;

  @Prop({ required: false, default: false })
  readonly disabled: boolean;

  private localValue: DateTime = this.value;
  private hour: string = this.localValue.toFormat('hh');
  private minute: string = this.localValue.toFormat('mm');
  private hourError: string | null = null;
  private minuteError: string | null = null;

  private get periodLabel(): string {
    return this.localValue.toFormat('a');
  }

  private get isPM(): boolean {
    return this.localValue.toFormat('a') === DateTimeConstants.PM;
  }

  @Watch('value')
  onChangeValue(newValue: DateTime): void {
    if (this.localValue.toMillis() !== newValue.toMillis()) {
      this.localValue = newValue;
      this.format();
    }
  }

  render(): VNode {
    return (
      <div class="lp-time-input">
        <div class="lp-time-input-controls">
          <IncrementalInput
            class="hour"
            value={this.hour}
            error={this.hourError}
            disabled={this.disabled}
            onUp={this.incrementHour}
            onDown={this.decrementHour}
            onChange={this.onChangeHour}
          />
          <div class="separator">
            <span>:</span>
          </div>
          <IncrementalInput
            class="minute"
            value={this.minute}
            error={this.minuteError}
            disabled={this.disabled}
            onUp={this.incrementMinute}
            onDown={this.decrementMinute}
            onChange={this.onChangeMinute}
          />
          <IncrementalInput
            class="meridian"
            value={this.periodLabel}
            disabled={this.disabled}
            readonly={true}
            onUp={this.togglePeriod}
            onDown={this.togglePeriod}
          />
        </div>
      </div>
    );
  }

  private incrementHour(): void {
    this.updateLocalValue(this.localValue.plus({ hours: 1 }));
    this.format();
  }

  private decrementHour(): void {
    this.updateLocalValue(this.localValue.minus({ hours: 1 }));
    this.format();
  }

  private onChangeHour(newValue: string): void {
    this.hour = newValue;
    const value = Number(newValue);

    if (isFinite(value) && value >= 1 && value <= 12) {
      this.updateLocalValue(
        this.localValue.set({ hour: value + (this.isPM ? DateTimeConstants.HOURS_PER_HALF_DAY : 0) })
      );
      this.hourError = null;
    } else {
      this.hourError = 'Value should be a number between 1 and 12';
    }
  }

  private incrementMinute(): void {
    this.updateLocalValue(this.localValue.plus({ minutes: this.minuteIncrement }));
    this.format();
  }

  private decrementMinute(): void {
    this.updateLocalValue(this.localValue.minus({ minutes: this.minuteIncrement }));
    this.format();
  }

  private onChangeMinute(newValue: string): void {
    this.minute = newValue;
    const value = Number(newValue);

    if (isFinite(value) && value >= 0 && value <= 59) {
      this.updateLocalValue(this.localValue.set({ minute: value }));
      this.minuteError = null;
    } else {
      this.minuteError = 'Value should be a number between 0 and 59';
    }
  }

  private togglePeriod(): void {
    this.updateLocalValue(this.localValue.plus({ hours: DateTimeConstants.HOURS_PER_HALF_DAY }));
    this.format();
  }

  private updateLocalValue({ hour, minute }: DateTime): void {
    this.localValue = this.localValue.set({ hour, minute });

    this.emitLocalValue();
  }

  private emitLocalValue(): void {
    this.$emit(TimeInput.EVENT_CHANGE, this.localValue.set({ second: 0, millisecond: 0 }));
  }

  private format(): void {
    this.hour = this.localValue.toFormat('hh');
    this.minute = this.localValue.toFormat('mm');

    this.hourError = null;
    this.minuteError = null;
  }
}

namespace TimeInput {
  export interface Props {
    value: DateTime;
    minuteIncrement?: number;
    disabled?: boolean;
  }
}

export { TimeInput };
