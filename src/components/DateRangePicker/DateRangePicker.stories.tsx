import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { DateTime, Interval } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { DateRangePicker } from './DateRangePicker';
import { DateRangeShortcuts } from './Shortcuts/DateRangeShortcuts';

const flexStyle: Partial<CSSStyleDeclaration> = { display: 'flex', alignItems: 'center' };
const flexItemStyle: Partial<CSSStyleDeclaration> = { flex: '0 0 340px' };

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private range: Interval = Interval.fromDateTimes(DateTime.local(), DateTime.local().plus({ months: 1 }));

  private minMax: Interval = Interval.fromDateTimes(
    DateTime.local().minus({ days: 4 }),
    DateTime.local().plus({ months: 1, days: 4 })
  );

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <h5>Basic</h5>
        <div style={flexStyle}>
          <div style={flexItemStyle}>
            <DateRangePicker
              style={{ width: '300px' }}
              label="Start Date"
              range={this.range}
              onChange={this.updateBasicDate}
            />
          </div>
        </div>
        <hr />
        <h5>With quick selections</h5>
        <div style={flexStyle}>
          <div style={flexItemStyle}>
            <DateRangePicker
              style={{ width: '300px' }}
              label="Start Date"
              range={this.range}
              onChange={this.updateBasicDate}
              quickOptions={DateRangeShortcuts.DEFAULT}
            />
          </div>
        </div>
        <hr />
        <h5>Min and Max dates</h5>
        <div style={flexStyle}>
          <DateRangePicker
            style={{ width: '300px' }}
            label="End Date"
            range={this.range}
            excludeDatesBefore={this.minMax.start}
            excludeDatesAfter={this.minMax.end}
          />
        </div>
        <hr />
        <h5>With quick selections and Min and Max dates</h5>
        <div style={flexStyle}>
          <div style={flexItemStyle}>
            <DateRangePicker
              style={{ width: '300px' }}
              label="Start Date"
              range={this.range}
              excludeDatesBefore={this.minMax.start}
              excludeDatesAfter={this.minMax.end}
              onChange={this.updateBasicDate}
              quickOptions={DateRangeShortcuts.DEFAULT}
            />
          </div>
        </div>
        <hr />
        <h5>Disabled</h5>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} label="End Date" range={this.range} disabled={true} />
        </div>
        <hr />
        <h5>Empty</h5>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} label="End Date" onChange={this.updateBasicDate} />
        </div>
        <hr />
        <h5>Outline</h5>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} label="End Date" range={this.range} outline={true} />
        </div>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} label="End Date" range={this.range} outline={true} disabled={true} />
        </div>
        <StargateTarget />
      </div>
    );
  }

  private updateBasicDate(value: Interval): void {
    this.range = value;
    action('change')(value);
  }
}

@Component({ name: 'WithoutLabelStory' })
class WithoutLabelStory extends Vue {
  private range: Interval = Interval.fromDateTimes(DateTime.local(), DateTime.local().plus({ months: 1 }));

  private minMax: Interval = Interval.fromDateTimes(
    DateTime.local().minus({ days: 4 }),
    DateTime.local().plus({ months: 1, days: 4 })
  );

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <h5>Without a label</h5>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} range={this.range} onChange={this.updateBasicDate} />
        </div>
        <hr />
        <h5>With quick selections</h5>
        <div style={flexStyle}>
          <div style={flexItemStyle}>
            <DateRangePicker
              style={{ width: '300px' }}
              range={this.range}
              onChange={this.updateBasicDate}
              quickOptions={DateRangeShortcuts.DEFAULT}
            />
          </div>
        </div>
        <hr />
        <h5>Min and Max dates</h5>
        <div style={flexStyle}>
          <DateRangePicker
            style={{ width: '300px' }}
            range={this.range}
            excludeDatesBefore={this.minMax.start}
            excludeDatesAfter={this.minMax.end}
          />
        </div>
        <hr />
        <h5>With quick selections and Min and Max dates</h5>
        <div style={flexStyle}>
          <div style={flexItemStyle}>
            <DateRangePicker
              style={{ width: '300px' }}
              range={this.range}
              excludeDatesBefore={this.minMax.start}
              excludeDatesAfter={this.minMax.end}
              onChange={this.updateBasicDate}
              quickOptions={DateRangeShortcuts.DEFAULT}
            />
          </div>
        </div>
        <hr />
        <h5>Disabled</h5>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} range={this.range} disabled={true} />
        </div>
        <hr />
        <h5>Empty</h5>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} onChange={this.updateBasicDate} />
        </div>
        <hr />
        <h5>Outline</h5>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} range={this.range} outline={true} />
        </div>
        <div style={flexStyle}>
          <DateRangePicker style={{ width: '300px' }} range={this.range} outline={true} disabled={true} />
        </div>
        <StargateTarget />
      </div>
    );
  }

  private updateBasicDate(value: Interval): void {
    this.range = value;
    action('change')(value);
  }
}

storiesOf(`${StorybookSection.DATE}/DateRangePicker`, module)
  .add('Default', () => DefaultStory)
  .add('Without a label', () => WithoutLabelStory);
