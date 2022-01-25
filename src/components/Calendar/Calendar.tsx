import values from 'lodash/values';
import { DateTime, Interval } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';
import { Day } from './Day/Day';
import { getAllSundaysForDisplayedMonth } from './util/getAllSundaysForDisplayedMonth';
import { getDaysOfWeek } from './util/getDaysOfWeek';

import './Calendar.scss';

const DAYS_OF_WEEK: Array<string> = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

@Component({ name: 'Calendar' })
class Calendar extends Vue {
  static readonly EVENT_UPDATE: string = 'update';
  static readonly EVENT_UPDATE_MONTH: string = 'updateMonth';

  @Prop({ required: true })
  readonly currentMonth: DateTime;

  @Prop({
    required: false,
    default: (): Array<DateTime> => []
  })
  readonly selected: Array<DateTime>;

  @Prop({
    required: false,
    default: (): Array<Interval> => []
  })
  readonly highlighted: Array<Interval>;

  @Prop({ required: false, default: true })
  readonly includeDaysOutsideMonth: boolean;

  @Prop({
    type: Object,
    required: false,
    default: null
  })
  readonly excludeDatesBefore: DateTime | null;

  @Prop({
    type: Object,
    required: false,
    default: null
  })
  readonly excludeDatesAfter: DateTime | null;

  @Prop({
    type: String,
    required: false,
    default: 'both',
    validator(value: Calendar.Arrow): boolean {
      return values(Calendar.Arrow).indexOf(value) > -1;
    }
  })
  readonly showArrow: Calendar.Arrow;

  @Prop({
    type: Boolean,
    required: false,
    default(): boolean {
      return true;
    }
  })
  shadow: boolean;

  private get currentMonthInDateTime(): DateTime {
    const { year, month, day } = this.currentMonth;

    return DateTime.local(year, month, day);
  }

  private get weeks(): Array<DateTime> {
    return getAllSundaysForDisplayedMonth(this.currentMonth.startOf('month'));
  }

  private get currentMonthLabel(): string {
    return this.currentMonthInDateTime.toFormat('MMMM yyyy');
  }

  private get shouldShowLeftButton(): boolean {
    return this.showArrow === Calendar.Arrow.BOTH || this.showArrow === Calendar.Arrow.LEFT;
  }

  private get shouldShowRightButton(): boolean {
    return this.showArrow === Calendar.Arrow.BOTH || this.showArrow === Calendar.Arrow.RIGHT;
  }

  render(): VNode {
    return (
      <div class={cx('lp-calendar', { shadow: this.shadow })}>
        <div class="lp-calendar-header">
          <div class="lp-calendar-controls">
            {this.shouldShowLeftButton && (
              <div class="nav prev" onClick={this.onClickPrevButton} data-testid="prev">
                <Icon type={Icon.Type.ARROW_LEFT} stopPropagation={false} />
              </div>
            )}
            <div class="current">
              <span class="text">{this.currentMonthLabel}</span>
            </div>
            {this.shouldShowRightButton && (
              <div class="nav next" onClick={this.onClickNextButton} data-testid="next">
                <Icon type={Icon.Type.ARROW_RIGHT} stopPropagation={false} />
              </div>
            )}
          </div>
        </div>
        <div class="lp-calendar-month">
          <div class="lp-calendar-day-names">
            {DAYS_OF_WEEK.map(
              (name: string, index: number): VNode => (
                <div class="day-name" key={index}>
                  {name}
                </div>
              )
            )}
          </div>
          {this.weeks.map(
            (week: DateTime, index: number): VNode => (
              <div class="lp-calendar-week" key={index} data-testid="week">
                {getDaysOfWeek(week).map((currentDay: DateTime, idx: number) => (
                  <Day
                    key={idx}
                    class={cx({ start: this.isStartOfHighlight(currentDay) })}
                    value={currentDay}
                    selected={this.isDaySelected(currentDay)}
                    highlighted={this.isDayHighlighted(currentDay)}
                    includeDaysOutsideMonth={this.includeDaysOutsideMonth}
                    minDate={this.excludeDatesBefore}
                    maxDate={this.excludeDatesAfter}
                    month={this.currentMonth}
                    onUpdate={this.onUpdateValue}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  private onClickPrevButton(): void {
    this.updateCurrentMonth(this.currentMonthInDateTime.minus({ months: 1 }));
  }

  private onClickNextButton(): void {
    this.updateCurrentMonth(this.currentMonthInDateTime.plus({ months: 1 }));
  }

  private onUpdateValue(date: DateTime): void {
    this.setSelectedDay(date);
  }

  private setSelectedDay(date: DateTime): void {
    this.updateCurrentMonth(date);
    this.updateValue(date);
  }

  private isDaySelected(date: DateTime): boolean {
    return this.selected.some((selectedDay: DateTime): boolean => {
      return selectedDay.year === date.year && selectedDay.month === date.month && selectedDay.day === date.day;
    });
  }

  private isStartOfHighlight(date: DateTime): boolean {
    return this.highlighted.some((interval: Interval): boolean => {
      if (!interval || !interval.start) {
        return false;
      }

      const { year, month, day } = interval.start;

      return year === date.year && month === date.month && day === date.day;
    });
  }

  private isDayHighlighted(date: DateTime): boolean {
    return this.highlighted.some((interval: Interval): boolean => {
      if (!interval.isValid) {
        return false;
      }
      const day = DateTime.local(date.year, date.month, date.day);

      // Luxon's Intervals are half-closed, so we must cover the case where the day === the end of the interval.
      return interval.length('days') >= 1 && (interval.contains(day) || interval.end.equals(day));
    });
  }

  private updateCurrentMonth(value: DateTime): void {
    this.$emit(Calendar.EVENT_UPDATE_MONTH, value);
  }

  private updateValue(value: DateTime): void {
    this.$emit(Calendar.EVENT_UPDATE, value);
  }
}

namespace Calendar {
  export enum Arrow {
    RIGHT = 'right',
    LEFT = 'left',
    BOTH = 'both'
  }

  export interface Props {
    currentMonth: DateTime;
    selected?: Array<DateTime>;
    highlighted?: Array<Interval>;
    includeDaysOutsideMonth?: boolean;
    excludeDatesBefore?: DateTime;
    excludeDatesAfter?: DateTime;
    showArrow?: Calendar.Arrow;
  }
}

export { Calendar };
