import { oneOf } from 'leanplum-lib-common';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Button } from '../Button/Button';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../icon/Icon';
import { Radio } from '../Radio/Radio';
import { Table } from '../Table/Table';

import './SortDropdown.scss';

@Component({ name: 'SortDropdown' })
class SortDropdown extends Vue {
  static readonly EVENT_CHANGE_DIRECTION: string = 'changeDirection';
  static readonly EVENT_CHANGE_OPTION: string = 'changeOption';

  private static readonly isSortDirection: (value: string) => value is Table.SortDirection = oneOf(
    values(Table.SortDirection)
  );

  @Prop({ type: Array, required: false, default: (): Array<string> => [] })
  readonly options: Array<string>;

  @Prop({ type: String, required: false, default: null })
  readonly direction: Table.SortDirection | null;

  @Prop({ type: String, required: true })
  readonly sortBy: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  private get items(): Dropdown.Options<string | Table.SortDirection> {
    const options: Dropdown.Options<string> = [
      { header: 'Sort by' },
      ...this.options.map((label) => ({
        label,
        value: label,
        customRenderer: this.createOptionRenderer(this.sortBy, this.changeOption)
      }))
    ];

    const directions: Dropdown.Options<Table.SortDirection> = [
      { header: 'Sort order' },
      {
        label: 'Ascending',
        value: Table.SortDirection.ASCENDING,
        customRenderer: this.createOptionRenderer(this.direction, this.changeDirection)
      },
      {
        label: 'Descending',
        value: Table.SortDirection.DESCENDING,
        customRenderer: this.createOptionRenderer(this.direction, this.changeDirection)
      }
    ];

    return this.options.length > 1 ? [...options, ...directions] : directions;
  }

  render(): VNode {
    return (
      <Dropdown
        class="lp-sort-dropdown"
        options={this.items}
        popupPlacement={Dropdown.Placement.BOTTOM_END}
        disabled={this.disabled}
        onSelect={this.onSelect}
      >
        <Button
          icon={Icon.Type.CARET_DOWN_SMALL}
          iconPlacement={Button.IconPlacement.RIGHT}
          text={`Sort by ${this.sortBy}`}
          disabled={this.disabled}
        />
      </Dropdown>
    );
  }

  private onSelect({ value }: Dropdown.Item<Table.SortDirection | string>): void {
    if (SortDropdown.isSortDirection(value!)) {
      this.changeDirection(value);
    } else {
      this.changeOption(value!);
    }
  }

  private createOptionRenderer<T>(selected: T, onSelect: (item: T) => void): (item: Dropdown.Item<T>) => VNode {
    return ({ value, label }) => (
      <div class="sort-dropdown-option">
        <Radio
          class="sort-dropdown-radio"
          checked={value === selected}
          stopPropagation={true}
          onSelect={() => onSelect(value!)}
        />
        {label}
      </div>
    );
  }

  private changeDirection(value: Table.SortDirection): void {
    this.$emit(SortDropdown.EVENT_CHANGE_DIRECTION, value);
  }

  private changeOption(value: string): void {
    this.$emit(SortDropdown.EVENT_CHANGE_OPTION, value);
  }
}

namespace SortDropdown {
  export const SortDirection = Table.SortDirection;
  export type SortDirection = Table.SortDirection;
}

export { SortDropdown };
