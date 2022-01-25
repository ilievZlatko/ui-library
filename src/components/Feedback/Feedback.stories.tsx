import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Feedback } from './Feedback';
import { FeedbackButton } from './FeedbackButton/FeedbackButton';

const margin = 'margin: 1em 0';

@Component({ name: 'TypeStory' })
class TypeStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="max-width: 300px">
        <Feedback style={margin} title="Default" message="This is the default" />

        <Feedback style={margin} title="Info" message="This is an info" type={Feedback.Type.INFO} />

        <Feedback style={margin} title="Warning" message="This is a warning" type={Feedback.Type.WARNING} />

        <Feedback style={margin} title="Error" message="This is an error" type={Feedback.Type.ERROR} />
      </div>
    );
  }
}

@Component({ name: 'ButtonStory' })
class ButtonStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Feedback
          style={margin}
          title="Begin creating your campaign by selecting a goal here."
          message="Lorem ipsum dolor sit amet, ex vix decore scribentur, duo iriure mediocritatem an."
        >
          <FeedbackButton text="Learn more" />
        </Feedback>
        <Feedback
          style={margin}
          title="Begin creating your campaign by selecting a goal here."
          message="Lorem ipsum dolor sit amet, ex vix decore scribentur, duo iriure mediocritatem an."
        >
          <FeedbackButton halfWidth={true} secondary={true} text="Secondary" />
          <FeedbackButton halfWidth={true} text="Primary" />
        </Feedback>
        <Feedback
          style={margin}
          title="Quiet Hours Warning"
          message="Lorem ipsum dolor sit amet, ex vix decore scribentur, duo iriure mediocritatem an."
          type={Feedback.Type.WARNING}
        />
        <Feedback
          style={margin}
          message="Lorem ipsum dolor sit amet, ex vix decore scribentur, duo iriure mediocritatem an."
          type={Feedback.Type.WARNING}
        />
        <Feedback
          style={margin}
          title="All Users Warning"
          message="This campaign will go out to all 399K Users."
          type={Feedback.Type.WARNING}
        >
          <FeedbackButton text="View audience" />
        </Feedback>
        <Feedback style={margin} title="3 errors in Action Section" type={Feedback.Type.ERROR}>
          <FeedbackButton text="Action #1" />
          <FeedbackButton text="Action #2" />
          <FeedbackButton text="Action #3" />
        </Feedback>
      </div>
    );
  }
}

@Component({ name: 'CompactStory' })
class CompactStory extends Vue {
  @Prop({ default: () => boolean('compact', true) })
  readonly compact: boolean = true;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="width: 300px">
        <Feedback style={margin} compact={this.compact} message="This is the compact feedback" />
      </div>
    );
  }
}

@Component({ name: 'FeedbackKnobStory' })
class FeedbackKnobStory extends Vue {
  @Prop({ type: String, required: false, default: () => selectKnob('type', Feedback.Type, Feedback.Type.INFO) })
  readonly type: Feedback.Type;

  @Prop({ type: String, required: false, default: () => text('title', 'Demo Title') })
  readonly title: string | null;

  @Prop({ type: String, required: false, default: () => text('message', 'Demo Message') })
  readonly message: string | null;

  @Prop({ type: Boolean, required: false, default: () => boolean('compact', false) })
  readonly compact: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('showArrow', false) })
  readonly showArrow: boolean;

  render(): VNode {
    return (
      <div style="width: 300px" x-placement="top">
        <Feedback
          style={margin}
          type={this.type}
          title={this.title}
          compact={this.compact}
          message={this.message}
          showArrow={this.showArrow}
        />

        <p>
          <b>Note:</b>
          The arrow will be displayed only when used inside a component that has a placement.
        </p>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/Feedback`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => FeedbackKnobStory)
  .add('Compact', () => CompactStory);

storiesOf(`${StorybookSection.FEEDBACK}/Feedback`, module)
  .add('Types', () => TypeStory)
  .add('Buttons', () => ButtonStory);
