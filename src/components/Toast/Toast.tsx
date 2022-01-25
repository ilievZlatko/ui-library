import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { InfoPanel } from '../InfoPanel/InfoPanel';
import { Modal } from '../Modal/Modal';

import './Toast.scss';

@Component({ name: 'Toast' })
class Toast extends Vue {
  static readonly OPENED_TIMEOUT: number = 2000;
  static readonly EVENT_CLOSE: string = 'close';

  @Prop({ type: String, required: false, default: '' })
  readonly message: string;

  private timeout: NodeJS.Timeout;

  created(): void {
    this.timeout = setTimeout(this.close, Toast.OPENED_TIMEOUT);
  }

  beforeDestroy(): void {
    clearTimeout(this.timeout);
  }

  render(): VNode {
    return (
      <Modal simple={true} fadeClose={true} alignTop={true} escClose={true} onClose={this.close}>
        <InfoPanel class="lp-toast" type={InfoPanel.Type.SUCCESS} message={this.message}>
          {this.$slots.default}
        </InfoPanel>
      </Modal>
    );
  }

  private close(): void {
    this.$emit(Toast.EVENT_CLOSE);
  }
}

export { Toast };
