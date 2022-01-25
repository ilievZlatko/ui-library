import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { ColorPicker } from './ColorPicker';

@Component({ name: 'DefaultColorPickerStory' })
class DefaultColorPickerStory extends Vue {
  value: string = 'rgba(125, 125, 125, 1)';

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div style={{ width: '500px' }}>
          <ColorPicker label="With a label" value={null} defaultValue={null} />
        </div>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'ColorPickerKnobStory' })
class ColorPickerKnobStory extends Vue {
  onClear = action('onClear');
  onInput = action('onInput');
  onChange = action('onChange');

  @Prop({ type: String, required: false, default: () => text('label', 'Example Label') })
  label: string | null;

  @Prop({ type: String, required: false, default: () => text('defaultValue', 'rgba(255, 255, 255, 0)') })
  defaultValue: string | null;

  @Prop({ type: String, required: false, default: () => text('value', 'rgba(125, 125, 125, 1)') })
  value: string | null;

  @Prop({ type: String, required: false, default: () => text('error', null) })
  error: string | null;

  @Prop({ required: false, default: () => boolean('disabled', false) })
  disabled: boolean;

  @Prop({ required: false, default: () => boolean('readonly', false) })
  readonly: boolean;

  @Prop({ required: false, default: () => boolean('clearButton', false) })
  clearButton: boolean;

  render(): VNode {
    return (
      <div>
        <ColorPicker
          style="width: 500px"
          label={this.label}
          defaultValue={this.defaultValue}
          value={this.value}
          error={this.error}
          disabled={this.disabled}
          readonly={this.readonly}
          clearButton={this.clearButton}
          onClear={this.onClear}
          onChange={this.onChange}
          onInput={this.onInput}
        />
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.INPUT}/ColorPicker`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => () => ColorPickerKnobStory)
  .add('Default', () => DefaultColorPickerStory);
