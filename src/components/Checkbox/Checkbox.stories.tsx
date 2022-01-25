import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Feedback } from '../Feedback/Feedback';
import { Guide } from '../Guide/Guide';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Checkbox } from './Checkbox';

@Component({ name: 'DefaultCheckboxStory' })
class DefaultCheckboxStory extends Vue {
  change: Function = action(Checkbox.EVENT_CHANGE);

  private checkedSlot: boolean = false;
  private checkedIndeterminate: boolean = true;

  render(): VNode {
    return (
      <div>
        <div class="lp-storybook-wrapper" style="padding: 8px 16px;">
          <h5>On a white background</h5>

          <Checkbox text="Checked enabled" checked={true} disabled={false} />
          <Checkbox text="Checked disabled" checked={true} disabled={true} />
          <Checkbox text="Indeterminate enabled" indeterminate={true} disabled={false} />
          <Checkbox text="Indeterminate disabled" indeterminate={true} disabled={true} />
          <Checkbox text="Unchecked enabled" checked={false} disabled={false} />
          <Checkbox text="Unchecked disabled" checked={false} disabled={true} />
        </div>

        <div class="lp-storybook-wrapper" style="background-color: #F6F9FB; padding: 8px 16px; margin-bottom: 16px;">
          <h5>On a gray background</h5>
          <Checkbox text="Checked enabled" checked={true} disabled={false} />
          <Checkbox text="Checked disabled" checked={true} disabled={true} />
          <Checkbox text="Indeterminate enabled" indeterminate={true} disabled={false} />
          <Checkbox text="Indeterminate disabled" indeterminate={true} disabled={true} />
          <Checkbox text="Unchecked enabled" checked={false} disabled={false} />
          <Checkbox text="Unchecked disabled" checked={false} disabled={true} />
        </div>

        <div class="lp-storybook-wrapper" style="padding: 8px 16px; width: 300px;">
          <h5>Other use-cases</h5>

          <Checkbox
            checked={this.checkedSlot}
            onChange={(c: boolean) => this.change(this.checkedSlot = c)}
          >
            <div style="display: inline-flex; align-items: center;">
              Checkbox with a slot
              <Guide
                style="display: inline-block"
                type={Feedback.Type.INFO}
                message="Allows help information through a Guide"
                placement={AnchoredPopup.Placement.RIGHT}
              />
            </div>
          </Checkbox>

          <Checkbox
            text="Indeterminate state"
            indeterminate={this.checkedIndeterminate}
            onChange={(c: boolean) => this.change(this.checkedIndeterminate = c)}
          />

          <Checkbox
            text="Long text that spans across multiple lines to check alignment"
            checked={true}
          />
        </div>

        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'CheckboxKnobStory' })
class CheckboxKnobStory extends Vue {
  onChange: Function = action(Checkbox.EVENT_CHANGE);

  @Prop({ type: String, required: false, default: () => text('text', 'Checkbox text') })
  readonly text: string | null;

  @Prop({ type: Boolean, required: false, default: () => boolean('checked', false) })
  readonly checked: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('indeterminate', false) })
  readonly indeterminate: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('stopPropagation', false) })
  readonly stopPropagation: boolean;

  render(): VNode {
    return (
      <Checkbox
        text={this.text}
        checked={this.checked}
        disabled={this.disabled}
        stopPropagation={this.stopPropagation}
        onChange={this.onChange}
      />
    );
  }
}

storiesOf(`${StorybookSection.INPUT}/Checkbox`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultCheckboxStory)
  .add('Knob Story', () => CheckboxKnobStory);
