import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob } from '../../utils/storybookUtils';
import { ProgressCircle } from './ProgressCircle';

const style = 'max-height: 64px; max-width: 64px; display: inline-block; margin: 0 8px;';

@Component({ name: 'ProgressCircleStory' })
class ProgressCircleStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <p>Default:</p>
        <ProgressCircle value={0} style={style} />
        <ProgressCircle value={35} style={style} />
        <ProgressCircle value={100} style={style} />
        <br />
        <p>
          With <code>showValue="false"</code>:
        </p>
        <ProgressCircle value={0} showValue={false} style={style} />
        <ProgressCircle value={35} showValue={false} style={style} />
        <ProgressCircle value={100} showValue={false} style={style} />
      </div>
    );
  }
}

@Component({ name: 'ProgressCircleSizeStory' })
class ProgressCircleSizeStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <p>Default:</p>
        <ProgressCircle value={64} />
        <p>
          With <code>size="128px"</code>:
        </p>
        <ProgressCircle value={100} size="128px" />
        <p>
          With <code>size="10%"</code>:
        </p>
        <ProgressCircle value={10} size="10%" />
      </div>
    );
  }
}

@Component({ name: 'ProgressCircleColorsStory' })
class ProgressCircleColorsStory extends Vue {
  render(): VNode {
    const cellStyle = 'text-align: center;';

    return (
      <div class="lp-storybook-wrapper">
        <table>
          <tr>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.BLUE} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.TEAL} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.GREEN} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.ORANGE} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.RED} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.PURPLE} style={style} />
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>
              <code>BLUE</code>
            </td>
            <td style={cellStyle}>
              <code>TEAL</code>
            </td>
            <td style={cellStyle}>
              <code>GREEN</code>
            </td>
            <td style={cellStyle}>
              <code>ORANGE</code>
            </td>
            <td style={cellStyle}>
              <code>RED</code>
            </td>
            <td style={cellStyle}>
              <code>PURPLE</code>
            </td>
          </tr>
          <tr>
            <td colspan="6">&nbsp;</td>
          </tr>
          <tr>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.BLUE_LIGHT} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.TEAL_LIGHT} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.GREEN_LIGHT} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.ORANGE_LIGHT} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.RED_LIGHT} style={style} />
            </td>
            <td style={cellStyle}>
              <ProgressCircle value={100} color={ProgressCircle.Color.PURPLE_LIGHT} style={style} />
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>
              <code>BLUE_LIGHT</code>
            </td>
            <td style={cellStyle}>
              <code>TEAL_LIGHT</code>
            </td>
            <td style={cellStyle}>
              <code>GREEN_LIGHT</code>
            </td>
            <td style={cellStyle}>
              <code>ORANGE_LIGHT</code>
            </td>
            <td style={cellStyle}>
              <code>RED_LIGHT</code>
            </td>
            <td style={cellStyle}>
              <code>PURPLE_LIGHT</code>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

@Component({ name: 'ProgressCircleKnobStory' })
class ProgressCircleKnobStory extends Vue {
  @Prop({
    required: false,
    type: String,
    default: () => selectKnob('color', ProgressCircle.Color, ProgressCircle.Color.BLUE)
  })
  readonly color: ProgressCircle.Color;

  @Prop({ required: false, type: String, default: () => text('size', '64px') })
  readonly size: string;

  @Prop({ required: false, type: Boolean, default: () => boolean('showValue', true) })
  readonly showValue: boolean;

  @Prop({ required: true, type: Number, default: () => number('value', 10) })
  readonly value: number;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <ProgressCircle color={this.color} size={this.size} showValue={this.showValue} value={this.value} />
      </div>
    );
  }
}

storiesOf('ProgressCircle', module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => ProgressCircleKnobStory);

storiesOf('ProgressCircle', module)
  .add('Default', () => ProgressCircleStory)
  .add('Colors', () => ProgressCircleColorsStory)
  .add('Size', () => ProgressCircleSizeStory);
