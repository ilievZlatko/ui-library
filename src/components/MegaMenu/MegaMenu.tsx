import { KeyboardConstants } from 'leanplum-lib-common';
import flatMap from 'lodash/flatMap';
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Icon } from '../icon/Icon';
import { PlaceholderPane } from '../PlaceholderPane/PlaceholderPane';
import { TextInput } from '../TextInput/TextInput';
import { MenuColumn } from './MenuColumn/MenuColumn';

import './MegaMenu.scss';

@Component({ name: 'MegaMenu' })
class MegaMenu<T> extends Vue {
  static readonly EVENT_SELECT = 'select';

  @Prop({
    required: true,
    type: Array,
    // Validates that all the keys passed are unique. Keys must be unique to enable emitting of unique events.
    validator: (value: Array<MegaMenu.Column<T>>) => {
      const allValues = MegaMenu.flattenColumnsToItems(value).map((i) => i.value);

      return new Set(allValues).size === allValues.length;
    }
  })
  readonly config: Array<MegaMenu.Column<T>>;

  @Prop({ required: false, default: '', type: String })
  readonly filterTerm: string;

  mounted(): void {
    window.addEventListener('keyup', this.selectFirstItem);
  }

  beforeDestroy(): void {
    window.removeEventListener('keyup', this.selectFirstItem);
  }

  render(): VNode {
    if (this.visibleColumns.length === 0) {
      return <MegaMenu.EmptyState filterTerm={this.filterTerm} />;
    }

    return (
      <div class="lp-mega-menu">
        <div class="mega-menu-columns">
          {this.visibleColumns.map((column) => (
            <MenuColumn column={column} onSelect={this.onSelect} />
          ))}
        </div>
      </div>
    );
  }

  private onSelect(value: T): void {
    this.$emit(MegaMenu.EVENT_SELECT, value);
  }

  private get visibleColumns(): Array<MegaMenu.Column<T>> {
    return MegaMenu.filterColumns(this.config, this.filterTerm).filter((column) =>
      column.groups.some((group) => group.items.length > 0)
    );
  }

  private selectFirstItem(event: KeyboardEvent): void {
    if (event.key === KeyboardConstants.ENTER_KEY) {
      this.$el.querySelector('a')?.dispatchEvent(new MouseEvent('click'));
    }
  }
}

namespace MegaMenu {
  export interface Column<T = string> {
    groups: Array<Group<T>>;
  }

  export interface Group<T = string> {
    title?: string;
    subtitle?: string;
    columns?: number;
    action?: ActionButton;
    items: Array<Item<T>>;
    additionalRenderer?: () => VNode | null;
    hidden?: boolean;
  }

  export interface Item<T = string> {
    value: T;
    label: string;
    className?: string;
    tooltip?: string;
    description?: string;
    additionalRenderer?: () => VNode | null | false;
    hidden?: boolean;
    disabled?: boolean;
  }

  export interface ActionButton {
    label: string;
    onClick(): void;
  }

  @Component({ name: 'MegaMenu.Search' })
  export class Search extends Vue {
    static readonly EVENT_SEARCH = 'search';
    static readonly EVENT_SUBMIT = 'submit';

    @Prop({ required: false, default: 'Search', type: String })
    readonly searchPlaceholder: string;

    render(): VNode {
      return (
        <TextInput
          placeholder={this.searchPlaceholder}
          icon={Icon.Type.SEARCH}
          autoFocus={true}
          hasClear={true}
          onInput={(value: string): void => {
            this.$emit(Search.EVENT_SEARCH, value);
          }}
          onSubmit={(value: string): void => {
            this.$emit(Search.EVENT_SUBMIT, value);
          }}
        />
      );
    }
  }

  @Component({ name: 'MegaMenu.EmptyState' })
  export class EmptyState extends Vue {
    @Prop({ required: false, default: '', type: String })
    readonly filterTerm: string;

    render(): VNode | null {
      if (!this.filterTerm) {
        return null;
      }

      return (
        <PlaceholderPane
          class="mega-menu-empty"
          text="No results found"
          subText={`Sorry, none of the properties contain "${this.filterTerm}".`}
          icon={Icon.Type.SEARCH}
        />
      );
    }
  }

  /**
   * @param items Array of MegaMenu Column definitions
   * @returns a flattened array of [key, label] pairs for every item in the MegaMenu config
   */
  export function flattenColumnsToItems<T>(items: Array<Column<T>>): Array<Item<T>> {
    return flatMap(
      flatMap(items, (col) => col.groups),
      (g) => g.items
    );
  }

  export function filterGroup<T>(group: Group<T>, searchTerm: string): Group<T> {
    if (!searchTerm) {
      return group;
    }

    return {
      ...group,
      items: filterItems(group.items, searchTerm)
    };
  }

  export function filterColumns<T>(config: Array<Column<T>>, searchTerm: string): Array<Column<T>> {
    if (!searchTerm) {
      return config;
    }

    return config
      .map((column) => ({
        groups: column.groups
          .map((group): Group<T> => filterGroup(group, searchTerm))
          .filter((group) => group.items.length > 0)
      }))
      .filter((column) => column.groups.some((group) => group.items.length > 0));
  }

  export function sumItemsCount<T>(columns: Array<Column<T>>): number {
    return columns.reduce(
      (sum: number, column: Column<T>) => sum + column.groups.reduce((sum, group) => sum + group.items.length, 0),
      0
    );
  }

  export function filterItems<T>(items: Array<Item<T>>, searchTerm: string): Array<Item<T>> {
    return items.filter((x) => !x.hidden && x.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}

export { MegaMenu };
