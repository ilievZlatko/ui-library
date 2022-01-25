import { Debounced, KeyboardConstants } from 'leanplum-lib-common';
import isFinite from 'lodash/isFinite';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { ErrorTooltip } from '../ErrorTooltip/ErrorTooltip';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';
import { Tooltip } from '../Tooltip/Tooltip';
import { WarningTooltip } from '../WarningTooltip/WarningTooltip';

import './NumberInput.scss';

interface InputEvent extends KeyboardEvent {
  data: string;
  target: HTMLInputElement;
}

const nonNumber = /[^\-0-9.]/g;
const toNumber = (value: string): string => value.replace(nonNumber, '').replace(/(\..*)\./g, '$1');

@Component({ name: 'NumberInput' })
class NumberInput extends Vue {
  static readonly EVENT_FOCUS = 'focus';
  static readonly EVENT_FOCUSOUT = 'focusOut';
  static readonly EVENT_INPUT = 'input';
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_SUBMIT = 'submit';
  static readonly EVENT_BLUR = 'blur';

  /**
   * A label to display when not expanded. This value will be
   * used as placeholder if none is specified.
   */
  @Prop({ type: String, required: false, default: null })
  readonly label: string | null;

  /**
   * A placeholder to show when expanded, in case it should be different from the label.
   */
  @Prop({ type: String, required: false, default: null })
  readonly placeholder: string | null;

  /**
   * The initial value. If specified the component will display as expanded.
   */
  @Prop({ type: Number, required: false, default: null })
  readonly value: number | null;

  /**
   * Minimum threshold of the value.
   */
  @Prop({ type: Number, required: false, default: -Infinity })
  readonly min: number;

  /**
   * Maximum threshold of the value.
   */
  @Prop({ type: Number, required: false, default: +Infinity })
  readonly max: number;

  /**
   * Switch on or off bounce animation on validation
   * works together with min/max
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly shakeOnValidate: boolean;

  /**
   * Max number of characters allowed in the input.
   */
  @Prop({ type: Number, required: false, default: null })
  readonly maxLength: number | null;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly error: string | Array<string>;

  @Prop({ type: [String, Array], required: false, default: '' })
  readonly warning: string | Array<string>;

  /**
   * Flag to tell if the input is disabled or not. It's false by default.
   */
  @Prop({ required: false, default: false })
  readonly disabled: boolean;

  /**
   * Allows the input value to be copied, but not edited. False by default.
   */
  @Prop({ required: false, default: false })
  readonly readonly: boolean;

  /**
   * Flag to tell if the input should be focussed on mount. False by default.
   */
  @Prop({ required: false, default: false })
  readonly autoFocus: boolean;

  /**
   * Flag to tell if the input should allow float values instead of the default integers.
   */
  @Prop({ required: false, default: false })
  readonly allowFloat: boolean;

  @Prop({ required: false, default: true })
  readonly hideArrows: boolean;

  @Prop({ required: false, default: null })
  readonly defaultValue: number | null;

  @Prop({ required: false, default: true })
  readonly showHighlightOnWarning: boolean;

  @Prop({ required: false, default: true })
  readonly useIconForFeedback: boolean;

  private localValue: string = '';
  private isLegendFocussed: boolean = false;
  private isInputFocussed: boolean = false;
  private shouldShake: boolean = false;
  private interval: number | null = null;

  readonly $refs: {
    wrappedInput: HTMLInputElement;
  };

  @Watch('value', { immediate: true })
  onValuePropChange(): void {
    this.localValue = `${this.value === null ? '' : this.value}`;
  }

  mounted(): void {
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
    if (this.useIconForFeedback || (!this.error && !this.warning)) {
      return this.renderInput();
    }

    const type = this.error ? Tooltip.Type.ERROR : Tooltip.Type.WARNING;

    return (
      <Tooltip type={type} message={this.error || this.warning} placement={Tooltip.Placement.TOP}>
        {this.renderInput()}
      </Tooltip>
    );
  }

  private renderInput(): VNode {
    const placeholder = this.placeholder ? this.placeholder : this.min !== -Infinity ? String(this.min) : null;

    return this.label ? (
      <LegendWrapper
        class={cx('lp-wrapped-number-input', this.disabled ? 'lp-disabled' : 'lp-editable', { shake: this.shouldShake })}
        label={this.label}
        error={this.error}
        warning={this.warning}
        showHighlightOnWarning={this.showHighlightOnWarning}
        disabled={this.disabled}
        readonly={this.readonly}
        expanded={this.isLegendExpanded}
        onAnimationend={this.onAnimationEnd}
        onFocus={this.onLegendFocus}
      >
        {this.$slots.before}
        <input
          class={cx('lp-wrapped-number-input-field', { 'hide-arrows': this.hideArrows })}
          ref="wrappedInput"
          placeholder={placeholder}
          readonly={this.readonly}
          disabled={this.disabled}
          value={this.localValue}
          maxLength={this.maxLength}
          onChange={this.onChange}
          onInput={this.isDebounced ? this.onDebouncedInput : this.onInput}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onFocusout={this.onFocusOut}
          autofocus={this.autoFocus}
          type="number"
        />
        {this.$slots.after}
        <template slot={LegendWrapper.Slot.LABEL}>{this.$slots[LegendWrapper.Slot.LABEL]}</template>
        <template slot={LegendWrapper.Slot.LABEL_HOVER}>{this.$slots[LegendWrapper.Slot.LABEL_HOVER]}</template>
        <template slot={LegendWrapper.Slot.LABEL_ACTIVE}>{this.$slots[LegendWrapper.Slot.LABEL_ACTIVE]}</template>
      </LegendWrapper>
    ) : (
      <label
        class={cx('lp-number-input-wrapper', {
          disabled: this.disabled,
          error: Boolean(this.error?.length),
          warning: Boolean(!this.error?.length && this.warning?.length && this.showHighlightOnWarning),
          shake: this.shouldShake
        })}
        tabIndex={this.disabled ? null : '-1'}
        onAnimationend={this.onAnimationEnd}
      >
        <input
          class={cx('lp-number-input', { 'hide-arrows': this.hideArrows })}
          placeholder={placeholder}
          readonly={this.readonly}
          disabled={this.disabled}
          value={this.localValue}
          maxLength={this.maxLength}
          onChange={this.onChange}
          onInput={this.isDebounced ? this.onDebouncedInput : this.onInput}
          onFocus={this.onInputFocus}
          onFocusout={this.onFocusOut}
          onBlur={this.onInputBlur}
          autofocus={this.autoFocus}
          type="number"
        />
        {this.$slots.after}
        {this.useIconForFeedback &&
          (this.error?.length ? (
            <ErrorTooltip message={this.error} />
          ) : this.warning?.length ? (
            <WarningTooltip message={this.warning} />
          ) : null)}
      </label>
    );
  }

  private get isDebounced(): boolean {
    return (
      this.shakeOnValidate &&
      (this.min !== -Infinity || this.max !== +Infinity)
    );
  }

  private get isLegendExpanded(): boolean {
    return this.isInputFocussed || this.isLegendFocussed || this.localValue.length > 0;
  }

  private onLegendFocus(): void {
    if (!this.readonly && this.$refs.wrappedInput) {
      this.$refs.wrappedInput.focus();
    }
  }

  private onInputFocus(): void {
    if (!this.readonly) {
      this.isLegendFocussed = true;
      this.isInputFocussed = true;
      this.$emit(NumberInput.EVENT_FOCUS);
    }
  }

  private onInputBlur(): void {
    this.isInputFocussed = false;
    this.$emit(NumberInput.EVENT_BLUR);
  }

  private onFocusOut(): void {
    if (this.defaultValue !== null && this.localValue.trim() === '') {
      this.handleEvent(NumberInput.EVENT_CHANGE, this.defaultValue.toString());
    }

    this.$emit(NumberInput.EVENT_FOCUSOUT);
  }

  private handleValueChange(event: InputEvent): void {
    const char = event.data;
    const isFirst = (c: string) => char === c && !this.localValue.includes(c);
    const startNegative = !this.localValue && isFirst('-') && this.min < 0;
    const typingFloat = this.allowFloat && this.localValue && isFirst('.');
    const partialNumber = startNegative || typingFloat;
    if (!partialNumber) {
      const isInvalidChar = char && event.target.value === '';
      const value = isInvalidChar ? this.localValue : event.target.value;
      event.target.value = this.parseValue(toNumber(value))[1];
    }

    this.handleEvent(NumberInput.EVENT_INPUT, event.target.value);

    if (event.key === KeyboardConstants.ENTER_KEY) {
      this.handleEvent(NumberInput.EVENT_SUBMIT, event.target.value);
    }
  }

  @Debounced(800)
  private onDebouncedInput(event: InputEvent): void {
    this.handleValueChange(event);
  }

  private onInput(event: InputEvent): void {
    this.handleValueChange(event);
  }

  private onChange(event: InputEvent): void {
    this.handleValueChange(event);
    this.handleEvent(NumberInput.EVENT_CHANGE, event.target.value);
  }

  private handleEvent(type: string, value: string): void {
    const [numberValue, stringValue] = this.parseValue(value);
    this.localValue = stringValue;

    this.emitValue(type, numberValue);
  }

  private parseValue(value: string): [number | null, string] {
    const stringValue = (value || '').trim();

    if (stringValue === '') {
      return [null, ''];
    }

    if (
      this.isDebounced &&
      (parseInt(value) < this.min || parseInt(value) > this.max)
    ) {
      this.shouldShake = true;
    }

    const numberValue = Math.max(
      this.min,
      Math.min(this.max, this.allowFloat ? parseFloat(stringValue) : parseInt(stringValue, 10))
    );

    if (!isFinite(numberValue)) {
      return [null, ''];
    }

    return [numberValue, `${numberValue}${stringValue.endsWith('.') ? '.' : ''}`];
  }

  private emitValue(eventName: string, value: number | null): void {
    this.$emit(eventName, value);
  }

  private onAnimationEnd(): void {
    this.shouldShake = false;
  }
}

namespace NumberInput {
  export interface Props {
    label?: string;
    placeholder?: string | null;
    value?: number | null;
    min?: number;
    max?: number;
    disabled?: boolean;
    readonly?: boolean;
    autoFocus?: boolean;
    allowFloat?: boolean;
    shakeOnValidate?: boolean;
  }
}

export { NumberInput };
