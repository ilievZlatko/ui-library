import isEmpty from 'lodash/isEmpty';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';

import './Radio.scss';

@Component({ name: 'Radio' })
class Radio extends Vue {
  static readonly EVENT_SELECT = 'select';

  @Prop({ type: String, required: false, default: '' })
  name: string;

  @Prop({ type: String, required: false, default: null })
  text: string | null;

  @Prop({ type: Boolean, required: false, default: false })
  checked: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  stopPropagation: boolean;

  $slots: {
    description: Array<VNode>;
  };

  render(): VNode {
    return (
      <div class="lp-radio" onClick={this.onClick}>
        <label class={this.className}>
          <div class="fake-input">
            <i class="check-icon" />
            <input
              class="real-input"
              data-testid={this.text ? `radio-input-${this.text}` : 'radio-input'}
              type="radio"
              name={this.name}
              disabled={this.disabled}
              checked={this.checked}
              onChange={this.onChange}
            />
          </div>
          {this.hasText && <span class="text">{this.text}</span>}
          {this.$slots.description && <div class="description">{this.$slots.description}</div>}
        </label>
      </div>
    );
  }

  private get className(): string {
    return cx('container', {
      unchecked: !this.checked,
      checked: this.checked,
      disabled: this.disabled,
      'has-text': this.hasText
    });
  }

  private get hasText(): boolean {
    return !isEmpty(this.text);
  }

  private onClick(event?: Event): void {
    if (event && this.stopPropagation) {
      event.stopPropagation();
    }
  }

  private onChange(event?: UIEvent): void {
    if (event) {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      if (!this.disabled) {
        this.$emit(Radio.EVENT_SELECT);
      }
    }
  }
}

namespace Radio {
  export interface Props {
    name: string;
    text?: string | null;
    checked?: boolean;
    disabled?: boolean;
    stopPropagation?: boolean;
  }
}

export { Radio };
