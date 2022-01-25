import { Debounced, KeyboardConstants } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { VNodeEventManager } from '../../utils/VNodeEventManager';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from '../icon/Icon';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { TextInput } from '../TextInput/TextInput';
import { Tooltip } from '../Tooltip/Tooltip';

import './Dropdown.scss';

// private enum - no need to be part of the Dropdown namespace.
enum Direction {
  UP = -1,
  NONE = 0,
  DOWN = 1
}

const INIT_DELAY = 1400;
const UPDATE_DELAY = 300;

// tslint:disable:jsdoc-format
/**
 * Dropdown component.
 *
 * A component that can wrap another component and use it as an anchor for a popup.
 * Basic usage:
 * ```
<Dropdown options={[{ label: 'Hello' }]}>
  <button value="Open Dropdown"/>
  <SearchInput slot="header"/>
</Dropdown>
 *```
 *
 * Has 2 slots - **default** and **header**.
 * * The **default** slot is for the anchor to which the dropdown attaches.
 * * The **header** slot is inserted at the top of the dropdown popup. Can
 * be used for search inputs, titles, warnings, etc.
 *
 * @event select: Fired when the user selects an option. Provides the selected `DropdownItem` as param.
 *
 * @event close: Fired when the dropdown popup was closed.
 *
 * @author Deyan Gunchev
 */
@Component({ name: 'Dropdown' })
class Dropdown extends Vue {
  private static readonly DEFAULT_STARTING_INDEX: number = -1;

  @Prop({ type: Array, required: true })
  readonly options: Dropdown.Options;

  @Prop({ type: String, required: false, default: '' })
  readonly filter: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly enableSearch: boolean;

  @Prop({ type: String, required: false, default: '' })
  readonly popupClass: string;

  @Prop({ type: String, required: false, default: AnchoredPopup.Placement.BOTTOM_START })
  readonly popupPlacement: AnchoredPopup.Placement;

  @Prop({ type: Boolean, required: false, default: false })
  readonly alignWidths: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: [Object, String], required: false, default: null })
  readonly selectedItem: Dropdown.Item | string | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly stopAnchorClickPropagation: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly closeOnMouseLeave: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly closeOnSelect: boolean;

  private opened: boolean = false;
  private focusedIndex: number = Dropdown.DEFAULT_STARTING_INDEX;
  private selectedIndex: number = Dropdown.DEFAULT_STARTING_INDEX;
  private timeoutHandler: NodeJS.Timeout;
  private currentOptions: Array<Dropdown.Item | Dropdown.HeaderSeparator> = [];
  private searchTerm: string = '';
  private events: VNodeEventManager = new VNodeEventManager();

  $refs: {
    anchor: HTMLDivElement;
    list: HTMLUListElement;
  };

  @Watch('filter')
  onFilterChange(): void {
    this.updateSelection();
  }

  @Watch('selectedItem')
  onSelectedChange(): void {
    if (this.selectedItem) {
      this.selectedIndex = this.selectedOption
        ? this.currentOptions.indexOf(this.selectedOption)
        : Dropdown.DEFAULT_STARTING_INDEX;
      this.updateFocusedIndex();
    } else {
      this.selectedIndex = Dropdown.DEFAULT_STARTING_INDEX;
    }
  }

  @Watch('options')
  onOptionsChange(): void {
    const options: Dropdown.Options = Dropdown.hasStringOptions(this.options)
      ? this.options.map((option) => ({ label: option }))
      : this.options;

    this.currentOptions = options;
    if (this.selectedItem) {
      this.onSelectedChange();
    }
    this.updateFocusedIndex();
  }

  @Watch('focusedIndex')
  onFocusedIndexChange(): void {
    this.$refs.list?.children[this.focusedIndex]?.scrollIntoView({ block: 'nearest' });
  }

  get currentItems(): Array<Dropdown.Item> {
    return this.currentOptions.filter(Dropdown.isOptionItem);
  }

  get selectedOption(): Dropdown.Item | null {
    if (typeof this.selectedItem !== 'string') {
      const item = this.selectedItem as Dropdown.Item;
      const name: keyof Dropdown.Item = item?.value !== undefined ? 'value' : 'label';

      return this.currentItems.find((x) => x[name] === item[name]) ?? null;
    } else {
      return this.currentItems.find((x) => x.label === this.selectedItem) ?? null;
    }
  }

  get visibleOptions(): Array<Dropdown.Item | Dropdown.HeaderSeparator> {
    if (!this.filter && this.searchTerm === '') {
      return this.currentOptions;
    }

    const filterLowerCase = this.filter.toLowerCase();
    const searchTermLowerCase = this.searchTerm.toLowerCase();

    return this.currentOptions.filter((option) => {
      if (!Dropdown.isOptionItem(option)) {
        return false;
      }

      const labelLowerCase = option.label.toLowerCase();

      return labelLowerCase.includes(filterLowerCase) && labelLowerCase.includes(searchTermLowerCase);
    });
  }

  get popupVisible(): boolean {
    return !this.disabled && this.opened;
  }

  get firstItemIndex(): number {
    return this.visibleOptions.findIndex(Dropdown.isOptionItem);
  }

  get lastItemIndex(): number {
    const index = this.visibleOptions
      .slice()
      .reverse()
      .findIndex(Dropdown.isOptionItem);

    if (index === -1) {
      return Dropdown.DEFAULT_STARTING_INDEX;
    }

    return this.visibleOptions.length - index - 1;
  }

  private get areSearchResultsEmpty(): boolean {
    return this.visibleOptions.length === 0 && this.searchTerm !== '';
  }

  mounted(): void {
    this.events.add(this.$slots.default, 'keyup', this.onAnchorKeyUp, { capture: true });
    this.events.add(this.$slots.default, 'keydown', this.onAnchorKeyDown, { capture: true });
    this.events.add(this.$slots.default, 'focusin', this.onOpen);

    // Explicitly invoke them in this order without relying on immediate: true
    this.onSelectedChange();
    this.onOptionsChange();
  }

  beforeDestroy(): void {
    this.events.removeAll();
  }

  render(): VNode {
    return (
      <AnchoredPopup
        class="lp-dropdown"
        opened={this.popupVisible}
        placement={this.popupPlacement}
        alignWidths={this.alignWidths}
        onToggle={this.setOpened}
        onAnchorEnter={this.onMouseEnter}
        onAnchorLeave={this.onMouseLeave}
        onAnchorClick={this.onOpen}
      >
        <template slot="anchor">{this.$slots.default}</template>
        {this.renderMenu()}
      </AnchoredPopup>
    );
  }

  private renderMenu(): VNode {
    return (
      <ul
        slot="content"
        ref="list"
        class={`lp-dropdown-popup ${this.popupClass}`}
        onMouseenter={this.onMenuEnter}
        onMouseleave={this.onMenuLeave}
        onClick={(event: Event) => event.stopPropagation()}
      >
        {this.enableSearch && (
          <div class="dropdown-search">
            <TextInput
              v-model={this.searchTerm}
              placeholder="Search items..."
              autoFocus={true}
              hasClear={true}
              icon={Icon.Type.SEARCH}
            />
          </div>
        )}
        {this.$slots.header && this.$slots.header.length > 0 && <li>{this.$slots.header}</li>}
        {this.areSearchResultsEmpty && <div class="search-empty">No results found</div>}
        {this.visibleOptions.map((option, index) => {
          if (Dropdown.isOptionHeader(option)) {
            return this.renderHeader(option);
          }

          if (Dropdown.isOptionItem(option)) {
            return this.renderItem(option, index);
          }

          throw new Error(`Unexpected dropdown item type ${JSON.stringify(option)}`);
        })}
      </ul>
    );
  }

  private renderItem(item: Dropdown.Item, index: number): VNode {
    const className = cx('dropdown-item', {
      focused: this.focusedIndex === index,
      selected: this.selectedIndex === index,
      'unlimited-width': this.alignWidths,
      'no-padding': Boolean(item.customRenderer),
      disabled: item.disabled
    });

    const handleMouseOver = (): void => {
      this.focusedIndex = index;
    };

    const handleMousedown = (e: UIEvent): void => {
      e.preventDefault(); // mousedown triggers focus change - we do not want the anchor to lose focus.
      this.emitSelected(index, true);
    };

    let content;

    if (item.customRenderer) {
      content = item.customRenderer(item);
    } else {
      const firstRow = [
        item.icon && <Icon class="dropdown-item-icon" type={item.icon} />,
        <OverflowableText text={item.label} />
      ];

      if (item.description) {
        content = (
          <div class="dropdown-item-column-content">
            <div class="dropdown-item-row"> {firstRow}</div>
            <div class="dropdown-item-description">{item.description}</div>
          </div>
        );
      } else {
        content = firstRow;
      }
    }

    const listItem = (
      <li class={className} onMouseover={handleMouseOver} onMousedown={handleMousedown}>
        {content}
      </li>
    );

    return item.disabled ? (
      <Tooltip message={item.disabledReason} placement={Tooltip.Placement.TOP}>
        {listItem}
      </Tooltip>
    ) : (
      listItem
    );
  }

  private renderHeader({ header, subheader }: Dropdown.HeaderSeparator): VNode {
    return (
      <li class="dropdown-header-separator">
        <div class="dropdown-header">{header}</div>
        {subheader && <div class="dropdown-subheader">{subheader}</div>}
      </li>
    );
  }

  private onMenuEnter(event: Event): void {
    this.$emit('menuenter', event);
    this.onMouseEnter();
  }

  private onMenuLeave(event: Event): void {
    this.$emit('menuleave', event);
    this.onMouseLeave();
  }

  @Debounced()
  private onMouseLeave(): void {
    if (this.closeOnMouseLeave) {
      this.setOpened(false);
    }
  }

  @Debounced.Cancel('onMouseLeave') private onMouseEnter: () => void;

  private onAnchorKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case KeyboardConstants.ARROW_UP_KEY:
        if (!this.popupVisible) {
          this.setOpened(true);
        } else {
          this.updateSelection(Direction.UP);
        }
        this.startUpdateSelectionLoop(Direction.UP);
        break;
      case KeyboardConstants.ARROW_DOWN_KEY:
        if (!this.popupVisible) {
          this.setOpened(true);
        } else {
          this.updateSelection(Direction.DOWN);
        }
        this.startUpdateSelectionLoop(Direction.DOWN);
        break;
      case KeyboardConstants.ESC_KEY:
        if (this.popupVisible) {
          e.stopImmediatePropagation();
        }
        break;
      case KeyboardConstants.TAB_KEY:
        this.close();
        break;
      default:
        if (!this.popupVisible) {
          this.setOpened(true);
        }
        break;
    }
  }

  private onAnchorKeyUp(e: KeyboardEvent): void {
    switch (e.key) {
      case KeyboardConstants.ENTER_KEY:
        if (this.popupVisible && this.visibleOptions.length > 0) {
          e.stopPropagation();
          this.emitSelected(this.focusedIndex);
        }
        break;
      case KeyboardConstants.ARROW_UP_KEY:
      case KeyboardConstants.ARROW_DOWN_KEY:
        if (this.popupVisible) {
          e.stopPropagation();
        }
        this.endUpdateSelectionLoop();
        break;
      case KeyboardConstants.ESC_KEY:
        if (this.popupVisible) {
          e.stopPropagation();
          this.close();
        }
        break;
      default:
      // Do nothing.
    }
  }

  private startUpdateSelectionLoop(dir: Direction): void {
    if (this.popupVisible) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = setTimeout(() => this.updateSelectionLoop(dir), INIT_DELAY);
    }
  }

  private endUpdateSelectionLoop(): void {
    clearTimeout(this.timeoutHandler);
  }

  private updateSelectionLoop(dir: Direction): void {
    this.updateSelection(dir);
    this.timeoutHandler = setTimeout(() => this.updateSelectionLoop(dir), UPDATE_DELAY);
  }

  private updateSelection(inc: Direction = Direction.NONE): void {
    let index = this.focusedIndex;

    do {
      index = Math.max(this.firstItemIndex, Math.min(index + inc.valueOf(), this.lastItemIndex));
    } while (this.visibleOptions[index] && !Dropdown.isOptionItem(this.visibleOptions[index]));

    this.focusedIndex = index;
  }

  private emitSelected(index: number, isMouseClick: boolean = false): void {
    if (this.visibleOptions.length > 0) {
      // Cast is safe because its provided by render which does type assertion on each element
      const option = this.visibleOptions[index] as Dropdown.Item;

      if (!option || option.disabled) {
        return;
      }

      const value = Dropdown.hasStringOptions(this.options) ? option.label : option;

      this.$emit('select', value, isMouseClick);
    }

    if (this.closeOnSelect) {
      this.close();
    }
  }

  private onOpen(e: MouseEvent): void {
    if (this.stopAnchorClickPropagation) {
      e.stopPropagation();
    }

    this.setOpened(true);
  }

  private close(): void {
    this.setOpened(false);
  }

  private setOpened(newValue: boolean): void {
    if (this.opened !== newValue) {
      this.opened = newValue;

      if (this.opened) {
        // Prevent old focused state on next menu open.
        this.$emit('open');
        this.updateFocusedIndex();
      } else {
        this.searchTerm = '';
        this.$emit('close');
      }
    }
  }

  private updateFocusedIndex(): void {
    if (this.selectedIndex === Dropdown.DEFAULT_STARTING_INDEX) {
      if (
        this.focusedIndex === Dropdown.DEFAULT_STARTING_INDEX ||
        (this.visibleOptions[this.focusedIndex] && Dropdown.isOptionHeader(this.visibleOptions[this.focusedIndex]))
      ) {
        this.focusedIndex = this.firstItemIndex;
      }
    } else {
      this.focusedIndex = this.selectedIndex;
    }
  }

  private static hasStringOptions(
    options: Array<string> | Array<Dropdown.Item | Dropdown.HeaderSeparator>
  ): options is Array<string> {
    return options.length > 0 && typeof options[0] === 'string';
  }

  private static isOptionHeader(option: Dropdown.HeaderSeparator | Dropdown.Item): option is Dropdown.HeaderSeparator {
    return 'header' in option;
  }

  static isOptionItem<T>(option: Dropdown.HeaderSeparator | Dropdown.Item<T>): option is Dropdown.Item<T> {
    return 'label' in option;
  }
}

namespace Dropdown {
  export type ValueType = object | number | string | boolean;
  export type Placement = AnchoredPopup.Placement;
  export const Placement = AnchoredPopup.Placement;

  // TODO (Deyan): consider expanding with 'separator' and 'header' dropdown item types and adding children array.

  export interface Item<T = ValueType> {
    label: string;
    description?: string;
    value?: T;
    icon?: Icon.Type;
    disabled?: boolean;
    disabledReason?: string;
    // Optional item renderer. If passed, this will be used to render each row. Clients are responsible for setting
    // paddings of the item row.
    customRenderer?: (item: Item<T>) => VNode | null;
  }

  export interface HeaderSeparator {
    header: string;
    subheader?: string;
  }

  export type Options<T = ValueType> = Array<Dropdown.Item<T> | Dropdown.HeaderSeparator> | Array<string>;
}

export { Dropdown };
