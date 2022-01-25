import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { withReadme } from 'storybook-readme';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Button } from './Button';
import ButtonReadme from './Button.md';

const margin = 'margin: 1em 0';
const tableStyle = 'border-top: 1px solid #E1E4E5; border-left: 1px solid #E1E4E5;';
const row = 'border-bottom: 1px solid #E1E4E5;';
const cell = 'border-right: 1px solid #E1E4E5; padding: 8px 16px';
const cellText = `border-right: 1px solid #E1E4E5; padding: 16px; font-weight: bold;`;

@Component({ name: 'DefaultButtonStory' })
class DefaultButtonStory extends Vue {
  onClick: Function = action('onClick');

  @Prop({ type: String, required: false, default: () => text('text', 'Click me') })
  readonly text: string | null;

  @Prop({ type: String, required: false, default: () => selectKnob('icon', Icon.Type, undefined) })
  readonly icon: Icon.Type | undefined;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <table style={tableStyle}>
          <tr style={row}>
            <th style={cell} />
            <th style={cell}>NORMAL</th>
            <th style={cell}>NORMAL LOADING</th>
            <th style={cell}>NORMAL DISABLED</th>
            <th style={cell}>OUTLINE</th>
            <th style={cell}>OUTLINE LOADING</th>
            <th style={cell}>OUTLINE DISABLED</th>
            <th style={cell}>LIGHTEN</th>
            <th style={cell}>LIGHTEN LOADING</th>
            <th style={cell}>LIGHTEN DISABLED</th>
          </tr>

          {this.renderRow('LIGHT(default)', Button.Color.LIGHT)}
          {this.renderRow('TRANSPARENT', Button.Color.TRANSPARENT)}
          {this.renderRow('PRIMARY', Button.Color.PRIMARY)}
          {this.renderRow('DANGER', Button.Color.DANGER)}
          {this.renderRow('WARNING', Button.Color.WARNING)}
          {this.renderRow('SUCCESS', Button.Color.SUCCESS)}
        </table>
      </div>
    );
  }

  private renderRow(label: string, color: Button.Color): VNode {
    const normal = Button.Appearance.NORMAL;
    const outline = Button.Appearance.OUTLINE;
    const lighten = Button.Appearance.LIGHTEN;
    const onClick = this.onClick;

    return (
      <tr style={row}>
        <td style={cellText}>{label}</td>
        <td style={cell}>
          <Button color={color} text={this.text} icon={this.icon} onClick={onClick} appearance={normal} />
        </td>
        <td style={cell}>
          <Button
            color={color}
            text={this.text}
            icon={this.icon}
            onClick={onClick}
            appearance={normal}
            loading={true}
          />
        </td>
        <td style={cell}>
          <Button
            color={color}
            text={this.text}
            icon={this.icon}
            onClick={onClick}
            appearance={normal}
            disabled={true}
          />
        </td>
        <td style={cell}>
          <Button color={color} text={this.text} icon={this.icon} onClick={onClick} appearance={outline} />
        </td>
        <td style={cell}>
          <Button
            color={color}
            text={this.text}
            icon={this.icon}
            onClick={onClick}
            appearance={outline}
            loading={true}
          />
        </td>
        <td style={cell}>
          <Button
            color={color}
            text={this.text}
            icon={this.icon}
            onClick={onClick}
            appearance={outline}
            disabled={true}
          />
        </td>
        <td style={cell}>
          <Button color={color} text={this.text} icon={this.icon} onClick={this.onClick} appearance={lighten} />
        </td>
        <td style={cell}>
          <Button
            color={color}
            text={this.text}
            icon={this.icon}
            onClick={onClick}
            appearance={lighten}
            loading={true}
          />
        </td>
        <td style={cell}>
          <Button
            color={color}
            text={this.text}
            icon={this.icon}
            onClick={onClick}
            appearance={lighten}
            disabled={true}
          />
        </td>
      </tr>
    );
  }
}

@Component({ name: 'ButtonKnobStory' })
class KnobButtonStory extends Vue {
  onClick: Function = action('onClick');

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('type', Button.Type, Button.Type.BUTTON)
  })
  readonly type: Button.Type;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('color', Button.Color, Button.Color.LIGHT)
  })
  readonly color: Button.Color;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('appearance', Button.Appearance, Button.Appearance.NORMAL)
  })
  readonly appearance: Button.Appearance;

  @Prop({ required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ required: false, default: () => boolean('loading', false) })
  readonly loading: boolean;

  @Prop({ type: String, required: false, default: () => text('text', 'Click me') })
  readonly text: string | null;

  @Prop({ type: String, required: false, default: () => selectKnob('icon', Icon.Type, undefined) })
  readonly icon: Icon.Type;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('icon placement', Button.IconPlacement, undefined)
  })
  readonly iconPlacement: Button.IconPlacement;

  @Prop({ type: String, required: false, default: () => text('text', null) })
  readonly tooltip: string | null;

  @Prop({
    type: String,
    required: false,
    default: () => AnchoredPopup.Placement.BOTTOM
  })
  readonly tooltipPlacement: AnchoredPopup.Placement;

  @Prop({ type: String, required: false, default: () => text('badge', null) })
  readonly badge: string | null;

  @Prop({ type: String, required: false, default: () => selectKnob('dotIndicator', Button.Color, undefined) })
  readonly dotIndicator: Button.Color | null;

  @Prop({ default: () => boolean('stopPropagation', false) })
  readonly stopPropagation: boolean;

  @Prop({ default: () => boolean('inline', false) })
  readonly inline: boolean;

  render(): Array<VNode> {
    return [
      <Button
        type={this.type}
        style={margin}
        color={this.color}
        appearance={this.appearance}
        disabled={this.disabled}
        loading={this.loading}
        text={this.text}
        icon={this.icon}
        iconPlacement={this.iconPlacement}
        badge={this.badge}
        dotIndicator={this.dotIndicator}
        tooltip={this.tooltip}
        tooltipPlacement={this.tooltipPlacement}
        inline={this.inline}
        onClick={this.onClick}
      />,
      <StargateTarget />
    ];
  }
}

@Component({ name: 'ButtonIndicatorStory' })
class ButtonIndicatorStory extends Vue {
  onClick: Function = action('onClick');

  @Prop({ type: String, required: false, default: () => text('text', 'Click me') })
  readonly text: string | null;

  @Prop({ type: String, required: false, default: () => selectKnob('icon', Icon.Type, undefined) })
  readonly icon: Icon.Type | undefined;

  @Prop({ type: String, required: false, default: () => selectKnob('dotIndicator', Button.Color, undefined) })
  readonly dotIndicator: Button.Color | null;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Button
          color={Button.Color.PRIMARY}
          text={this.text}
          icon={this.icon}
          dotIndicator={this.dotIndicator}
          onClick={this.onClick}
        />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.BUTTONS}/Button`, module)
  .addDecorator(withReadme(ButtonReadme))
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => KnobButtonStory)
  .add('Default', () => DefaultButtonStory)
  .add('With indicator', () => ButtonIndicatorStory);
