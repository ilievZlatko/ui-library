import { Throttled } from 'leanplum-lib-common';
import isEqual from 'lodash/isEqual';
import pluralize from 'pluralize';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { cx } from '../../utils/cx';
import { Checkbox } from '../Checkbox/Checkbox';
import { Icon } from '../icon/Icon';
import { Pagination } from '../Pagination/Pagination';
import { Separator } from '../Separator/Separator';
import { ItemRow } from './ItemRow';
import { Comparable, ItemComparator, ItemPredicate, ItemValueGetter, Renderable } from './types';
import { isComparableValue, isFilterableValue } from './utils';

import './Table.scss';

/**
 * Events:
 *   onRowClick(item: Item)
 *   onSelectionChange(items: Array<Item>)
 *   onCurrentItemsChange(pageItems: Array<Item>)
 *   onPageIndexChange(index: number)
 */
@Component({ name: 'Table' })
class Table<Item extends object, Filter = unknown> extends Vue implements Table.Props<Item, Filter> {
  static readonly EVENT_ROW_CLICK = 'rowClick';
  static readonly EVENT_SELECTION_CHANGE = 'selectionChange';
  static readonly EVENT_CURRENT_ITEMS_CHANGE = 'currentItemsChange';
  static readonly EVENT_PAGE_INDEX_CHANGE = 'pageIndexChange';

  static readonly SLOT_EMPTY_STATE = 'emptyState';
  static readonly SLOT_NO_RESULTS_FOUND = 'noSearchResults';
  static readonly SLOT_ACTIONS = 'actions';
  static readonly SLOT_ITEM_MENU = 'itemMenu';
  static readonly SLOT_BULK_SELECT_MENU = 'bulkSelectMenu';

  @Prop({ type: Array, required: false, default: (): Array<Item> => [] })
  readonly items: Array<Item>;

  @Prop({ type: Array, required: true })
  readonly columnDescriptors: Array<Table.ColumnDescriptor<Item, Filter>>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly embedded: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly horizontallyScrollable: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly selectable: boolean;

  @Prop({ type: Number, required: false, default: 10 })
  readonly itemsPerPage: number;

  @Prop({ type: Function, required: true })
  readonly itemKeyGetter!: Table.ItemKeyGetter<Item>;

  @Prop({ type: Function, required: false })
  readonly itemLocationGetter?: Table.ItemLocationGetter<Item>;

  @Prop({ type: Array, required: false, default: (): Array<Item> => [] })
  readonly selected!: Array<Item>;

  @Prop({ type: String, required: false, default: (): Table.RowStyle => Table.RowStyle.BORDERED })
  readonly rowStyle: Table.RowStyle;

  @Prop({ type: [String, Number, Object, Array], required: false, default: null })
  readonly filter: Filter | null;

  @Prop({ type: [Boolean, Function], required: false, default: true })
  readonly clickablePredicate: boolean | ItemPredicate<Item>;

  @Prop({ type: [Boolean, Function], required: false, default: true })
  readonly hoverablePredicate: boolean | ItemPredicate<Item>;

  @Prop({ type: String, required: false, default: '' })
  readonly itemName: string;

  @Prop({ type: Function, required: false, default: Table.defaultColumnIdGetter })
  readonly columnIdGetter: Table.ColumnIdGetter<Item>;

  @Prop({ type: Array, required: false, default: (): Array<Table.SortByDescriptor> => [] })
  readonly sortBy!: Array<Table.SortByDescriptor>;

  @Prop({ type: Function, required: false, default: Table.defaultSortImplementation })
  readonly sortImplementation: Table.SortImplementation<Item>;

  @Prop({ type: Number, required: false, default: 1 })
  readonly pageIndex!: number;

  @Prop({ type: String, required: false, default: undefined })
  readonly highlightedItemKey?: string;

  @Prop({ type: Number, required: false, default: 15 })
  readonly loadingPlaceholdersCount: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly bulkSelectDisabled: boolean;

  readonly $scopedSlots: {
    /**
     * Appears on row hover and replaces last column cell
     */
    [Table.SLOT_ITEM_MENU]?: (item: Item) => Array<VNode>;
    /**
     * Appears in footer when items are selected
     */
    [Table.SLOT_BULK_SELECT_MENU]?: (items: Array<Item>) => Array<VNode>;
  };

  readonly $slots: {
    [Table.SLOT_ACTIONS]?: Array<VNode>;
    [Table.SLOT_NO_RESULTS_FOUND]?: Array<VNode>;
    [Table.SLOT_EMPTY_STATE]?: Array<VNode>;
  };

  readonly $refs: {
    body: HTMLDivElement;
  };

  private selectedItemsKeys: Array<string> = this.selected.map(this.itemKeyGetter);

  private hasScrolledXAxis: boolean = false;
  private hasScrolledXAxisToEnd: boolean = false;

  private internalPageIndex: number = this.pageIndex;
  private internalSortBy: Array<Table.SortByDescriptor> = this.sortBy;

  private resizeObserver?: ResizeObserver;

  private get filteredInternalSortBy(): Array<Table.SortByDescriptor> {
    return this.internalSortBy.filter(({ columnId }) => this.keyedColumns.has(columnId));
  }

  private get comparatorDescriptors(): Array<ComparatorDescriptor<Item>> {
    return this.filteredInternalSortBy.map(({ columnId, direction }) => {
      const column = this.keyedColumns.get(columnId)!;

      return {
        direction,
        comparator: Table.computeColumnComparator(column)
      };
    });
  }

  private get filterableColumnDescriptors(): Array<Table.ColumnDescriptor<Item>> {
    return this.columnDescriptors.filter((column) => column.filterable);
  }

  private get filteredItems(): Array<Item> {
    if (this.filterableColumnDescriptors.length === 0) {
      return this.items;
    }

    return this.items.filter((item) =>
      this.filterableColumnDescriptors.some(
        (col) => col.filter?.(item, this.filter) ?? this.defaultItemFilter(item, col)
      )
    );
  }

  private get sortedAndFilteredItems(): Array<Item> {
    if (this.comparatorDescriptors.length === 0) {
      return this.filteredItems;
    }

    return this.filteredItems.slice().sort((a, b) => {
      const differentiatingDescriptor = this.comparatorDescriptors.find(({ comparator }) => comparator(a, b) !== 0);

      if (!differentiatingDescriptor) {
        return 0;
      }

      const directionCoefficient = differentiatingDescriptor.direction === Table.SortDirection.DESCENDING ? -1 : 1;

      return differentiatingDescriptor.comparator(a, b) * directionCoefficient;
    });
  }

  private get pageItems(): Array<Item> {
    if (this.itemsPerPage < 0) {
      return this.sortedAndFilteredItems;
    }

    const start = (this.internalPageIndex - 1) * this.itemsPerPage;
    const end = this.internalPageIndex * this.itemsPerPage;

    return this.sortedAndFilteredItems.slice(start, end);
  }

  private get pageCount(): number {
    if (this.itemsPerPage < 0) {
      return 1;
    }

    return Math.ceil(this.sortedAndFilteredItems.length / this.itemsPerPage);
  }

  private get filteredItemsCount(): number {
    return this.filteredItems.length;
  }

  private get hasNoData(): boolean {
    return !this.loading && this.items.length === 0;
  }

  private get hasNoResults(): boolean {
    return !this.loading && this.items.length > 0 && this.filteredItems.length === 0;
  }

  private get isEveryPageItemSelected(): boolean {
    return (
      !this.loading &&
      this.filteredItems.length !== 0 &&
      this.pageItems.every((item) => this.keyedSelectedItems.has(this.itemKeyGetter(item)))
    );
  }

  private get isSomePageItemSelected(): boolean {
    return (
      !this.loading &&
      this.filteredItems.length !== 0 &&
      this.pageItems.some((item) => this.keyedSelectedItems.has(this.itemKeyGetter(item)))
    );
  }

  private get shouldApplyScrollXAxisStyles(): boolean {
    return this.horizontallyScrollable && this.columnDescriptors.length > 1;
  }

  private get gridTemplateColumns(): Partial<CSSStyleDeclaration> {
    const SELECT_COLUMN_WIDTH = '33px';
    const FIRST_COLUMN_WIDTH = 'auto';
    const DEFAULT_COLUMN_WIDTH = 'max-content';

    const gridTemplateColumns = [
      this.selectable && SELECT_COLUMN_WIDTH,
      ...this.columnDescriptors.map((x, i) => x.width ?? (i ? DEFAULT_COLUMN_WIDTH : FIRST_COLUMN_WIDTH))
    ]
      .filter(Boolean)
      .join(' ');

    return { gridTemplateColumns };
  }

  private get bodyScrollClassNames(): Record<string, boolean> {
    return {
      'x-scrollable': this.shouldApplyScrollXAxisStyles,
      'x-scrolled': this.hasScrolledXAxis,
      'x-scrolled-end': this.hasScrolledXAxisToEnd
    };
  }

  private get keyedItems(): Map<string, Item> {
    return this.items.reduce((map, item) => map.set(this.itemKeyGetter(item), item), new Map());
  }

  private get keyedSelectedItems(): Map<string, Item> {
    return this.selectedItemsKeys.reduce((map, key) => map.set(key, this.keyedItems.get(key)!), new Map());
  }

  private get selectedItems(): Array<Item> {
    return [...this.keyedSelectedItems.values()];
  }

  private get pageItemsKeys(): Array<string> {
    return this.pageItems.map(this.itemKeyGetter);
  }

  private get hasSelectedAllFilteredItems(): boolean {
    return this.filteredItems.every((item) => this.keyedSelectedItems.has(this.itemKeyGetter(item)));
  }

  private get hasSelectedAllItems(): boolean {
    return this.selectedItems.length === this.items.length;
  }

  private get pluralizedItemName(): string {
    return pluralize(this.itemName);
  }

  private get formattedFilteredItemCount(): string {
    return this.filteredItemsCount.toLocaleString();
  }

  private get footerSummary(): string {
    const firstPageItemHumanIndex = Math.min(
      (this.internalPageIndex - 1) * this.itemsPerPage + 1,
      this.filteredItemsCount
    ).toLocaleString();

    const lastPageItemHumanIndex = Math.min(
      this.internalPageIndex * this.itemsPerPage,
      this.filteredItemsCount
    ).toLocaleString();

    const itemName = this.filteredItemsCount === 1 ? this.itemName : this.pluralizedItemName;

    return `${firstPageItemHumanIndex} - ${lastPageItemHumanIndex} of ${this.formattedFilteredItemCount} ${itemName}`;
  }

  private get selectedSummary(): string {
    const selectedCountFormatted = this.selectedItemsKeys.length.toLocaleString();
    const itemName = this.selectedItemsKeys.length === 1 ? this.itemName : this.pluralizedItemName;

    if (this.hasSelectedAllItems) {
      return `All ${selectedCountFormatted} ${itemName} selected`;
    }

    return `${selectedCountFormatted} of ${this.items.length.toLocaleString()} ${itemName} selected`;
  }

  private get selectAllLabel(): string {
    return `Select All ${this.formattedFilteredItemCount}${this.filter ? ` filtered ${this.pluralizedItemName}` : ''}`;
  }

  private get keyedInternalSortBy(): Map<string, Table.SortDirection> {
    return this.filteredInternalSortBy.reduce(
      (map, { columnId, direction }) => map.set(columnId, direction),
      new Map()
    );
  }

  private get keyedColumns(): Map<string, Table.ColumnDescriptor<Item, Filter>> {
    return this.columnDescriptors.reduce(
      (map, column, index) => map.set(this.columnIdGetter(column, index), column),
      new Map()
    );
  }

  @Watch('pageItemsKeys')
  onPageItemsChange(newValue: Array<string>, oldValue: Array<string>): void {
    if (isEqual(newValue, oldValue)) {
      return;
    }

    this.$emit(Table.EVENT_CURRENT_ITEMS_CHANGE, this.pageItems);
  }

  @Watch('keyedItems')
  onKeyedItemsChange(): void {
    if (this.selectedItemsKeys.length === 0) {
      return;
    }

    const oldSelectionLength = this.selectedItemsKeys.length;
    this.selectedItemsKeys = this.selectedItemsKeys.filter((x) => this.keyedItems.has(x));

    if (oldSelectionLength !== this.selectedItemsKeys.length) {
      this.onSelectionChange();
    }
  }

  @Watch('selected')
  onSelectedItemsPropChange(): void {
    this.selectedItemsKeys = this.selected.map(this.itemKeyGetter);
  }

  @Watch('filteredItemsCount')
  onFilteredItemsCountChange(): void {
    if (this.loading) {
      return;
    }

    this.onPageChange(1);
  }

  @Watch('sortBy')
  onSortByChange(): void {
    this.internalSortBy = this.sortBy;
  }

  @Watch('pageIndex')
  onPageIndexChange(): void {
    this.internalPageIndex = Math.min(Math.max(this.pageIndex, 1), this.pageCount || 1);
  }

  @Watch('internalPageIndex')
  onInternalPageIndexChange(): void {
    this.$refs.body?.scrollTo({ top: 0 });
  }

  @Watch('columnDescriptors')
  onColumnDescriptorsChange(): void {
    this.computeHorizontalScrollStyle();
  }

  @Watch('loading')
  onLoadingChange(): void {
    this.computeHorizontalScrollStyle();
  }

  mounted(): void {
    this.resizeObserver = new ResizeObserver(this.throttledComputeHorizontalScrollStyles);
    this.resizeObserver.observe(this.$el);
    if (this.shouldApplyScrollXAxisStyles) {
      this.$refs.body.addEventListener('scroll', this.throttledComputeHorizontalScrollStyles, { passive: true });

      this.computeHorizontalScrollStyle();
    }
  }

  beforeDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.shouldApplyScrollXAxisStyles) {
      this.$refs.body.removeEventListener('scroll', this.throttledComputeHorizontalScrollStyles);
    }
  }

  render(): VNode {
    const bodyClassNames = cx('lp-table-body', this.bodyScrollClassNames, {
      highlightable: this.highlightedItemKey !== undefined
    });

    return (
      <div class={cx('lp-table', { embedded: this.embedded })}>
        {this.renderActions()}
        <div class={bodyClassNames} style={this.gridTemplateColumns} ref="body">
          {this.renderHeader()}
          {this.loading ? this.renderLoadingRows() : this.pageItems.map(this.renderRow)}
        </div>
        {this.hasNoData && this.$slots[Table.SLOT_EMPTY_STATE]}
        {this.hasNoResults && this.$slots[Table.SLOT_NO_RESULTS_FOUND]}
        {this.renderFooter()}
      </div>
    );
  }

  private renderActions(): VNode | null {
    if (this.hasNoData) {
      return null;
    }

    if (!this.$slots[Table.SLOT_ACTIONS]) {
      return null;
    }

    return <div class="lp-table-actions">{this.$slots[Table.SLOT_ACTIONS]}</div>;
  }

  private renderHeader(): VNode | null {
    if (this.hasNoData || this.hasNoResults) {
      return null;
    }

    return (
      <div class="lp-table-header">
        {this.selectable && (
          <div
            class={cx('lp-table-cell lp-table-select-cell', { sticky: this.shouldApplyScrollXAxisStyles })}
            onClick={this.onSelectAll}
          >
            <Checkbox
              checked={this.isEveryPageItemSelected}
              indeterminate={!this.isEveryPageItemSelected && this.isSomePageItemSelected}
              disabled={this.bulkSelectDisabled}
            />
          </div>
        )}
        {this.columnDescriptors.map(this.renderHeaderCell)}
      </div>
    );
  }

  private renderLoadingRows(): Array<VNode> {
    return Array(this.loadingPlaceholdersCount)
      .fill(null)
      .map(this.renderLoadingRow);
  }

  private renderRow(item: Item, index: number): VNode {
    const key = this.itemKeyGetter(item);
    const selected = this.keyedSelectedItems.has(key);

    return (
      <ItemRow
        item={item}
        index={index}
        itemKeyGetter={this.itemKeyGetter}
        itemLocationGetter={this.itemLocationGetter}
        rowStyle={this.rowStyle}
        highlighted={key === this.highlightedItemKey}
        clickablePredicate={this.clickablePredicate}
        hoverablePredicate={this.hoverablePredicate}
        selectable={this.selectable}
        horizontallyScrollable={this.shouldApplyScrollXAxisStyles}
        selected={selected}
        columns={this.columnDescriptors}
        scopedSlots={this.$scopedSlots}
        onClick={this.onRowClick}
        onSelect={this.onSelect}
      />
    );
  }

  private renderLoadingRow(x: unknown, index: number): VNode {
    return (
      <ItemRow
        rowStyle={this.rowStyle}
        horizontallyScrollable={this.shouldApplyScrollXAxisStyles}
        clickablePredicate={this.clickablePredicate}
        hoverablePredicate={this.hoverablePredicate}
        columns={this.columnDescriptors}
        loading={true}
        selectable={this.selectable}
        index={index}
      />
    );
  }

  private renderFooter(): VNode | null {
    if (this.hasNoData || this.hasNoResults) {
      return null;
    }

    if (this.itemsPerPage < 0) {
      return <div class="lp-table-footer-accommodation" />;
    }

    const bulkMenuSlot = this.$scopedSlots[Table.SLOT_BULK_SELECT_MENU];

    return (
      <div class="lp-table-footer">
        {this.renderFooterSummary()}
        {this.selectedItemsKeys.length > 0 && bulkMenuSlot && [<Separator />, bulkMenuSlot(this.selectedItems)]}
        {this.pageCount > 1 && (
          <Pagination current={this.internalPageIndex} count={this.pageCount} onChange={this.onPageChange} />
        )}
      </div>
    );
  }

  private renderFooterSummary(): Array<VNode | boolean> | VNode | null {
    if (this.loading) {
      return null;
    }

    if (this.selectedItemsKeys.length === 0) {
      return <div class="lp-table-footer-pagination-info">{this.footerSummary}</div>;
    }

    const shouldRenderSelectAllAction = this.isEveryPageItemSelected && !this.hasSelectedAllFilteredItems;

    return [
      <div class="lp-table-footer-selection-info">{this.selectedSummary}</div>,
      shouldRenderSelectAllAction && !this.bulkSelectDisabled && (
        <div class="lp-table-footer-bulk-select-action" onClick={this.selectAll}>
          {this.selectAllLabel}
        </div>
      ),
      <div class="lp-table-footer-bulk-select-action" onClick={this.unselectAll}>
        Clear Selection
      </div>
    ];
  }

  private renderHeaderCell(column: Table.ColumnDescriptor<Item>, index: number): VNode {
    const columnId = this.columnIdGetter(column, index);
    const direction = this.keyedInternalSortBy.get(columnId)!;

    const className = cx('lp-table-cell', column.align ?? Table.CellAlignment.START, {
      highlighted: column.highlight || (column.sortable && Boolean(direction)),
      sticky: this.shouldApplyScrollXAxisStyles && index === 0,
      sortable: column.sortable,
      sorted: Boolean(direction)
    });

    const content = this.renderColumnContent(column);

    return (
      <div
        class={className}
        {...{
          on: column.sortable && {
            click: (): void => this.onSortIconClick(column, index)
          }
        }}
      >
        {column.sortable ? <div class="lp-table-header-cell-content">{content}</div> : content}
        {column.sortable && (
          <Icon
            class={cx('lp-table-sort-icon', {
              inverted: direction === Table.SortDirection.DESCENDING
            })}
            type={Icon.Type.ARROW_UP}
          />
        )}
      </div>
    );
  }

  private renderColumnContent(column: Table.ColumnDescriptor<Item>): Renderable {
    return column.headerRenderer?.(column) ?? column.label;
  }

  private onPageChange(page: number): void {
    this.internalPageIndex = page;
    this.$emit(Table.EVENT_PAGE_INDEX_CHANGE, page);
  }

  private onSelectAll(): void {
    if (this.bulkSelectDisabled) {
      return;
    }

    const keys = new Set(this.pageItemsKeys);

    if (this.isEveryPageItemSelected) {
      this.selectedItemsKeys = this.selectedItemsKeys.filter((x) => !keys.has(x));
    } else {
      this.selectedItemsKeys = [...new Set([...this.selectedItemsKeys, ...keys])];
    }

    this.onSelectionChange();
  }

  private onSelect(itemKey: string, value: boolean): void {
    if (value) {
      this.selectedItemsKeys.push(itemKey);
    } else {
      this.selectedItemsKeys = this.selectedItemsKeys.filter((x) => x !== itemKey);
    }

    this.onSelectionChange();
  }

  private onRowClick(item: Item): void {
    this.$emit(Table.EVENT_ROW_CLICK, item);
  }

  private onSelectionChange(): void {
    this.$emit(Table.EVENT_SELECTION_CHANGE, this.selectedItems);
  }

  @Throttled(100)
  private throttledComputeHorizontalScrollStyles(): void {
    this.computeHorizontalScrollStyle();
  }

  private async computeHorizontalScrollStyle(): Promise<void> {
    await this.$nextTick();
    const target = this.$refs.body;
    this.hasScrolledXAxis = target.scrollLeft > 0;
    this.hasScrolledXAxisToEnd = target.scrollLeft + target.clientWidth === target.scrollWidth;
  }

  private onSortIconClick(column: Table.ColumnDescriptor<Item>, index: number): void {
    const columnId = this.columnIdGetter(column, index);
    const direction = this.keyedInternalSortBy.get(columnId)!;

    this.internalSortBy = this.sortImplementation({ columnId, direction }, column, this.filteredInternalSortBy);
  }

  onResize(): void {
    this.computeHorizontalScrollStyle();
  }

  private selectAll(): void {
    const filteredItemsKeys = this.filteredItems.map(this.itemKeyGetter);
    this.selectedItemsKeys = [...new Set([...this.selectedItemsKeys, ...filteredItemsKeys])];
    this.onSelectionChange();
  }

  private unselectAll(): void {
    this.selectedItemsKeys = [];
    this.onSelectionChange();
  }

  private defaultItemFilter(item: Item, column: Table.ColumnDescriptor<Item>): boolean {
    if (!isFilterableValue(this.filter)) {
      return true;
    }

    const itemValue = Table.getItemValue(column, item);

    if (!isFilterableValue(itemValue)) {
      return true;
    }

    return String(itemValue)
      .toLowerCase()
      .includes(String(this.filter).toLowerCase());
  }

  private static defaultValueComparator(a: Comparable, b: Comparable): number {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }

    if (a === null || a === undefined) {
      return -1;
    }

    if (b === null || b === undefined) {
      return 1;
    }

    return Number(a < b ? -1 : a > b);
  }

  private static computeColumnComparator<Item>(column: Table.ColumnDescriptor<Item>): ItemComparator<Item> {
    if (column.comparator) {
      return column.comparator;
    }

    return (a, b) => Table.defaultValueComparator(Table.getItemValue(column, a), Table.getItemValue(column, b));
  }

  private static getFollowingSortDirection(value?: Table.SortDirection): Table.SortDirection | undefined {
    switch (value) {
      case Table.SortDirection.ASCENDING:
        return Table.SortDirection.DESCENDING;
      case Table.SortDirection.DESCENDING:
        return undefined;
      default:
        return Table.SortDirection.ASCENDING;
    }
  }

  private static defaultColumnIdGetter<Item>(column: Table.ColumnDescriptor<Item>, index: number): string {
    return column.label ?? index.toString();
  }

  private static defaultSortImplementation({
    columnId,
    direction
  }: Table.SortByDescriptor): Array<Table.SortByDescriptor> {
    const following = Table.getFollowingSortDirection(direction);

    return following ? [{ columnId, direction: following }] : [];
  }

  private static getItemValue<Item>(column: Table.ColumnDescriptor<Item>, item: Item): Comparable {
    if (column.valueGetter) {
      return column.valueGetter(item);
    }

    if (column.key) {
      const value = item[column.key];

      if (isComparableValue(value)) {
        return value;
      }
    }
  }
}

interface ComparatorDescriptor<Item> {
  comparator: ItemComparator<Item>;
  direction: Table.SortDirection;
}

namespace Table {
  export interface Props<Item, Filter = unknown> {
    columnDescriptors: Array<ColumnDescriptor<Item, Filter>>;

    items: Array<Item>;

    /**
     * Returns unique identifying value for each item.
     */
    itemKeyGetter: ItemKeyGetter<Item>;

    /**
     * Returns vue-router location for each item.
     */
    itemLocationGetter?: ItemLocationGetter<Item>;

    /**
     * Renders 15 rows that render loading placeholders per column.
     */
    loading?: boolean;

    /**
     * Wether to remove shadow box and border-radius of table container.
     */
    embedded?: boolean;

    /**
     * Renders select row checkboxes.
     */
    selectable?: boolean;

    /**
     * Amount of items per table page.
     * If -1 is provided, all items are going to be rendered on 1 page, without rendering the footer.
     */
    itemsPerPage?: number;

    /**
     * Array of preselected items.
     */
    selected?: Array<Item>;

    rowStyle?: Table.RowStyle;

    /**
     * Additional argument that is passed to columnDescriptor.filter.
     * Calls onChange when it gets updates.
     * By default if it is an instance of string it will be used to filter (case-insensitive)
     * all filterable columns by checking wether it is contained in item[columnDescriptor.key].
     */
    filter?: Filter | null;

    /**
     * Called for each item, applies clickable styles if the predicate returns true.
     */
    clickablePredicate?: boolean | ItemPredicate<Item>;

    /**
     * Called for each item, applies hoverable styles if the predicate returns true.
     */
    hoverablePredicate?: boolean | ItemPredicate<Item>;

    /**
     * Name of entity in singular form ex.: "campaign", "audience".
     */
    itemName?: string;

    /**
     * Non-reactive.
     * Enables horizontal scrolling and applies sticky styling to first column
     */
    horizontallyScrollable?: boolean;

    /**
     * Returns unique identifying value for each column.
     * Default implementation returns label and fallbacks to index.
     */
    columnIdGetter?: Table.ColumnIdGetter<Item>;

    /**
     * Describes currently applied sort state.
     * Order infers sort priority.
     */
    sortBy?: Array<SortByDescriptor>;

    /**
     * Function executed on sortable header click.
     * Computes sortBy state based on the clicked header.
     * Default one supports sorting only by 1 column, cycling between 3 states:
     * asc -> desc -> unsorted -> ...
     */
    sortImplementation?: Table.SortImplementation<Item>;

    /**
     * Item key value that determines highlighted row.
     * Value is compared against all items' itemKeyGetter value.
     */
    highlightedItemKey?: string | null;

    /**
     * Active page index.
     * Starts from 1.
     */
    pageIndex?: number;

    /**
     * Amount of loading placeholders for default loading state.
     * Defaults to 15.
     */
    loadingPlaceholdersCount?: number;

    /**
     * Disables bulk select checkbox & does not render select all items shortcut.
     */
    bulkSelectDisabled?: boolean;
  }

  export interface ColumnDescriptor<Item, Filter = unknown> {
    label?: string;

    /**
     * Custom template for each head cell.
     */
    headerRenderer?: (column: ColumnDescriptor<Item>) => Renderable;

    /**
     * Renders string value of item[key].
     * Value is used for default sorting comparator and default filter predicate.
     * If omitted you would need to provide custom comparator.
     */
    key?: keyof Item;

    /**
     * Renders string value of valueGetter(item).
     * Value is used for default sorting comparator and default filter predicate.
     * If omitted you would need to provide custom comparator.
     */
    valueGetter?: ItemValueGetter<Item>;

    /**
     * Custom template for each item cell.
     */
    itemRenderer?: (item: Item, column: ColumnDescriptor<Item>, isRowHovered: boolean) => Renderable;

    align?: Table.CellAlignment;

    width?: string;

    /**
     * Renders sort icon next to the header.
     * Applies sort by column.comparator or default one.
     * Defaults to false.
     */
    sortable?: boolean;

    /**
     * Renders loading placeholders only for that column.
     */
    loading?: boolean;

    /**
     * Provide in ascending order.
     * Default one compares item[key].valueOf().
     */
    comparator?: ItemComparator<Item>;

    /**
     * Applies filter by column.filter or default one.
     */
    filterable?: boolean;

    /**
     * TODO: rename and keep only private implementation.
     * Applies highlighted typography to header.
     */
    highlight?: boolean;

    /**
     * Predicate which filters items rows.
     */
    filter?: (item: Item, filter: Filter) => boolean;
  }

  export enum CellAlignment {
    START = 'start',
    CENTER = 'center',
    END = 'end',
    STRETCH = 'stretch'
  }

  export enum SortDirection {
    ASCENDING = 'ascending',
    DESCENDING = 'descending'
  }

  export enum RowStyle {
    STRIPED = 'striped',
    BORDERED = 'bordered'
  }

  export type ItemKeyGetter<Item> = (item: Item) => string;

  export type ColumnIdGetter<Item> = (column: ColumnDescriptor<Item>, index: number) => string;

  export type ItemLocationGetter<Item> = (item: Item) => RawLocation;

  export interface SortByDescriptor {
    columnId: string;
    direction: Table.SortDirection;
  }

  export type SortImplementation<Item> = (
    descriptor: Table.SortByDescriptor,
    column: Table.ColumnDescriptor<Item>,
    sortBy: Array<SortByDescriptor>
  ) => Array<SortByDescriptor>;
}

export { Table };
