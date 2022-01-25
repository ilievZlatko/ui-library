import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { PartialDatePicker } from './PartialDatePicker';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private value: PartialDatePicker.PartialDate = {
    day: 12,
    month: 10
  };
  private noDayValue: PartialDatePicker.PartialDate = {
    day: null,
    month: 10
  };
  private noMonthValue: PartialDatePicker.PartialDate = {
    day: 12,
    month: null
  };
  private invalidValue: PartialDatePicker.PartialDate = {
    day: 30,
    month: 2
  };
  private emptyValue: PartialDatePicker.PartialDate | null = null;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <h5>Basic</h5>
        <PartialDatePicker value={this.value} onChange={action('change')} onFocusOut={action('focusOut')} />
        <h5>Without year input</h5>
        <PartialDatePicker
          value={this.value}
          requireYear={false}
          onChange={action('change')}
          onFocusOut={action('focusOut')}
        />
        <hr />
        <h5>Disabled</h5>
        <PartialDatePicker value={this.value} disabled={true} onFocusOut={action('focusOut')} />
        <hr />
        <h5>Empty</h5>
        <PartialDatePicker value={this.emptyValue} onChange={action('change')} onFocusOut={action('focusOut')} />
        <hr />
        <h5>With day input error</h5>
        <PartialDatePicker
          value={this.noDayValue}
          dayInputError="Day is required."
          onChange={action('change')}
          onFocusOut={action('focusOut')}
        />
        <hr />
        <h5>With month input error</h5>
        <PartialDatePicker
          value={this.noMonthValue}
          monthInputError="Month is required."
          onChange={action('change')}
          onFocusOut={action('focusOut')}
        />
        <hr />
        <h5>With invalid value</h5>
        <PartialDatePicker value={this.invalidValue} onChange={action('change')} onFocusOut={action('focusOut')} />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'KnobStory' })
class KnobStory extends Vue {
  @Prop({ default: () => number('day', 12, { min: 1, max: 31, step: 1, range: true }) })
  readonly day: number;

  @Prop({ default: () => number('month', 10, { min: 1, max: 12, step: 1, range: true }) })
  readonly month: number;

  @Prop({ default: () => number('month', 10, { min: 1970, max: Infinity, step: 1, range: false }) })
  readonly year: number;

  @Prop({ default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ default: () => boolean('require year', false) })
  readonly requireYear: boolean;

  @Prop({ default: () => text('day input error', '') })
  readonly dayInputError: string;

  @Prop({ default: () => text('month input error', '') })
  readonly monthInputError: string;

  @Prop({ default: () => text('year input error', '') })
  readonly yearInputError: string;

  private get value(): PartialDatePicker.PartialDate {
    return { day: this.day, month: this.month };
  }

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <PartialDatePicker
          value={this.value}
          disabled={this.disabled}
          requireYear={this.requireYear}
          dayInputError={this.dayInputError}
          monthInputError={this.monthInputError}
          yearInputError={this.yearInputError}
          onChange={action('change')}
          onFocusOut={action('focusOut')}
        />
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.DATE}/PartialDatePicker`, module)
  .add('Default', () => DefaultStory)
  .addDecorator(withKnobs)
  .add('Knob Story', () => KnobStory);
