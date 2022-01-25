import { action } from '@storybook/addon-actions';
import { array, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { SplitButton } from './SplitButton';

const options = ['item1', 'item2', 'item3'].map((label) => ({ label }));
const onClick = action('onClick');
const onSelect = action('onSelect');

@Component({ name: 'DefaultSplitButtonStory' })
class DefaultSplitButtonStory extends Vue {
  render(): VNode {
    return (
      <div>
        <SplitButton options={options} onClick={onClick} onSelect={onSelect} />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'OneItemStory' })
class OneItemStory extends Vue {
  render(): VNode {
    return (
      <div>
        <SplitButton options={options.slice(0, 1)} onClick={onClick} onSelect={onSelect} />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'SplitButtonKnobStory' })
class SplitButtonKnobStory extends Vue {
  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('color', SplitButton.Color, SplitButton.Color.LIGHT)
  })
  color: SplitButton.Color;

  @Prop({ type: String, required: false, default: () => text('text', 'Click me') })
  text: string | null;

  @Prop({ required: true, type: Array, default: () => array('options', options) })
  readonly options: Array<SplitButton.Item> | Array<string>;

  render(): VNode {
    return (
      <div>
        <SplitButton options={this.options} color={this.color} text={this.text} onClick={onClick} onSelect={onSelect} />
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.BUTTONS}/SplitButton`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => SplitButtonKnobStory)
  .add('One item Story', () => OneItemStory)
  .add('Default', () => DefaultSplitButtonStory);
