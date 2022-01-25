import { action } from '@storybook/addon-actions';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from './Icon';

@Component({ name: 'AllIconsStory' })
class AllIconsStory extends Vue {
  private static readonly ICON_SIZE: Icon.Size = 40;

  private bgColor: string = '#F6F6F6';
  private fontColor: string = '#333333';

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div style={{ marginBottom: '20px' }}>
          <label>
            <span>Background Color:</span>
            <br />
            <input type="text" v-model={this.bgColor} />
          </label>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>
            <span>Font Color:</span>
            <br />
            <input type="text" v-model={this.fontColor} />
          </label>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {this.types.map((type) => (
            <div key={type} style={{ width: '200px' }}>
              <div style={{ padding: '20px' }}>
                <code>{type}</code>
                <div style={{ paddingTop: '10px' }}>
                  <div style={{ backgroundColor: this.bgColor, color: this.fontColor, width: 'fit-content' }}>
                    <Icon type={type} size={AllIconsStory.ICON_SIZE} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  private get types(): Array<Icon.Type> {
    const vals = values(Icon.Type) as Array<Icon.Type>;
    vals.sort();

    return vals;
  }
}

@Component({ name: 'IconKnobStory' })
class IconKnobStory extends Vue {
  onClick = action('onClick');

  @Prop({ required: true, type: String, default: () => selectKnob('type', Icon.Type, Icon.Type.ACTION_APPFUNCTION) })
  type: Icon.Type;

  @Prop({
    required: false,
    type: String,
    default: () => selectKnob('circle', Icon.Circle, Icon.Circle.NONE)
  })
  circle: Icon.Circle;

  @Prop({ required: false, type: [Object, Number], default: () => number('size', 48) })
  size: Icon.Size;

  @Prop({ type: String, required: false, default: () => text('tooltip', '') })
  tooltip: string | null;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('tooltipPlacement', AnchoredPopup.Placement, AnchoredPopup.Placement.TOP)
  })
  tooltipPlacement: AnchoredPopup.Placement;

  @Prop({ type: Boolean, required: false, default: () => boolean('stopPropagation', false) })
  stopPropagation: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('clickable', true) })
  clickable: boolean;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Icon
          type={this.type}
          circle={this.circle}
          size={this.size}
          tooltip={this.tooltip}
          tooltipPlacement={this.tooltipPlacement}
          stopPropagation={this.stopPropagation}
          clickable={this.clickable}
          onClick={this.onClick}
        />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.BASICS}/Icon`, module)
  .addDecorator(withKnobs)
  .add('Knob Story', () => IconKnobStory)
  .add('All Icons', () => AllIconsStory);
