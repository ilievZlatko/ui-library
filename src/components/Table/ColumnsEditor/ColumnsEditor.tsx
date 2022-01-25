import { isTruthy } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { SlickItem, SlickList } from 'vue-slicksort';
import { VueConstructor } from 'vue/types/umd';
import { cx } from '../../../utils/cx';
import { Button } from '../../Button/Button';
import { Icon } from '../../icon/Icon';
import { Modal } from '../../Modal/Modal';
import { Toggle } from '../../Toggle/Toggle';

import './ColumnsEditor.scss';

const Item = (SlickItem as unknown) as VueConstructor;
const List = (SlickList as unknown) as VueConstructor;

@Component({ name: 'ColumnsEditor' })
class ColumnsEditor extends Vue {
  static readonly EVENT_CHANGE = 'change';

  @Prop({ type: String, required: true })
  readonly storageKey: string;

  @Prop({ type: Array, required: true, validator: columnOrderDescriptorValidator })
  readonly columnOrderDescriptors: Array<ColumnsEditor.ColumnOrderDescriptor>;

  @Prop({ type: Array, required: true, validator: columnOrderDescriptorValidator })
  readonly defaultColumnOrderDescriptors: Array<ColumnsEditor.ColumnOrderDescriptor>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly hidden: boolean;

  private shouldRenderModal: boolean = false;
  private orderableItems: Array<ColumnsEditor.ColumnOrderDescriptor> = [];
  private draggedElement: HTMLElement | null = null;

  private get lockedItems(): Array<ColumnsEditor.ColumnOrderDescriptor> {
    return this.columnOrderDescriptors.filter((x) => x.locked);
  }

  created(): void {
    addEventListener('mouseup', this.onDrop);
    addEventListener('touchstart', this.onDrop);

    const persisted = localStorage.getItem(this.storageKey);

    if (persisted) {
      const parsed: Array<ColumnsEditor.ColumnOrderDescriptor> = JSON.parse(persisted);

      if (this.columnOrderDescriptors.every((x) => parsed.some((y) => y.label === x.label))) {
        this.$emit(ColumnsEditor.EVENT_CHANGE, parsed, true);
      }
    }
  }

  beforeDestroy(): void {
    removeEventListener('mouseup', this.onDrop);
    removeEventListener('touchend', this.onDrop);
  }

  render(): VNode {
    return (
      <div>
        <Button text="Edit Columns" onClick={this.onClick} />
        {this.shouldRenderModal && (
          <Modal bigTitle={true} title="Edit Columns" minHeight="0" onClose={this.onCancel}>
            <div class="edit-columns-description">Select and order the items in the table</div>
            {this.lockedItems.map((column) => (
              <div class="edit-column-item-wrapper">{this.renderColumnItem(column)}</div>
            ))}
            <List
              class="edit-columns-container"
              helperClass="dragged"
              lockAxis="y"
              transitionDuration={200}
              value={this.orderableItems}
              {...{
                on: {
                  'sort-start': this.onSortStart,
                  input: this.onSort
                }
              }}
            >
              {this.orderableItems.map((column, i) => (
                <Item key={column.label} index={i} class="edit-column-item-wrapper">
                  {this.renderColumnItem(column)}
                </Item>
              ))}
            </List>
            <template slot="footer">
              <Button class="edit-columns-reset-button" text="Reset" onClick={this.onReset} />
              <Button text="Cancel" onClick={this.onCancel} />
              <Button color={Button.Color.PRIMARY} text="Apply Changes" onClick={this.onApply} />
            </template>
          </Modal>
        )}
      </div>
    );
  }

  private renderColumnItem({ label, locked, visible }: ColumnsEditor.ColumnOrderDescriptor): VNode {
    return (
      <div class={cx('edit-column-item', { locked })}>
        <Icon type={Icon.Type.DRAG_HANDLE} clickable={false} />
        {label}
        <Toggle
          active={visible ?? true}
          disabled={locked}
          stopPropagation={true}
          onToggle={this.createToggleHandler(label)}
        />
      </div>
    );
  }

  private onClick(): void {
    this.shouldRenderModal = true;
  }

  private onSort(value: Array<ColumnsEditor.ColumnOrderDescriptor>): void {
    this.orderableItems = value;
    this.draggedElement = null;
  }

  private onReset(): void {
    this.orderableItems = this.defaultColumnOrderDescriptors.filter((x) => !x.locked);
  }

  private onCancel(): void {
    this.shouldRenderModal = false;
    this.resetOrder();
  }

  private onApply(): void {
    const columnOrderDescriptors = [...this.lockedItems, ...this.orderableItems];
    this.$emit(ColumnsEditor.EVENT_CHANGE, columnOrderDescriptors, false);
    localStorage.setItem(this.storageKey, JSON.stringify(columnOrderDescriptors));
    this.shouldRenderModal = false;
  }

  private onSortStart(): void {
    this.draggedElement = document.querySelector('body > .edit-column-item-wrapper.dragged');
  }

  private onDrop(): void {
    if (!this.draggedElement) {
      return;
    }

    requestAnimationFrame(() => {
      this.draggedElement?.classList.replace('dragged', 'dropped');
    });
  }

  @Watch('columnOrderDescriptors', { immediate: true })
  private resetOrder(): void {
    this.orderableItems = this.columnOrderDescriptors.filter((x) => !x.locked);
  }

  private createToggleHandler(label: string): (value: boolean) => void {
    return (value) => this.onSort(this.orderableItems.map((x) => (x.label === label ? { ...x, visible: value } : x)));
  }
}

namespace ColumnsEditor {
  export interface ColumnOrderDescriptor {
    label: string;
    visible?: boolean;
    locked?: boolean;
  }

  export function orderColumns<T extends { label: string }>(
    columnOrderDescriptors: Array<ColumnOrderDescriptor>,
    columnDescriptors: Array<T>
  ): Array<T> {
    if (columnDescriptors.some((x) => !columnOrderDescriptors.find((y) => y.label === x.label))) {
      return columnDescriptors;
    }

    return columnOrderDescriptors
      .filter((x) => x.visible ?? true)
      .map((x) => columnDescriptors.find((y) => y.label === x.label))
      .filter(isTruthy);
  }
}

function columnOrderDescriptorValidator(value: Array<ColumnsEditor.ColumnOrderDescriptor>): boolean {
  return new Set(value.map((x) => x.label)).size === value.length;
}

export { ColumnsEditor };
