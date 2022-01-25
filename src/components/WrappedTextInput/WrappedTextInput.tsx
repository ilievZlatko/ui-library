import { KeyboardConstants } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';

import './WrappedTextInput.scss';

/**
 *  Text input component wrapped inside a LegendWrapper.
 *
 * @event focus: Fired when the input receives focus.
 *
 * @event input: Fired on keyup (Use the v-model directive when possible).
 *
 * @event change: Fired when the user change the value.
 *
 * @event submit: Fired when the user presses the `enter` key.
 *
 * @event blur: Fired when the user leaves the input.
 *
 * @see LegendWrapper
 *
 * @author Deyan Gunchev
 */
@Component({ name: 'WrappedTextInput' })
class WrappedTextInput extends Vue {
  static readonly EVENT_FOCUS = 'focus';
  static readonly EVENT_INPUT = 'input';
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_SUBMIT = 'submit';
  static readonly EVENT_BLUR = 'blur';

  /**
   * A label to display when not expanded. This value will be
   * used as placeholder if none is specified.
   */
  @Prop({ type: String, required: false })
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
   * The initial value. If specified the component will display as expanded.
   */
  @Prop({ type: String, required: false, default: '' })
  readonly value: string;

  /**
   * Flag to tell if the input is disabled or not. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  /**
   * Allows the input value to be copied, but not edited. False by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly readonly: boolean;

  /**
   * Flag to tell if the input should be focussed on mount. False by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly autoFocus: boolean;

  /**
   * The max-length value to be passed to the inner input field. If not passed, or null is passed,
   * acts as if there is no max length.
   */
  @Prop({ type: Number, required: false, default: null })
  readonly maxLength: number | null;

  /**
   * Error string or array of errors. If set, the input will be rendered in an errored state. Empty by default.
   */
  @Prop({ type: [String, Array], required: false, default: '' })
  readonly error: string | Array<string>;

  /**
   * Warning string or array of warnings. If set, the input will be rendered in warning state unless error,
   * which takes precedence. Empty by default.
   */
  @Prop({ type: [String, Array], required: false, default: '' })
  readonly warning: string | Array<string>;

  @Prop({
    type: String,
    required: false,
    default(): WrappedTextInput.Type {
      return WrappedTextInput.Type.TEXT;
    }
  })
  type: WrappedTextInput.Type;

  $refs: {
    wrappedTextInput: HTMLInputElement;
  };

  private currentValue: string = '';
  private isLegendFocussed: boolean = false;
  private isInputFocussed: boolean = false;
  private interval: number | null = null;

  @Watch('value', { immediate: true })
  onValuePropChange(newValue: string): void {
    this.currentValue = newValue || '';
  }

  mounted(): void {
    if (this.autoFocus && this.$refs.wrappedTextInput) {
      this.$refs.wrappedTextInput.focus();
    }
    this.interval = window.setInterval(() => {
      this.isLegendFocussed = this.isInputFocussed;
    }, 500);
  }

  beforeDestroy(): void {
    if (this.interval !== null) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
  }

  render(): VNode {
    return (
      <LegendWrapper
        class={cx('lp-wrapped-text-input', this.disabled ? 'lp-disabled' : 'lp-editable')}
        label={this.label}
        error={this.error}
        warning={this.warning}
        disabled={this.disabled}
        readonly={this.readonly}
        expanded={this.isLegendExpanded}
        onFocus={this.onLegendFocus}
      >
        {this.$slots.before}
        <input
          ref="wrappedTextInput"
          class="lp-wrapped-text-input-field"
          placeholder={this.placeholder || this.label}
          type={this.type}
          readonly={this.readonly}
          disabled={this.disabled}
          maxLength={this.maxLength}
          value={this.currentValue}
          onKeyup={this.onInputKeyUp}
          onChange={this.onInputChange}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
        />
        {this.$slots.after}
        <template slot={LegendWrapper.Slot.LABEL}>{this.$slots[LegendWrapper.Slot.LABEL]}</template>
        <template slot={LegendWrapper.Slot.LABEL_HOVER}>{this.$slots[LegendWrapper.Slot.LABEL_HOVER]}</template>
        <template slot={LegendWrapper.Slot.LABEL_ACTIVE}>{this.$slots[LegendWrapper.Slot.LABEL_ACTIVE]}</template>
      </LegendWrapper>
    );
  }

  private get isLegendExpanded(): boolean {
    return this.expanded || this.isInputFocussed || this.isLegendFocussed || this.currentValue.length > 0;
  }

  private onLegendFocus(): void {
    if (!this.readonly && this.$refs.wrappedTextInput) {
      this.$refs.wrappedTextInput.focus();
    }
  }

  private onInputFocus(): void {
    if (!this.readonly) {
      this.isLegendFocussed = true;
      this.isInputFocussed = true;
      this.$emit(WrappedTextInput.EVENT_FOCUS);
    }
  }

  private onInputBlur(): void {
    this.isInputFocussed = false;
    this.$emit(WrappedTextInput.EVENT_BLUR);
  }

  private onInputKeyUp(event?: KeyboardEvent): void {
    if (event) {
      this.currentValue = (event.target as HTMLInputElement).value;

      this.$emit(WrappedTextInput.EVENT_INPUT, this.currentValue);

      if (event.key === KeyboardConstants.ENTER_KEY) {
        this.$emit(WrappedTextInput.EVENT_SUBMIT, this.currentValue);
      }
    }
  }

  private onInputChange(event?: Event): void {
    if (event) {
      this.currentValue = (event.target as HTMLInputElement).value;

      this.$emit(WrappedTextInput.EVENT_CHANGE, this.currentValue);
    }
  }
}

namespace WrappedTextInput {
  export enum Type {
    TEXT = 'text',
    PASSWORD = 'password'
  }
}

export { WrappedTextInput };
