import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { DateTime } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TimePicker } from './TimePicker';

const flexRowStyle: Partial<CSSStyleDeclaration> = { display: 'inline-flex' };
const flextItemStyle: Partial<CSSStyleDeclaration> = { flex: '1 0 400px' };
const timePickerStyle: Partial<CSSStyleDeclaration> = { maxWidth: '210px' };

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private localValue: DateTime = DateTime.fromObject({ hour: 10, minute: 10 });

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <h4>With icon</h4>
        <div style={flexRowStyle}>
          <div style={flextItemStyle}>
            <TimePicker
              value={this.localValue}
              style={timePickerStyle}
              onChange={this.onChange}
              onFocusOut={action('focusOut')}
            />
          </div>
          <div style={flextItemStyle}>
            <TimePicker
              label="Time"
              value={this.localValue}
              style={timePickerStyle}
              onChange={this.onChange}
              onFocusOut={action('focusOut')}
            />
          </div>
        </div>
        <hr />
        <h4>Without icon</h4>
        <div style={flexRowStyle}>
          <div style={flextItemStyle}>
            <TimePicker
              value={this.localValue}
              showIcon={false}
              style={timePickerStyle}
              onChange={this.onChange}
              onFocusOut={action('focusOut')}
            />
          </div>
          <div style={flextItemStyle}>
            <TimePicker
              label="Time"
              value={this.localValue}
              showIcon={false}
              style={timePickerStyle}
              onChange={this.onChange}
              onFocusOut={action('focusOut')}
            />
          </div>
        </div>
        <hr />
        <h4>With error</h4>
        <div style={flexRowStyle}>
          <div style={flextItemStyle}>
            <TimePicker
              value={this.localValue}
              style={timePickerStyle}
              error="Something went wrong"
              onChange={this.onChange}
              onFocusOut={action('focusOut')}
            />
          </div>
          <div style={flextItemStyle}>
            <TimePicker
              label="Time"
              value={this.localValue}
              style={timePickerStyle}
              error="Something went wrong"
              onChange={this.onChange}
              onFocusOut={action('focusOut')}
            />
          </div>
        </div>
        <hr />
        <h4>Disabled</h4>
        <div style={flexRowStyle}>
          <div style={flextItemStyle}>
            <TimePicker disabled={true} value={this.localValue} style={timePickerStyle} />
          </div>
          <div style={flextItemStyle}>
            <TimePicker label="Time" disabled={true} value={this.localValue} style={timePickerStyle} />
          </div>
        </div>
        <StargateTarget />
      </div>
    );
  }

  private onChange(value: DateTime): void {
    action('change')(value);
    this.localValue = value;
  }
}

storiesOf(`${StorybookSection.DATE}/TimePicker`, module).add('Default', () => DefaultStory);
