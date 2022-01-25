import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { StatusIndicator } from './StatusIndicator';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({ type: Boolean, required: true, default: () => boolean('embedded', false) })
  readonly embedded: boolean;

  @Prop({ type: Boolean, required: true, default: () => text('label', 'Some status') })
  readonly label: boolean;

  @Prop({
    type: String,
    required: true,
    default: () => selectKnob('Color', StatusIndicator.Color, StatusIndicator.Color.GREEN)
  })
  readonly color: StatusIndicator.Color;

  render(): VNode {
    return <StatusIndicator label={this.label} color={this.color} embedded={this.embedded} />;
  }
}

storiesOf(`${StorybookSection.INDICATOR}/StatusIndicator`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultStory);
