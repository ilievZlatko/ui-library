import { cx } from 'leanplum-lib-ui';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Icon } from '../icon/Icon';

import './ButtonGroup.scss';

@Component({ name: 'ButtonGroup' })
class ButtonGroup<T> extends Vue {
  static readonly EVENT_CHANGE: string = 'change';
  static readonly CLASS_PANEL: string = 'button-group-button';

  @Prop({ type: Array, required: true })
  readonly options: Array<ButtonGroup.Option<T>>;

  @Prop({ type: Object, required: false })
  readonly selected?: ButtonGroup.Option<T>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly compact: boolean;

  render(): VNode {
    return (
      <div class={cx('lp-button-group', { compact: this.compact, disabled: this.disabled })}>
        {this.options.map((option) => (
          <div
            class={cx(ButtonGroup.CLASS_PANEL, { selected: option.value === this.selected?.value, 'icon-only': !option.label })}
            onClick={() => this.selectOption(option)}
          >
            {option.icon && <Icon class="button-icon" type={option.icon} />}
            {option.label}
          </div>
        ))}
      </div>
    );
  }

  private selectOption(option: ButtonGroup.Option<T>): void {
    if (this.selected !== option && !this.disabled) {
      this.$emit(ButtonGroup.EVENT_CHANGE, option);
    }
  }
}

namespace ButtonGroup {
  export interface Option<T> {
    label?: string;
    value: T;
    icon?: Icon.Type;
  }
}

export { ButtonGroup };
