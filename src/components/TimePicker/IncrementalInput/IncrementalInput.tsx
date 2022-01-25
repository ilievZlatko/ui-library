import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../../utils/cx';
import { Icon } from '../../icon/Icon';
import { TextInput } from '../../TextInput/TextInput';

import './IncrementalInput.scss';

@Component({ name: 'IncrementalInput' })
class IncrementalInput extends Vue {
  static readonly EVENT_UP: string = 'up';
  static readonly EVENT_DOWN: string = 'down';
  static readonly EVENT_CHANGE: string = 'change';

  @Prop({ type: String, required: false, default: '' })
  readonly value: string;

  @Prop({ type: String, required: false, default: '' })
  readonly error: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly readonly: boolean;

  render(): VNode {
    return (
      <div class={cx('lp-incremental-input', { disabled: this.disabled })}>
        <div class="lp-incremental-input-button" onClick={this.onClickUp}>
          <Icon type={Icon.Type.CHEVRON_UP} class="chevron" />
        </div>
        <TextInput
          value={this.value}
          error={this.error}
          readonly={this.readonly}
          disabled={this.disabled}
          hasEllipsis={false}
          onInput={this.onInput}
        />
        <div class="lp-incremental-input-button" onClick={this.onClickDown}>
          <Icon type={Icon.Type.CHEVRON_DOWN} class="chevron" />
        </div>
      </div>
    );
  }

  private onClickUp(): void {
    if (!this.disabled) {
      this.$emit(IncrementalInput.EVENT_UP);
    }
  }

  private onClickDown(): void {
    if (!this.disabled) {
      this.$emit(IncrementalInput.EVENT_DOWN);
    }
  }

  private onInput(newValue: string): void {
    this.$emit(IncrementalInput.EVENT_CHANGE, newValue);
  }
}

namespace IncrementalInput {
  export interface Props {
    value?: string;
    disabled?: boolean;
    readonly?: boolean;
  }
}

export { IncrementalInput };
