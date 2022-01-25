import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { ConfirmModal } from './ConfirmModal';

@Component({ name: 'KnobStory' })
class KnobStory extends Vue {
  cancel: Function = action(ConfirmModal.EVENT_CANCEL);
  confirm: Function = action(ConfirmModal.EVENT_CONFIRM);

  @Prop({ type: Boolean, required: false, default: () => boolean('opened', true) })
  readonly opened: boolean;

  @Prop({ type: String, required: true, default: () => text('title', 'Confirm action') })
  readonly title: string;

  @Prop({ type: String, required: true, default: () => text('description', 'Are you sure you want to continue?') })
  readonly description: string;

  @Prop({ type: String, required: false, default: () => text('cancelLabel', 'Cancel') })
  readonly cancelLabel: string | null;

  @Prop({ type: String, required: false, default: () => text('confirmLabel', 'Yes, I am very sure') })
  readonly confirmLabel: string | null;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <ConfirmModal
          opened={this.opened}
          title={this.title}
          cancelLabel={this.cancelLabel}
          confirmLabel={this.confirmLabel}
          onCancel={this.cancel}
          onConfirm={this.confirm}
        >
          <p>{this.description}</p>
        </ConfirmModal>
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.MODAL}/ConfirmModal`, module)
  .addDecorator(withKnobs)
  .add('Knob Story', () => KnobStory);
