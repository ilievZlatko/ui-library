import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';

import './ConfirmModal.scss';

@Component({ name: 'ConfirmModal' })
class ConfirmModal extends Vue {
  public static readonly EVENT_CANCEL: string = 'cancel';
  public static readonly EVENT_CONFIRM: string = 'confirm';

  @Prop({ type: String, required: true })
  public readonly title: string;

  @Prop({ type: String, required: false, default: '' })
  public readonly className: string;

  @Prop({ type: String, required: false, default: 'Cancel' })
  public readonly cancelLabel: string;

  @Prop({ type: String, required: false, default: 'Confirm' })
  public readonly confirmLabel: string;

  @Prop({ type: Boolean, required: false, default: false })
  public readonly confirmDisabled: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  public readonly opened: boolean;

  @Prop({ required: false, default: Button.Color.DANGER })
  public readonly buttonColor: Button.Color;

  render(): VNode | null {
    return this.opened ? (
      <Modal className={this.className} bigTitle={true} title={this.title} minHeight="0">
        {this.$slots.default}
        <template slot="footer">
          <Button text={this.cancelLabel} onClick={this.onCancel} color={Button.Color.LIGHT} />
          <Button
            text={this.confirmLabel}
            onClick={this.onConfirm}
            color={this.buttonColor}
            disabled={this.confirmDisabled}
          />
        </template>
      </Modal>
    ) : null;
  }

  private onCancel(): void {
    this.$emit(ConfirmModal.EVENT_CANCEL);
  }

  private onConfirm(): void {
    this.$emit(ConfirmModal.EVENT_CONFIRM);
  }
}

export { ConfirmModal };
