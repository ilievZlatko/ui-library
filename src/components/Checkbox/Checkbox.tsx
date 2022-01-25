import isEmpty from 'lodash/isEmpty';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';

import './Checkbox.scss';

@Component({ name: 'Checkbox' })
class Checkbox extends Vue {
  static readonly EVENT_CHANGE = 'change';

  @Prop({ type: String, required: false, default: null })
  readonly text: string | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly checked: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly stopPropagation: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly indeterminate: boolean;

  render(): VNode {
    return (
      <div class="lp-checkbox" onClick={this.onClick}>
        <label class={this.className}>
          <div class="fake-input">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="check-icon">
              <transition name="fade">
                <path fill="currentColor" key={this.path} d={this.path} />
              </transition>
            </svg>

            <input
              class="real-input"
              type="checkbox"
              disabled={this.disabled}
              checked={this.checked}
              indeterminate={this.indeterminate}
              onChange={this.onChange}
            />
          </div>
          {this.renderText()}
        </label>
      </div>
    );
  }

  private renderText(): VNode | null {
    const defaultSlot = this.$slots.default;

    if (this.hasText) {
      return <span class="text">{this.text}</span>;
    } else if (defaultSlot) {
      return <div class="text">{defaultSlot}</div>;
    }

    return null;
  }

  private get className(): string {
    return cx('container', {
      unchecked: !this.indeterminate && !this.checked,
      checked: !this.indeterminate && this.checked,
      disabled: this.disabled,
      indeterminate: this.indeterminate
    });
  }

  private get path(): string {
    if (this.indeterminate) {
      return 'M13 7 13 9 3 9 3 7z';
    }

    if (this.checked) {
      return 'M3.9328 7.1495a.4.4 0 00-.6656.4438l2.5143 3.7714a.4.4 0 00.6156.061L12.683 5.14a.4.4 0 10-.5657-.5657L6.1765 10.515 3.9328 7.1495z';
    }

    return '';
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
        this.$emit(Checkbox.EVENT_CHANGE, (event.target as HTMLInputElement).checked === true);
      }
    }
  }
}

namespace Checkbox {
  export interface Props {
    text?: string | null;
    checked?: boolean;
    disabled?: boolean;
    stopPropagation?: boolean;
    indeterminate?: boolean;
  }
}

export { Checkbox };
