import { boolean, color, number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { DevicePreview } from './DevicePreview';

@Component({ name: 'DevicePreviewStory' })
class DevicePreviewStory extends Vue {
  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('orientation', DevicePreview.OrientationType, DevicePreview.OrientationType.PORTRAIT)
  })
  readonly orientation: DevicePreview.OrientationType;

  @Prop({
    type: Number,
    required: false,
    default: () => number('width', DevicePreview.WIDTH)
  })
  readonly width: number;

  @Prop({
    type: Number,
    required: false,
    default: () => number('height', DevicePreview.HEIGHT)
  })
  readonly height: number;

  @Prop({
    type: Boolean,
    required: false,
    default: () => boolean('highlighted', false)
  })
  readonly highlighted: boolean;

  @Prop({
    type: String,
    required: false,
    default: () => color('highlight color', '#1076fb')
  })
  readonly highlightColor: string;

  @Prop({
    type: Number,
    required: false,
    default: () => number('container padding', DevicePreview.CONTAINER_PADDING)
  })
  readonly containerPadding: number;

  render(): VNode {
    return (
      <DevicePreview
        orientation={this.orientation}
        containerPadding={this.containerPadding}
        highlighted={this.highlighted}
        highlightColor={this.highlightColor}
        width={this.width}
        height={this.height}
      />
    );
  }
}

storiesOf(`${StorybookSection.LAYOUT}/DevicePreview`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => DevicePreviewStory)
  .add('Default', () => DevicePreviewStory);
