import { DateTime } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../../utils/cx';

import './Day.scss';

@Component({ name: 'Day' })
class Day extends Vue {
  static readonly SATURDAY: number = 6;
  static readonly SUNDAY: number = 7;

  @Prop({ required: true })
  value: DateTime;

  @Prop({ required: false, default: false })
  selected: boolean;

  @Prop({ required: false, default: false })
  highlighted: boolean;

  @Prop({ required: false, default: true })
  includeDaysOutsideMonth: boolean;

  @Prop({ required: true })
  month: DateTime;

  @Prop({
    type: Object,
    required: false,
    default(): DateTime | null {
      return null;
    }
  })
  minDate: DateTime | null;

  @Prop({
    type: Object,
    required: false,
    default(): DateTime | null {
      return null;
    }
  })
  maxDate: DateTime | null;

  private get isBeforeMinDate(): boolean {
    return (
      !!this.minDate &&
      this.value < this.minDate
    );
  }

  private get isAfterMaxDate(): boolean {
    return (
      !!this.maxDate &&
      this.value > this.maxDate
    );
  }

  private get isDisabled(): boolean {
    return this.isBeforeMinDate || this.isAfterMaxDate;
  }

  private get isToday(): boolean {
    const today: DateTime = DateTime.local();
    const { year, month, day } = this.value;

    return year === today.year && month === today.month && day === today.day;
  }

  private get isWeekend(): boolean {
    return this.value.weekday === Day.SUNDAY || this.value.weekday === Day.SATURDAY;
  }

  private get isOutsideMonth(): boolean {
    return this.month && this.month.month !== this.value.month;
  }

  private get shouldDisplay(): boolean {
    return !this.isOutsideMonth || this.includeDaysOutsideMonth;
  }

  render(): VNode {
    return (
      <div
        class={cx('lp-day', {
          disabled: this.isDisabled,
          selected: !this.isOutsideMonth && this.selected,
          highlighted: this.highlighted,
          hidden: !this.shouldDisplay,
          today: !this.isOutsideMonth && this.isToday,
          weekend: this.isWeekend,
          'outside-month': this.isOutsideMonth
        })}
        onClick={this.selectDay}
      >
        <span class="label">{this.value.day}</span>
      </div>
    );
  }

  private selectDay(event: MouseEvent): void {
    if (!this.isDisabled && this.shouldDisplay) {
      this.$emit('update', this.value);
    }
  }
}

namespace Day {
  export interface Props {
    value: DateTime;
    month: DateTime;
    selected?: boolean;
    highlighted?: boolean;
    minDate?: DateTime;
    maxDate?: DateTime;
    includeDaysOutsideMonth?: boolean;
  }
}

export { Day };
