import { Debounced } from 'leanplum-lib-common';
import { VNode } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Pagination } from '../Pagination/Pagination';

import './ListView.scss';

@Component({ name: 'ListView' })
class ListView<ItemType> extends Vue {
  static readonly EVENT_CLICK = 'click';

  @Prop({ required: true, type: Array })
  readonly items: Array<ItemType>;

  @Prop({ required: false, default: null, type: Number })
  readonly activeIndex: number | null;

  @Prop({ required: false, default: 0, type: Number })
  readonly paginateBy: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  $refs: {
    view: HTMLDivElement;
  };

  $scopedSlots: {
    item: (item: ItemType) => Array<VNode>;
  };

  private currentPageIndex: number = 1;

  private get itemsOffset(): number {
    return (this.currentPageIndex - 1) * this.paginateBy;
  }

  private get paginatedActiveIndex(): number | null {
    if (this.activeIndex === null) {
      return null;
    }

    if (this.pagesCount === 1) {
      return this.activeIndex;
    }

    return this.activeIndex - this.itemsOffset;
  }

  private get pagesCount(): number {
    return (this.paginateBy && Math.ceil(this.items.length / this.paginateBy)) || 1;
  }

  private get paginatedItems(): Array<ItemType> {
    if (this.pagesCount === 1) {
      return this.items;
    }

    return this.items.slice(this.itemsOffset, this.paginateBy + this.itemsOffset);
  }

  @Watch('activeIndex', { immediate: true })
  onActiveIndexUpdated(): void {
    if (this.activeIndex && this.activeIndex > -1) {
      this.currentPageIndex = this.paginateBy ? Math.ceil(this.activeIndex / this.paginateBy) : this.activeIndex;
    }
  }

  @Watch('items', { immediate: true })
  async onItemsUpdated(): Promise<void> {
    if (this.paginatedActiveIndex) {
      // Await the elements to be mounted on the real dom.
      await this.$nextTick();
      this.$el?.children[0].children[this.paginatedActiveIndex]?.scrollIntoView({ block: 'center' });
    } else {
      // Vue doesn't reset the scroll position on items update and the scroll logic depends on it.
      this.$refs.view?.scrollTo({ top: 0 });
    }

    this.updateScrollState();
  }

  render(): VNode {
    if (!this.$scopedSlots.item) {
      throw new Error('You must pass an "item" scoped slot.');
    }

    return (
      <div ref="view" class={cx('lp-list-view-wrapper', { disabled: this.disabled })} onScroll={this.updateScrollState}>
        <ul class="lp-list-view">
          {this.paginatedItems.map((item, index) => (
            <li
              key={`item-${index + this.currentPageIndex * this.paginateBy}`}
              class={cx('list-item', { active: this.paginatedActiveIndex === index })}
              onClick={() => this.onClick(item)}
            >
              {this.$scopedSlots.item(item)}
            </li>
          ))}
        </ul>
        {this.pagesCount > 1 && (
          <Pagination current={this.currentPageIndex} count={this.pagesCount} onChange={this.onPageChange} />
        )}
      </div>
    );
  }

  private onPageChange(value: number): void {
    this.currentPageIndex = value;
  }

  private onClick(item: ItemType): void {
    if (this.disabled) {
      return;
    }

    this.$emit(ListView.EVENT_CLICK, item);
  }

  @Debounced(100, { leading: true })
  private updateScrollState(): void {
    const view = this.$refs.view;
    if (view) {
      const isScrollable = view.scrollHeight > view.clientHeight;

      if (isScrollable) {
        view.classList.add('scrollable');
      } else {
        view.classList.remove('scrollable');
      }

      if (isScrollable && view.scrollTop > 0) {
        view.classList.add('scrolled');
      } else {
        view.classList.remove('scrolled');
      }

      if (isScrollable && view.scrollTop + view.clientHeight >= view.scrollHeight) {
        view.classList.add('scrolled-to-end');
      } else {
        view.classList.remove('scrolled-to-end');
      }
    }
  }
}

export { ListView };
