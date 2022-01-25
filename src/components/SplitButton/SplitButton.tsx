import { oneOf } from 'leanplum-lib-common';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Button } from '../Button/Button';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import './SplitButton.scss';

@Component({ name: 'SplitButton' })
class SplitButton extends Vue {
  static readonly EVENT_CLICK: string = 'click';
  static readonly EVENT_SELECT: string = 'select';

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: string;

  @Prop({
    type: String,
    required: false,
    default: Button.Color.LIGHT,
    validator: oneOf(values(Button.Color))
  })
  readonly color: Button.Color;

  @Prop({ required: true, type: Array })
  readonly options: Array<SplitButton.Item<unknown>>;

  private get firstItem(): SplitButton.Item<unknown> | null {
    return this.options[0] ?? null;
  }

  private get icon(): Icon.Type | null {
    return this.firstItem?.icon ?? null;
  }

  private get text(): string {
    return this.firstItem?.label ?? '';
  }

  private get tooltip(): string {
    return this.firstItem?.disabledReason ?? '';
  }

  private get disabled(): boolean {
    return this.firstItem?.disabled ?? false;
  }

  private get dropdownOptions(): Array<Dropdown.Item<unknown>> {
    return this.options.slice(1);
  }

  private get hasEnabledDropdownOption(): boolean {
    return this.dropdownOptions.some((x) => !x.disabled);
  }

  render(): VNode {
    return (
      <div class="lp-split-button">
        <Button
          icon={this.icon}
          text={this.text}
          color={this.color}
          tooltip={this.tooltip}
          tooltipPlacement={Tooltip.Placement.TOP}
          disabled={this.disabled}
          loading={this.loading}
          onClick={this.handleClick}
        />
        {this.dropdownOptions.length > 0 && (
          <Dropdown
            options={this.dropdownOptions}
            popupPlacement={Dropdown.Placement.BOTTOM_END}
            onSelect={this.handleSelect}
          >
            <Button icon={Icon.Type.CARET_DOWN_SMALL} color={this.color} disabled={!this.hasEnabledDropdownOption} />
          </Dropdown>
        )}
      </div>
    );
  }

  private handleClick(): void {
    this.firstItem?.onClick?.();
    this.$emit(SplitButton.EVENT_CLICK);
  }

  private handleSelect(item: SplitButton.Item<unknown>): void {
    item.onClick?.();
    this.$emit(SplitButton.EVENT_SELECT, item);
  }
}

namespace SplitButton {
  export type Color = Button.Color;
  export const Color = Button.Color;

  export interface Item<T = undefined> {
    label: string;
    value?: T;
    icon?: Icon.Type;
    disabled?: boolean;
    disabledReason?: string;
    onClick?: () => void;
  }
}

export { SplitButton };
