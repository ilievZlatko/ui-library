import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';
import { NotificationContent } from '../NotificationTooltip/NotificationContent/NotificationContent';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { Tooltip } from '../Tooltip/Tooltip';

import './Pill.scss';

@Component({ name: 'Pill' })
class Pill extends Vue {
  static readonly EVENT_CLICK: string = 'click';
  static readonly EVENT_CLOSE: string = 'close';

  @Prop({ type: String, required: false, default: null })
  readonly text: string | null;

  @Prop({ type: String, required: false, default: null })
  readonly placeholder: string | null;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly error: string | Array<string>;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly warning: string | Array<string>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly selected: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly showClose: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly focusable: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly overflowableTooltip: boolean;

  private get hasError(): boolean {
    return this.error.length > 0;
  }

  private get hasWarning(): boolean {
    return !this.hasError && this.warning.length > 0;
  }

  private get tooltipType(): Tooltip.Type {
    return this.hasError ? Tooltip.Type.ERROR : Tooltip.Type.WARNING;
  }

  private get tooltipMessage(): string | Array<string> {
    return this.hasError ? this.error : this.warning;
  }

  render(): VNode {
    return (
      <Tooltip type={this.tooltipType} placement={Tooltip.Placement.TOP}>
        <div
          class={cx('lp-pill', {
            selected: this.selected,
            'with-close': this.showClose,
            warning: this.hasWarning,
            error: this.hasError,
            disabled: this.disabled,
            placeholder: this.text === null
          })}
          tabIndex={this.focusable && !this.disabled ? '0' : null}
          onClick={this.onClick}
        >
          <Icon class="icon" type={Icon.Type.CLEAR_FILLED_MEDIUM} stopPropagation={true} onClick={this.onClose} />
          <div class="label">
            {this.renderLabel()}
            {this.$slots.default}
          </div>
        </div>

        {(this.hasError || this.hasWarning) && (
          <template slot="content">
            {this.text && <div class="lp-pill-popup-name">{this.text}</div>}
            {this.text && <div class="lp-pill-popup-separator" />}
            <NotificationContent message={this.tooltipMessage} />
          </template>
        )}
      </Tooltip>
    );
  }

  private renderLabel(): VNode | string | null {
    const label = this.text ?? this.placeholder;

    if (!this.hasError && !this.hasWarning) {
      // Use default overflowable text with its tooltip.
      return this.overflowableTooltip ? <OverflowableText text={label} /> : <div class="label-content">{label}</div>;
    }

    // Make sure only one tooltip with either error or warning is shown.
    return <div class="label-content">{label}</div>;
  }

  onClick(e: MouseEvent): void {
    if (!this.disabled) {
      this.$emit(Pill.EVENT_CLICK, e);
    }
  }

  onClose(): void {
    if (!this.disabled && this.showClose) {
      this.$emit(Pill.EVENT_CLOSE);
    }
  }
}

export { Pill };
