import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import values from 'lodash/values';
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { StargateTarget } from '../Stargate/StargateTarget';
import { OverflowableText } from './OverflowableText';

@Component({ name: 'OverflowableTextKnobStory' })
class OverflowableTextKnobStory extends Vue {
  @Prop({
    type: String,
    required: false,
    default: () => text('text', 'A very very very very very very very very very very very very long text')
  })
  readonly text: string;

  @Prop({ type: String, required: false, default: () => text('class', '') })
  readonly class: string | null;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(AnchoredPopup.Placement).indexOf(value) > -1,
    default: () => selectKnob('tooltipPlacement', AnchoredPopup.Placement, AnchoredPopup.Placement.TOP)
  })
  readonly tooltipPlacement: AnchoredPopup.Placement;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <OverflowableText
          style="max-width: 300px"
          text={this.text}
          class={this.class}
          tooltipPlacement={this.tooltipPlacement}
        />
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.UTIL}/OverflowableText`, module)
  .addDecorator(withKnobs)
  .add('Knob Story', () => OverflowableTextKnobStory);
