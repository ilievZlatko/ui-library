import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Feedback } from '../Feedback/Feedback';
import { FeedbackButton } from '../Feedback/FeedbackButton/FeedbackButton';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Guide } from './Guide';

@Component({ name: 'PlacementStory' })
class PlacementStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        Click these icons to see the guides:
        <Guide
          type={Feedback.Type.INFO}
          title="Some info"
          message="This is an info guide with some buttons"
          placement={AnchoredPopup.Placement.RIGHT}
        >
          <FeedbackButton halfWidth={true} secondary={true} text="Secondary" />
          <FeedbackButton halfWidth={true} text="Primary" />
        </Guide>
        <br />
        <Guide
          type={Feedback.Type.WARNING}
          title="A Warning"
          message="This is a warning with some buttons"
          placement={AnchoredPopup.Placement.RIGHT}
        >
          <FeedbackButton halfWidth={true} secondary={true} text="Secondary" />
          <FeedbackButton halfWidth={true} text="Primary" />
        </Guide>
        <hr />
        This error guide opens by default on load
        <Guide
          openOnMount={true}
          type={Feedback.Type.ERROR}
          title="An Error"
          message="This is a error with some buttons"
          placement={AnchoredPopup.Placement.RIGHT}
        >
          <FeedbackButton halfWidth={true} secondary={true} text="Secondary" />
          <FeedbackButton halfWidth={true} text="Primary" />
        </Guide>
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'GuideKnobStory' })
class GuideKnobStory extends Vue {
  @Prop({ type: String, required: false, default: () => text('title', 'Guide Title') })
  title: string | null;

  @Prop({ type: String, required: false, default: () => text('message', 'Guide Message') })
  message: string | null;

  @Prop({ required: false, default: () => text('popoutClassName', '') })
  popoutClassName: string;

  @Prop({ required: false, default: () => boolean('openOnMount', false) })
  openOnMount: boolean;

  @Prop({ type: String, required: false, default: () => selectKnob('type', Feedback.Type, Feedback.Type.INFO) })
  type: Feedback.Type;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('placement', AnchoredPopup.Placement, AnchoredPopup.Placement.RIGHT)
  })
  placement: AnchoredPopup.Placement;

  render(): VNode {
    return (
      <div>
        <Guide
          type={this.type}
          title={this.title}
          message={this.message}
          placement={this.placement}
          popoutClassName={this.popoutClassName}
          openOnMount={this.openOnMount}
        >
          <FeedbackButton halfWidth={true} secondary={true} text="Secondary" />
          <FeedbackButton halfWidth={true} text="Primary" />
        </Guide>
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/Guide`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => GuideKnobStory);

storiesOf(`${StorybookSection.FEEDBACK}/Guide`, module).add('Default', () => PlacementStory);
