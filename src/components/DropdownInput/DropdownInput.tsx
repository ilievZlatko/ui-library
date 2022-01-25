import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../icon/Icon';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import { Tooltip } from '../Tooltip/Tooltip';

import './DropdownInput.scss';

/**
 * A component that allows the user to select a value from a list of values, and shows the selection state.
 *
 * @see BaseInput
 */
@Component({ name: 'DropdownInput' })
class DropdownInput extends Vue {
  static readonly EVENT_INPUT = 'input';

  /**
   * Determines if the widths of the input control and the popup should be the same.
   * For backwards compatibility, `true` by default.
   */
  @Prop({ type: Boolean, required: false, default: true })
  readonly alignWidths: boolean;

  /**
   * A label to display when not expanded. This value will be
   * used as placeholder if an empty value is selected.
   */
  @Prop({ type: String, required: false, default: null })
  readonly label: string | null;

  /**
   * A placeholder to show when expanded, in case it should be different from the label.
   */
  @Prop({ type: String, required: false, default: null })
  readonly placeholder: string | null;

  /**
   * Show the input in an expanded state by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly expanded: boolean;

  /**
   * Class to add to the popup.
   */
  @Prop({ type: String, required: false, default: '' })
  readonly popupClass: string;

  /**
   * Placement of the popup.
   */
  @Prop({ type: String, required: false, default: AnchoredPopup.Placement.BOTTOM_START })
  readonly popupPlacement: AnchoredPopup.Placement;

  /**
   * The initial value. If specified the component will display as expanded.
   */
  @Prop({ type: [Object, Number, String, Boolean], required: false, default: null })
  readonly value?: Dropdown.ValueType;

  /**
   * Flag to tell if the input is disabled or not. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  /**
   * Explanation why the input is disabled. It's empty string by default.
   */
  @Prop({ type: String, required: false, default: '' })
  readonly disabledReason: string;

  /**
   * Flag to tell if the input is readonly or not. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly readonly: boolean;

  /**
   * Flag to tell if the input is required to have a value. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly required: boolean;

  /**
   * Flag to tell if there should be border around the input. It's false by default.
   */
  @Prop({ required: false, default: false })
  readonly outline: boolean;

  /**
   * When provided an additional option is added in the dropdown, which, when selected, clears
   * any selection. Empty by default.
   */
  @Prop({ type: String, required: false, default: '' })
  readonly clearLabel: string;

  /**
   * Array of items that the user can select from.
   */
  @Prop({ type: Array, required: false, default: (): Array<Dropdown.Item> => [] })
  readonly items: Array<Dropdown.Item>;

  /**
   * Enable the built-in Dropdown search.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly enableSearch: boolean;

  /**
   * Error string. If set, the input will be rendered in an errored state. Empty by default.
   */
  @Prop({ type: String, required: false, default: '' })
  readonly error: string;

  /**
   * Warning string. If set, the input will be rendered in a warning state. Empty by default.
   */
  @Prop({ type: String, required: false, default: '' })
  readonly warning: string;

  $refs: {
    baseInput: LegendWrapper;
  };

  private legendExpanded: boolean = false;
  private currentItem: Dropdown.Item | null = null;

  private get options(): Array<Dropdown.Item> {
    if (this.clearLabel) {
      return [{ label: this.clearLabel }, ...this.items];
    } else {
      return this.items;
    }
  }

  mounted(): void {
    this.updateExpanded();
  }

  @Watch('items')
  @Watch('value', { immediate: true })
  onValuePropChange(): void {
    if (typeof this.value !== 'undefined') {
      const item = this.items.find((x) => x.value === this.value);
      this.currentItem = item || null;
    } else {
      this.currentItem = null;
    }

    this.updateExpanded();
  }

  render(): VNode {
    return (
      <Tooltip placement={Tooltip.Placement.TOP} message={this.disabled ? this.disabledReason : ''}>
        <Dropdown
          class="lp-dropdowninput"
          popupClass={`lp-dropdowninput-popup ${this.popupClass}`}
          popupPlacement={this.popupPlacement}
          alignWidths={this.alignWidths}
          disabled={this.disabled || this.readonly}
          selectedItem={this.currentItem}
          onSelect={this.onSelect}
          onClose={this.updateExpanded}
          options={this.options}
          enableSearch={this.enableSearch}
        >
          <div class="lp-dropdowninput-anchor">
            <LegendWrapper
              class={this.disabled ? 'lp-disabled' : 'lp-editable'}
              ref="baseInput"
              tabindex="0"
              label={this.label}
              disabled={this.disabled}
              readonly={this.readonly}
              required={this.required}
              outline={this.outline}
              expanded={this.legendExpanded || this.expanded}
              error={this.error}
              warning={this.warning}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            >
              <OverflowableText
                class={cx('lp-dropdowninput-label', { placeholder: !this.currentItem })}
                text={this.currentItem ? this.currentItem.label : this.placeholder}
              />
              {!this.readonly && !this.disabled && <Icon type={Icon.Type.CARET_DOWN_SMALL} clickable={false} />}
              <template slot={LegendWrapper.Slot.LABEL}>{this.$slots[LegendWrapper.Slot.LABEL]}</template>
              <template slot={LegendWrapper.Slot.LABEL_HOVER}>{this.$slots[LegendWrapper.Slot.LABEL_HOVER]}</template>
              <template slot={LegendWrapper.Slot.LABEL_ACTIVE}>{this.$slots[LegendWrapper.Slot.LABEL_ACTIVE]}</template>
            </LegendWrapper>
          </div>
        </Dropdown>
      </Tooltip>
    );
  }

  private onFocus(): void {
    this.legendExpanded = true;
  }

  private onBlur(): void {
    this.updateExpanded();
  }

  private updateExpanded(): void {
    const item = this.currentItem;
    const isEmpty = item && (typeof item.value === 'undefined' || item.value === null);
    this.legendExpanded = !!item && !isEmpty;
  }

  private onSelect(item: Dropdown.Item): void {
    this.currentItem = this.clearLabel && this.clearLabel === item.label ? null : item;

    (this.$refs.baseInput.$el as HTMLElement).focus();

    this.$emit(DropdownInput.EVENT_INPUT, this.currentItem?.value);
  }
}

export { DropdownInput };
