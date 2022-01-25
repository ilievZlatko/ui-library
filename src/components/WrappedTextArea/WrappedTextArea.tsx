import { KeyboardConstants } from 'leanplum-lib-common';
import isEmpty from 'lodash/isEmpty';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';

import './WrappedTextArea.scss';

/**
 *  Text area component wrapped inside a LegendWrapper.
 *
 * @event input: Fired when the value changes (Use the v-model directive when possible).
 *
 * @event submit: Fired when the user presses the `enter` key.
 *
 * @see LegendWrapper
 */
@Component({ name: 'WrappedTextArea' })
class WrappedTextArea extends Vue {
  static readonly EVENT_INPUT = 'input';
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_SUBMIT = 'submit';

  /**
   * A label to display when not expanded. This value will be
   * used as placeholder if none is specified.
   */
  @Prop({ type: String, required: true })
  label: string;

  /**
   * A placeholder to show when expanded, in case it should be different from the label.
   */
  @Prop({ type: String, required: false, default: null })
  placeholder: string | null;

  /**
   * The initial value. If specified the component will display as expanded.
   */
  @Prop({ type: String, required: false, default: '' })
  value: string;

  /**
   * Flag to tell if the textarea is disabled or not. It's false by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  disabled: boolean;

  /**
   * Allows the textarea value to be copied, but not edited. False by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly: boolean;

  /**
   * Flag to tell if the textarea should be focused on mount. False by default.
   */
  @Prop({ type: Boolean, required: false, default: false })
  autoFocus: boolean;

  /**
   * The max-length value to be passed to the inner textarea field. If not passed, or null is passed,
   * acts as if there is no max length.
   */
  @Prop({ type: Number, required: false, default: null })
  maxLength: number | null;

  /**
   * Error string. If set, the textarea will be rendered in an errored state. Empty by default.
   */
  @Prop({ type: String, required: false, default: '' })
  error: string;

  $refs: {
    wrappedTextArea: HTMLTextAreaElement;
  };

  private expanded: boolean = false;
  private currentValue: string = '';

  mounted(): void {
    this.updateExpanded();

    if (this.autoFocus && this.$refs.wrappedTextArea) {
      this.$refs.wrappedTextArea.focus();
    }
  }

  @Watch('value', { immediate: true })
  onValuePropChange(newValue: string): void {
    this.currentValue = newValue || '';
    this.updateExpanded();
  }

  render(): VNode {
    return (
      <LegendWrapper
        class={cx('lp-wrapped-text-area', this.disabled ? 'lp-disabled' : 'lp-editable')}
        label={this.label}
        error={this.error}
        disabled={this.disabled}
        expanded={this.expanded}
        onFocus={this.onFocus}
      >
        {this.$slots.before}
        <textarea
          ref="wrappedTextArea"
          class="lp-wrapped-text-area-field"
          placeholder={this.placeholder || this.label}
          readonly={this.readonly}
          disabled={this.disabled}
          onKeyup={this.onInputKeyUp}
          onChange={this.onInputChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {this.currentValue}
        </textarea>
        {this.$slots.after}
      </LegendWrapper>
    );
  }

  private onFocus(): void {
    this.expanded = true;

    this.$nextTick(() => {
      if (this.$refs.wrappedTextArea) {
        this.$refs.wrappedTextArea.focus();
      }
    });
  }

  private updateExpanded(): void {
    this.expanded = !isEmpty(this.currentValue);
  }

  private onBlur(): void {
    this.updateExpanded();
  }

  private onInputKeyUp(event?: KeyboardEvent): void {
    if (event) {
      this.currentValue = (event.target as HTMLTextAreaElement).value;

      this.$emit(WrappedTextArea.EVENT_INPUT, this.currentValue);

      if (event.key === KeyboardConstants.ENTER_KEY) {
        this.$emit(WrappedTextArea.EVENT_SUBMIT, this.currentValue);
      }
    }
  }

  private onInputChange(event?: Event): void {
    if (event) {
      this.currentValue = (event.target as HTMLTextAreaElement).value;

      this.$emit(WrappedTextArea.EVENT_CHANGE, this.currentValue);
    }
  }
}

export { WrappedTextArea };
