import { Debounced, KeyboardConstants } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { getTextWidth } from '../../utils/getTextWidth';
import { Icon } from '../icon/Icon';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { NotificationContent } from '../NotificationTooltip/NotificationContent/NotificationContent';
import { Tooltip } from '../Tooltip/Tooltip';

import './TextInput.scss';

/**
 * Text input component.
 *
 * @event change: Fired when the value input field changes state(same as 'change' on html input)
 *
 * @event input: Fired when the value changes (Use the v-model directive when possible).
 *
 * @event submit: Fired when the user presses the `enter` key.
 *
 * @event focus: Fired when the input gains focus.
 *
 * @event focusOut: Fired when the input or its children lose focus.
 *
 * @event blur: Fired when the input loses focus.
 *
 * @event click: Fired when clicking on the wrapper.
 *
 * @author Deyan Gunchev
 */
@Component({ name: 'TextInput' })
class TextInput extends Vue {
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_SUBMIT = 'submit';
  static readonly EVENT_INPUT = 'input';
  static readonly EVENT_DEBOUNCED_INPUT = 'debouncedInput';
  static readonly EVENT_FOCUS = 'focus';
  static readonly EVENT_FOCUS_OUT = 'focusOut';
  static readonly EVENT_BLUR = 'blur';
  static readonly EVENT_CLICK = 'click';

  @Prop({ type: String, required: false, default: '' })
  readonly placeholder: string;

  @Prop({ type: String, required: false, default: '' })
  readonly value!: string;

  @Prop({ type: Number, required: false, default: null })
  readonly maxLength: number | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly readonly: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly error: string | Array<string>;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly warning: string | Array<string>;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly info: string | Array<string>;

  @Prop({ type: Boolean, required: false, default: false })
  readonly hasClear: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly hasEllipsis: boolean;

  @Prop({ type: String, required: false, default: null })
  readonly icon: Icon.Type | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly embedded: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({
    type: String,
    required: false,
    default(): TextInput.Type {
      return TextInput.Type.TEXT;
    }
  })
  readonly type: TextInput.Type;

  /**
   * Flag to tell if the input should be focussed on mount. False by default.
   */
  @Prop({ required: false, default: false })
  readonly autoFocus: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly selectOnFocus: boolean;

  @Prop({ required: false, default: false })
  readonly showTooltipWhenOverflowing: boolean;

  @Prop({ required: false, default: true })
  readonly showHighlightOnWarning: boolean;

  @Prop({ required: false, type: Object, default: null })
  readonly expandConfig!: TextInput.ExpandConfig | null;

  localValue: string | number = this.value;
  isOverflowing: boolean = false;

  $slots: {
    after: Array<VNode>;
  };

  $refs: {
    input: HTMLInputElement;
  };

  private width = this.expandConfig?.defaultWidth;

  get shouldExpand(): boolean {
    return Boolean(this.expandConfig);
  }

  get tooltipInfo(): { type: Tooltip.Type; message: string | Array<string> } | null {
    if (this.error?.length) {
      return { type: Tooltip.Type.ERROR, message: this.error };
    }

    if (this.warning?.length) {
      return { type: Tooltip.Type.WARNING, message: this.warning };
    }

    if (this.info?.length) {
      return { type: Tooltip.Type.INFO, message: this.info };
    }

    return this.showTooltipWhenOverflowing && this.isOverflowing
      ? { type: Tooltip.Type.INFO, message: this.localValue.toString() }
      : null;
  }

  created(): void {
    if (this.shouldExpand) {
      this.expandWidth();
    }
  }

  mounted(): void {
    if (this.autoFocus) {
      // Next tick needed for proper event propagation - otherwise focus
      // events might get emitted before other components had the chance
      // to attach their listeners to the component.
      this.$nextTick(() => this.$refs.input?.focus());
    }
  }

  @Watch('value', { immediate: true })
  onValueChange(): void {
    if (this.localValue === this.value) {
      return;
    }

    this.localValue = this.value;

    if (this.shouldExpand) {
      this.expandWidth();
    }
  }

  @Watch('width', { immediate: true })
  @Watch('localValue', { immediate: true })
  async onShouldUpdateOverflowing(): Promise<void> {
    await this.$nextTick();
    this.isOverflowing = this.$refs.input?.scrollWidth > this.$refs.input?.clientWidth;
  }

  render(): VNode {
    return (
      <Tooltip type={this.tooltipInfo?.type} placement={Tooltip.Placement.TOP} disabled={!this.tooltipInfo}>
        {this.renderInput()}
        <NotificationContent slot="content" message={this.tooltipInfo?.message} />
      </Tooltip>
    );
  }

  renderInput(): VNode {
    return (
      <label
        class={cx('lp-text-input-wrapper', {
          disabled: this.disabled,
          error: Boolean(this.error?.length),
          warning: Boolean(!this.error?.length && this.warning?.length && this.showHighlightOnWarning),
          embedded: this.embedded,
          readonly: this.readonly,
          'with-clear': this.hasClear
        })}
        style={this.shouldExpand && `width: ${this.width}px`}
        tabIndex={this.disabled ? null : '-1'}
      >
        {this.icon && <Icon class="lp-text-input-icon" type={this.icon} />}
        <input
          ref="input"
          class={cx('lp-text-input', { 'with-ellipsis': this.hasEllipsis })}
          type={this.type}
          placeholder={this.placeholder}
          readonly={this.readonly}
          disabled={this.disabled}
          value={this.localValue}
          maxLength={this.maxLength}
          onChange={this.onInputChange}
          onKeydown={this.onKeyDown}
          onFocus={this.onFocus}
          onFocusout={this.onFocusOut}
          onInput={this.onInput}
          onBlur={this.onBlur}
          onClick={this.onClick}
          onPaste={this.onPaste}
        />
        {this.hasClear && Boolean(this.localValue) && (
          <Icon class="lp-text-input-clear" onClick={this.onClear} type={Icon.Type.CLEAR_FILLED} />
        )}
        {this.loading && !this.disabled && <LoadingSpinner size={LoadingSpinner.Size.SMALL} />}
        {this.$slots.after}
      </label>
    );
  }

  focus(): void {
    this.$refs.input.focus();
  }

  private async onPaste(event: ClipboardEvent): Promise<void> {
    // Wait for the default paste handler to complete(it handles selection, deletions, insertions at cursor, etc.)
    // and take the final value from the input element.

    await this.$nextTick();

    this.localValue = this.$refs.input.value;
    this.$emit(TextInput.EVENT_INPUT, this.localValue);
  }

  private onClick(): void {
    this.$emit(TextInput.EVENT_CLICK);
  }

  private onClear(): void {
    this.localValue = '';
    this.$emit(TextInput.EVENT_INPUT, this.localValue);
  }

  private onFocus(): void {
    this.$refs.input.scrollLeft = this.$refs.input.scrollWidth;

    if (this.selectOnFocus) {
      this.$refs.input.select();
    }

    this.$emit(TextInput.EVENT_FOCUS);
  }

  private onFocusOut(): void {
    if (this.shouldExpand) {
      this.expandWidth();
    }

    this.$emit(TextInput.EVENT_FOCUS_OUT, this.localValue);
  }

  private onBlur(): void {
    if (this.$refs.input) {
      this.$refs.input.scrollLeft = 0;
    }

    this.$emit(TextInput.EVENT_BLUR);
  }

  private onInputChange(event: Event): void {
    this.updateValue(event);
    this.$emit(TextInput.EVENT_CHANGE, this.localValue);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === KeyboardConstants.ENTER_KEY) {
      this.$emit(TextInput.EVENT_SUBMIT, this.localValue);
    }
  }

  private onInput(event: Event): void {
    this.updateValue(event);
    this.$emit(TextInput.EVENT_INPUT, this.localValue); // Allows using the 'v-model' attribute.
    this.onDebouncedInput();
  }

  @Debounced(250)
  onDebouncedInput(): void {
    this.$emit(TextInput.EVENT_DEBOUNCED_INPUT, this.localValue);
  }

  private updateValue(event: Event): void {
    this.localValue = (event.target as HTMLInputElement).value;
  }

  /**
   * Expands the input to the width of it's value within the limitations of expandConfig.
   */
  private expandWidth(): void {
    if (!this.expandConfig) {
      return;
    }

    const val = this.localValue.toString();

    const { defaultWidth, minWidth, maxWidth } = this.expandConfig;
    const newWidth = val.length > 0 ? TextInput.measureTextWidth(val) : defaultWidth;

    this.width = Math.min(Math.max(newWidth, minWidth), maxWidth);
  }

  /**
   * Measures the width of the text as it would be when not focused.
   * Used when the TextInput is expandable.
   */
  private static measureTextWidth(text: string): number {
    // These must be kept in sync with the actual style to keep the measurements consistent.
    const style: Partial<CSSStyleDeclaration> = {
      fontFamily: '"circular-book", Arial, sans-serif',
      fontSize: '14px',
      padding: '4px 16px',
      border: '2px solid #000000'
    };

    return getTextWidth(text, style);
  }
}

namespace TextInput {
  export enum Type {
    TEXT = 'text',
    PASSWORD = 'password'
  }

  export interface ExpandConfig {
    defaultWidth: number; // when value is not set.
    minWidth: number;
    maxWidth: number;
  }
}

export { TextInput };
