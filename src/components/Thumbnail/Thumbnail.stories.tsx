import { boolean, color, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { DataVizColor } from '../../utils/styles';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Thumbnail } from './Thumbnail';

@Component({ name: 'DefaultThumbnailStory' })
class DefaultThumbnailStory extends Vue {
  private hovered: boolean = false;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <h5>Default</h5>
        <div style="margin: 16px; height: 40px">
          <Thumbnail icon={Icon.Type.IBEACON} color={DataVizColor.DARK_TEAL} />
        </div>
        <h5>With prolonged height</h5>
        <div style="display: flex; margin: 16px; height: 80px">
          <Thumbnail icon={Icon.Type.SEND} color={DataVizColor.PURPLE} />
        </div>
        <h5>With details</h5>
        <div style="margin: 16px">
          <Thumbnail icon={Icon.Type.USER} color={DataVizColor.BLUE} title="Title" subtitle="Subtitle" />
        </div>
        <h5>With hover icon</h5>
        <div style="margin: 16px; height: 40px" onMouseenter={this.onMouseenter} onMouseleave={this.onMouseleave}>
          <Thumbnail
            icon={Icon.Type.GEOFENCE}
            hoverIcon={Icon.Type.TIMEWATCH}
            color={DataVizColor.DARK_TEAL}
            hovered={this.hovered}
          />
        </div>
        <StargateTarget />
      </div>
    );
  }

  private onMouseenter(): void {
    this.hovered = true;
  }

  private onMouseleave(): void {
    this.hovered = false;
  }
}

@Component({ name: 'ThumbnailKnobStory' })
class ThumbnailKnobStory extends Vue {
  @Prop({ type: String, default: () => color('color', DataVizColor.PINK) })
  readonly color: string;

  @Prop({ type: String, default: () => text('title', 'title') })
  readonly title: string | null;

  @Prop({ type: String, default: () => text('subtitle', 'subtitle') })
  readonly subtitle: string | null;

  @Prop({ type: Number, default: () => number('size', 40) })
  readonly size: number;

  @Prop({ type: Boolean, default: () => boolean('hovered', false) })
  readonly hovered: boolean;

  @Prop({ type: Boolean, default: () => boolean('hovered', false) })
  readonly clickable: boolean;

  render(): VNode {
    return (
      <Thumbnail
        icon={Icon.Type.GEOFENCE}
        hoverIcon={Icon.Type.IBEACON}
        title={this.title}
        subtitle={this.subtitle}
        color={this.color}
        size={this.size}
        hovered={this.hovered}
        clickable={this.clickable}
      />
    );
  }
}

storiesOf(`${StorybookSection.BASICS}/Thumbnail`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultThumbnailStory)
  .add('Knob Story', () => ThumbnailKnobStory);
