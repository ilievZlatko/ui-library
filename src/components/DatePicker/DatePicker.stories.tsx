import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { DateTime } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { DatePicker } from './DatePicker';

const flexStyle: Partial<CSSStyleDeclaration> = { display: 'flex', alignItems: 'center' };
const flexItemStyle: Partial<CSSStyleDeclaration> = { flex: '0 0 340px' };

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private today: DateTime = DateTime.local();
  private todayAsObject: DateTime = DateTime.local().startOf('day');
  private basicDate: DateTime = DateTime.local().startOf('day');
  private startDate: DateTime = DateTime.local().startOf('day');
  private endDate: DateTime = this.today.plus({ days: 7 });
  private emptyDate: DateTime | null = null;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <h5>Basic</h5>
        <div style={flexStyle}>
          <div style={flexItemStyle}>
            <DatePicker
              style={{ width: '300px' }}
              label="Start Date"
              value={this.basicDate}
              onChange={this.updateBasicDate}
              onFocusOut={action('focusOut')}
            />
          </div>
        </div>
        <hr />
        <h5>Min and Max dates</h5>
        <div style={flexStyle}>
          <div style={flexItemStyle}>
            <DatePicker
              style={{ width: '300px' }}
              label="Start Date"
              value={this.startDate}
              excludeDatesBefore={this.todayAsObject}
              excludeDatesAfter={this.endDate}
              onChange={this.updateMinMaxDate}
              onFocusOut={action('focusOut')}
            />
          </div>
        </div>
        <hr />
        <h5>Disabled</h5>
        <div style={flexStyle}>
          <DatePicker
            style={{ width: '300px' }}
            label="End Date"
            value={this.startDate}
            disabled={true}
            onFocusOut={action('focusOut')}
          />
        </div>
        <hr />
        <h5>Empty</h5>
        <div style={flexStyle}>
          <DatePicker
            style={{ width: '300px' }}
            label="End Date"
            value={this.emptyDate}
            onChange={this.updateEmptyDate}
            onFocusOut={action('focusOut')}
          />
        </div>
        <StargateTarget />
      </div>
    );
  }

  private updateBasicDate(newValue: DateTime): void {
    this.basicDate = newValue;
    action('change')(newValue);
  }

  private updateMinMaxDate(newValue: DateTime): void {
    this.startDate = newValue;
    action('change')(newValue);
  }

  private updateEmptyDate(newValue: DateTime): void {
    this.emptyDate = newValue;
    action('change')(newValue);
  }
}

@Component({ name: 'WithoutLabelStory' })
class WithoutLabelStory extends Vue {
  private basicDate: DateTime = DateTime.local().startOf('day');

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <h5>Without a label</h5>
        <div style={flexStyle}>
          <DatePicker
            style={{ width: '300px' }}
            value={this.basicDate}
            onChange={this.updateBasicDate}
            onFocusOut={action('focusOut')}
          />
        </div>
        <hr />
        <h5>Disabled</h5>
        <div style={flexStyle}>
          <DatePicker
            style={{ width: '300px' }}
            value={this.basicDate}
            disabled={true}
            onFocusOut={action('focusOut')}
          />
        </div>
        <hr />
        <h5>Empty</h5>
        <div style={flexStyle}>
          <DatePicker
            style={{ width: '300px' }}
            value={null}
            onChange={this.updateBasicDate}
            onFocusOut={action('focusOut')}
          />
        </div>
        <StargateTarget />
      </div>
    );
  }

  private updateBasicDate(newValue: DateTime): void {
    this.basicDate = newValue;
    action('change')(newValue);
  }
}

storiesOf(`${StorybookSection.DATE}/DatePicker`, module)
  .add('Default', () => DefaultStory)
  .add('Without a label', () => WithoutLabelStory);
