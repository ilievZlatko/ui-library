import { preventDefault, stopPropagationAndPreventDefault } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { cx } from '../../utils/cx';
import { Checkbox } from '../Checkbox/Checkbox';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { Table } from './Table';
import { ItemPredicate, Renderable } from './types';

@Component({ name: 'ItemRow' })
class ItemRow<Item> extends Vue {
  static readonly EVENT_CLICK = 'click';
  static readonly EVENT_SELECT = 'select';

  @Prop({ required: false })
  readonly item: Item;

  @Prop({ type: Number, required: true })
  readonly index: number;

  @Prop({ type: String, required: true })
  readonly rowStyle: string;

  @Prop({ type: Array, required: true })
  readonly columns: Array<Table.ColumnDescriptor<Item>>;

  @Prop({ type: [Boolean, Function], required: false, default: false })
  readonly clickablePredicate: boolean | ItemPredicate<Item>;

  @Prop({ type: [Boolean, Function], required: false, default: false })
  readonly hoverablePredicate: boolean | ItemPredicate<Item>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly selectable: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly selected: boolean;

  @Prop({ type: Function, required: false, default: null })
  readonly itemKeyGetter: Table.ItemKeyGetter<Item> | null;

  @Prop({ type: Function, required: false })
  readonly itemLocationGetter?: Table.ItemLocationGetter<Item>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly horizontallyScrollable: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly highlighted: boolean;

  readonly $scopedSlots: {
    /**
     * Appears on row hover and replaces last column cell
     */
    [Table.SLOT_ITEM_MENU]?: (item: Item) => Array<VNode>;
  };

  private hasBeenHovered: boolean = false;
  private isHovered: boolean = false;

  private get className(): string {
    return cx('lp-table-row', this.rowStyle, {
      hoverable: this.applyItemPredicate(this.hoverablePredicate),
      clickable: this.applyItemPredicate(this.clickablePredicate),
      highlighted: this.highlighted
    });
  }

  private get itemKey(): string | null {
    return this.itemKeyGetter?.(this.item) ?? null;
  }

  private get location(): RawLocation | null {
    return this.itemLocationGetter?.(this.item) ?? null;
  }

  render(): VNode {
    const Row = this.location ? 'router-link' : 'div';

    const events = {
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
      click: this.onClick
    };

    return (
      <Row to={this.location} class={this.className} {...{ [this.location ? 'nativeOn' : 'on']: events }}>
        {this.selectable && (
          <div
            class={cx('lp-table-cell lp-table-select-cell', { sticky: this.horizontallyScrollable })}
            onClick={this.onSelect}
          >
            <Checkbox checked={this.selected} disabled={this.loading} />
          </div>
        )}
        {this.columns.map(this.renderCell)}
      </Row>
    );
  }

  private renderCellContent(column: Table.ColumnDescriptor<Item>): Renderable | Item[keyof Item] {
    if (this.loading || column.loading) {
      return <div class="lp-table-loading-placeholder" />;
    }

    if (column.itemRenderer) {
      return column.itemRenderer(this.item, column, this.isHovered);
    }

    const value = column.valueGetter ? column.valueGetter(this.item) : column.key && this.item[column.key];

    return value && <OverflowableText text={String(value)} />;
  }

  private renderCell(column: Table.ColumnDescriptor<Item>, index: number): VNode {
    const isLastCellInTheRow = index === this.columns.length - 1;
    const className = cx('lp-table-cell', column.align ?? Table.CellAlignment.START, {
      sticky: this.horizontallyScrollable && index === 0,
      ['item-menu-wrapper']: isLastCellInTheRow
    });

    return (
      <div class={className}>
        {this.renderCellContent(column)}
        {isLastCellInTheRow && this.renderMenu()}
      </div>
    );
  }

  private renderMenu(): VNode | null {
    const slot = this.$scopedSlots[Table.SLOT_ITEM_MENU];

    if (!slot || !this.hasBeenHovered) {
      return null;
    }

    return (
      <transition appear={true}>
        <div class="lp-table-item-menu" onClick={stopPropagationAndPreventDefault} onContextmenu={preventDefault}>
          {slot(this.item)}
        </div>
      </transition>
    );
  }

  private onSelect(event: PointerEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.loading) {
      return;
    }

    this.$emit(ItemRow.EVENT_SELECT, this.itemKey, !this.selected);
  }

  private onClick(): void {
    if (this.loading) {
      return;
    }

    this.$emit(ItemRow.EVENT_CLICK, this.item);
  }

  private onMouseEnter(): void {
    this.hasBeenHovered = true;
    this.isHovered = true;
  }

  private onMouseLeave(): void {
    this.isHovered = false;
  }

  private applyItemPredicate(predicate: ItemPredicate<Item> | boolean): boolean {
    return !!this.item && (typeof predicate === 'function' ? predicate(this.item) : predicate);
  }
}

export { ItemRow };
