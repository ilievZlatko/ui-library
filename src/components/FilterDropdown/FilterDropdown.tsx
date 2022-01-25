import { oneOf } from 'leanplum-lib-common';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../icon/Icon';

import './FilterDropdown.scss';

@Component({ name: 'FilterDropdown' })
class FilterDropdown extends Vue {
  static readonly EVENT_CHANGE: string = 'change';

  @Prop({ type: Array, required: true })
  readonly options: Array<FilterDropdown.Item>;

  @Prop({ type: String, required: true })
  readonly text: string;

  @Prop({ type: String, required: false, default: null })
  readonly textAll: string | null;

  @Prop({ type: Array, required: true })
  readonly selected: Array<FilterDropdown.Item>;

  @Prop({
    type: String,
    required: false,
    default: () => FilterDropdown.BadgeMode.NOT_ALL,
    validator: (value) => oneOf(values(FilterDropdown.BadgeMode))(value)
  })
  readonly badgeMode: FilterDropdown.BadgeMode;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  private get dropdownOptions(): Array<FilterDropdown.Item> {
    return this.options.map((item) => ({ ...item, customRenderer: this.renderItem }));
  }

  private get areAllOptionsSelected(): boolean {
    return this.selected.length === this.options.length;
  }

  private get textWhenAllSelected(): string {
    return this.textAll || `All ${this.text}`;
  }

  private get shouldShowBadge(): boolean {
    switch (this.badgeMode) {
      case FilterDropdown.BadgeMode.NOT_ALL:
        return !this.areAllOptionsSelected;
      case FilterDropdown.BadgeMode.NOT_NONE:
        return this.selected.length > 0;
      case FilterDropdown.BadgeMode.ALWAYS:
        return true;
      case FilterDropdown.BadgeMode.NEVER:
        return false;
      default:
        throw Error('Unexpected badge mode');
    }
  }

  render(): VNode {
    return (
      <Dropdown
        class="lp-filter-dropdown"
        options={this.dropdownOptions}
        onSelect={this.onSelect}
        popupPlacement={Dropdown.Placement.BOTTOM_END}
        closeOnSelect={false}
        disabled={this.disabled}
      >
        <template slot="header">{this.$slots.header}</template>
        <Button
          badge={this.shouldShowBadge ? this.selected.length.toString() : null}
          text={this.areAllOptionsSelected ? this.textWhenAllSelected : this.text}
          icon={Icon.Type.CARET_DOWN_SMALL}
          iconPlacement={Button.IconPlacement.RIGHT}
          disabled={this.disabled}
        />
      </Dropdown>
    );
  }

  private renderItem(filterOption: FilterDropdown.Item): VNode {
    return (
      <div class="filter-dropdown-type-option">
        <Checkbox
          class="filter-dropdown-type-checkbox"
          stopPropagation={true}
          checked={this.selected.some((option) => option.value === filterOption.value)}
        />
        {filterOption.icon && (
          <Icon class="filter-dropdown-type-icon" type={filterOption.icon} />
        )}
        {filterOption.label}
      </div>
    );
  }

  private onSelect(filterOption: FilterDropdown.Item): void {
    this.$emit(
      FilterDropdown.EVENT_CHANGE,
      this.selected.some((option) => option.value === filterOption.value)
        ? this.selected.filter((option) => option.value !== filterOption.value)
        : [...this.selected, filterOption]
    );
  }
}

namespace FilterDropdown {
  export enum BadgeMode {
    NOT_ALL = 'NOT_ALL', // show badge when not all items are selected
    NOT_NONE = 'NOT_NONE', // show badge when one or more items is selected
    ALWAYS = 'ALWAYS', // show badge always
    NEVER = 'NEVER' // show badge never
  }

  export interface Item<T = string> extends Dropdown.Item<T> {
    badge?: number;
  }
}

export { FilterDropdown };
