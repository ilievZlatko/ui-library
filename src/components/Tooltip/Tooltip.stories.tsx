import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Button } from '../Button/Button';
import { Feedback } from '../Feedback/Feedback';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Tooltip } from './Tooltip';

@Component({ name: 'PlacementStory' })
class PlacementStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Tooltip>
          {/** The default content is used as anchor */}
          <Button text="Shows on hover (right)" />

          <template slot="content">
            <p>
              An example formatted list:
              <ul>
                <li>First</li>
                <li>Second</li>
              </ul>
            </p>
          </template>
        </Tooltip>

        <br />

        <Tooltip type={Feedback.Type.ERROR} placement={AnchoredPopup.Placement.BOTTOM}>
          <Button text="Error type (bottom)" />

          <template slot="content">
            <p>Error content</p>
          </template>
        </Tooltip>

        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'TooltipKnobStory' })
class TooltipKnobStory extends Vue {
  @Prop({ required: false, default: () => text('text', 'Tooltip message') })
  readonly message: string | null;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('type', Feedback.Type, Feedback.Type.INFO)
  })
  readonly type: Feedback.Type;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('placement', AnchoredPopup.Placement, AnchoredPopup.Placement.RIGHT)
  })
  readonly placement: AnchoredPopup.Placement;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ type: Number, required: false, default: () => number('offset', 0) })
  readonly offset: number;

  @Prop({ type: Boolean, required: false, default: () => boolean('showArrow', false) })
  readonly showArrow: boolean;

  render(): VNode {
    return (
      <div>
        <Tooltip
          message={this.message}
          type={this.type}
          placement={this.placement}
          disabled={this.disabled}
          offset={this.offset}
          showArrow={this.showArrow}
        >
          <Button text="Tooltip Anchor" />
        </Tooltip>
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/Tooltip`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => TooltipKnobStory);

storiesOf(`${StorybookSection.FEEDBACK}/Tooltip`, module).add('Default', () => PlacementStory);
