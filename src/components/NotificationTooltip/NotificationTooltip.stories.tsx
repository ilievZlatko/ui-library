import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { NotificationTooltip } from './NotificationTooltip';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div style="position: relative; max-width: 300px;">
          <span>With one message</span>
          <NotificationTooltip message={['A single notification']} />
        </div>

        <div style="position: relative; max-width: 300px;">
          <span>With multiple messages</span>
          <NotificationTooltip message={['Something happened', 'And something else after that']} />
        </div>

        <div style="position: relative; max-width: 300px;">
          <span>In warn state</span>
          <NotificationTooltip
            message={['This is your first warning', 'This is your second warning']}
            type={NotificationTooltip.Type.WARNING}
          />
        </div>

        <div style="position: relative; max-width: 300px;">
          <span>In error state</span>
          <NotificationTooltip message={['Err1', 'Err2']} type={NotificationTooltip.Type.ERROR} />
        </div>

        <StargateTarget />
      </div>
    );
  }
}

@Component({ name: 'KnobStory' })
class KnobStory extends Vue {
  @Prop({ type: String, required: true, default: () => text('message', 'Change me') })
  message: string;

  @Prop({ type: String, required: true, default: () => selectKnob('type', NotificationTooltip.Type, NotificationTooltip.Type.INFO) })
  type: NotificationTooltip.Type;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div style="position: relative; max-width: 300px;">
          <span>Use knobs below</span>
          <NotificationTooltip message={[this.message]} type={this.type} />
        </div>

        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/NotificationTooltip`, module)
  .addDecorator(withKnobs)
  .add('Knobs', () => KnobStory)
  .add('Default', () => DefaultStory);
