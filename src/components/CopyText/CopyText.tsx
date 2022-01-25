import { copyToClipboard } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Icon } from '../icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import './CopyText.scss';

@Component({ name: 'CopyText' })
class CopyText extends Vue {
  @Prop({ required: true })
  textToCopy: string;

  @Prop({ required: false })
  tooltipText: string;

  @Prop({ required: false, default: 'Copied!' })
  tooltipTextCopied: string;

  private copied: boolean = false;

  private get currentTooltip(): string {
    return this.copied ? this.tooltipTextCopied : this.tooltipText;
  }

  private get currentIcon(): Icon.Type {
    return this.copied ? Icon.Type.CHECKMARK : Icon.Type.COPY;
  }

  private get currentIconClass(): string {
    return this.copied ? 'icon-copied' : '';
  }

  render(): VNode {
    return (
      <span class="copy-text" onClick={this.copy}>
        <Tooltip message={this.currentTooltip} offset={8}>
          <Icon class={this.currentIconClass} type={this.currentIcon} />
        </Tooltip>
      </span>
    );
  }

  private copy(): void {
    if (this.copied) {
      return;
    }

    copyToClipboard(this.textToCopy);
    this.copied = true;
    setTimeout(this.reset, 3000);
  }

  private reset(): void {
    this.copied = false;
  }
}

export { CopyText };
