import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { Feedback } from '../Feedback/Feedback';
import { StargateTarget } from '../Stargate/StargateTarget';
import { AutoPopup } from './AutoPopup';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private onOpen: Function = action('onOpen');
  private onClose: Function = action('onClose');

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('placement', AutoPopup.Placement, AutoPopup.Placement.AUTO)
  })
  readonly placement: AutoPopup.Placement;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('eventTrigger', AutoPopup.EventTrigger, AutoPopup.EventTrigger.CLICK)
  })
  readonly eventTrigger: AutoPopup.EventTrigger;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <AutoPopup
          style="margin: 120px auto;"
          eventTrigger={this.eventTrigger}
          placement={this.placement}
          onOpen={this.onOpen}
          onClose={this.onClose}
        >
          <Button slot="anchor" text="Anchor" />

          <Feedback slot="content">
            <p>
              What you can do:
              <ul>
                <li>Click on the button below and shift+tab to test open on focus</li>
                <li>Click anywhere else to dismiss</li>
                <li>Check out the knobs tab below to switch between click and hover mode</li>
              </ul>
            </p>
          </Feedback>
        </AutoPopup>

        <Button
          style="margin: 160px auto 0;"
          text="Click me and shift+tab to test open on focus"
          stopPropagation={true}
        />

        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/AutoPopup`, module)
  .addDecorator(withKnobs)
  .add('Default', () => DefaultStory);
