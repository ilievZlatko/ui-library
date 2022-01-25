import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Feedback } from '../Feedback/Feedback';
import { FeedbackButton } from '../Feedback/FeedbackButton/FeedbackButton';
import { Guide } from '../Guide/Guide';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { InfoSection } from './InfoSection';

@Component({ name: 'InfoSectionStory' })
class InfoSectionStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="width: 500px;">
        <h5>With custom icon and title</h5>
        <InfoSection icon={Icon.Type.ENGAGE} title="Engage!" />
        <br />
        <h5>With content</h5>
        <InfoSection title="Lorem Ipsum">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </InfoSection>
        <br />
        <h5>Custom sidebar content</h5>
        <InfoSection title="Error">
          <Guide
            slot="sidebar"
            type={Feedback.Type.ERROR}
            title="Error"
            message="This is an error with some buttons."
            placement={AnchoredPopup.Placement.RIGHT}
          >
            <FeedbackButton halfWidth={true} secondary={true} text="Secondary" />
            <FeedbackButton halfWidth={true} text="Primary" />
          </Guide>
          <p>Hover the icon for more information.</p>
        </InfoSection>
        <br />
        <br />
        <br />
        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'InfoSectionKnobStory' })
class InfoSectionKnobStory extends Vue {
  @Prop({ type: String, default: () => selectKnob('type', Icon.Type, Icon.Type.INFO) })
  readonly icon: string;

  @Prop({ type: String, required: false, default: () => text('title', 'Title') })
  readonly title: string;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="width: 500px;">
        <InfoSection icon={this.icon} title={this.title} />
        <h5>With content</h5>
        <InfoSection icon={this.icon} title={this.title}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </InfoSection>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.LAYOUT}/InfoSection`, module)
  .addDecorator(withKnobs)
  .add('Knob Story', () => InfoSectionKnobStory)
  .add('Default', () => InfoSectionStory);
