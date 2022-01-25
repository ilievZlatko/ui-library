import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { DateTime, Interval } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Calendar } from './Calendar';

const flexRowStyle: Partial<CSSStyleDeclaration> = { display: 'inline-flex', height: '425px' };
const flexItemStyle: Partial<CSSStyleDeclaration> = { flex: '1 1 400px', marginRight: '20px' };
const lastMonth: DateTime = DateTime.local()
  .minus({ months: 1 })
  .startOf('month');

@Component({ name: 'CalendarStory' })
class CalendarStory extends Vue {
  private selectedDay: DateTime = lastMonth.set({ day: 7 });
  private currentMonth: DateTime = lastMonth.set({});
  private highlighted: Interval = Interval.fromDateTimes(lastMonth.set({ day: 10 }), lastMonth.set({ day: 20 }));
  private minDate: DateTime = lastMonth.set({ day: 7 });
  private maxDate: DateTime = lastMonth.set({ day: 21 });

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div style={flexRowStyle}>
          <div style={flexItemStyle}>
            <h5>No Selection</h5>
            <Calendar currentMonth={this.currentMonth} onUpdate={this.onUpdate} onUpdateMonth={this.onUpdateMonth} />
          </div>

          <div style={flexItemStyle}>
            <h5>Selected</h5>
            <Calendar
              currentMonth={this.currentMonth}
              selected={[this.selectedDay]}
              onUpdate={this.onUpdate}
              onUpdateMonth={this.onUpdateMonth}
            />
          </div>
        </div>
        <div style={flexRowStyle}>
          <div style={flexItemStyle}>
            <h5>Highlighted</h5>
            <Calendar
              currentMonth={this.currentMonth}
              selected={[this.highlighted.start, this.highlighted.end]}
              highlighted={[this.highlighted]}
              onUpdate={this.onUpdate}
              onUpdateMonth={this.onUpdateMonth}
            />
          </div>
          <div style={flexItemStyle}>
            <h5>Min / Max dates</h5>
            <Calendar
              currentMonth={this.currentMonth}
              selected={[this.selectedDay]}
              excludeDatesBefore={this.minDate}
              excludeDatesAfter={this.maxDate}
              onUpdate={this.onUpdate}
              onUpdateMonth={this.onUpdateMonth}
            />
          </div>
        </div>
      </div>
    );
  }

  private onUpdateMonth(day: DateTime): void {
    this.currentMonth = day;
    action('updateMonth')(day);
  }

  private onUpdate(day: DateTime): void {
    action('update')(day);
  }
}

storiesOf(`${StorybookSection.DATE}/Calendar`, module).add('Default', () => CalendarStory);
