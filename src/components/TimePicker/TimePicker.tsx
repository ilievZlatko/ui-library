import isEqual from 'lodash/isEqual';
import { DateTime } from 'luxon';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { parseDateTime } from '../../utils/parseDateTime';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from '../icon/Icon';
import { TextInput } from '../TextInput/TextInput';
import { WrappedTextInput } from '../WrappedTextInput/WrappedTextInput';
import { TimeInput } from './TimeInput/TimeInput';

import './TimePicker.scss';

@Component({ name: 'TimePicker' })
class TimePicker extends Vue {
  static readonly EVENT_CHANGE: string = 'change';
  static readonly EVENT_FOCUS_OUT: string = 'focusOut';
  static readonly SUPPORTED_FORMATS: Array<string> = ['hh:mm a', 'HH:mm'];
  static readonly DEFAULT_FORMAT: string = TimePicker.SUPPORTED_FORMATS[0];

  @Prop({ type: Object, required: false, default: null })
  readonly value: DateTime | null;

  @Prop({ type: String, required: false })
  readonly label: string | null;

  @Prop({ type: Boolean, required: false, default: true })
  readonly showIcon: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly autoFocus: boolean;

  @Prop({ type: [String, Array], required: false, default: null })
  readonly error: string | Array<string> | null;

  @Prop({ type: [String, Array], required: false, default: null })
  readonly warning: string | Array<string> | null;

  @Prop({ type: Boolean, required: false, default: true })
  readonly showHighlightOnWarning: boolean;

  private isDropdownOpen: boolean = false;
  private localValue: DateTime = TimePicker.defaultValue();
  private inputText: string = '';
  private parsingError: string | null = null;

  render(): VNode {
    const Input = this.label ? WrappedTextInput : TextInput;

    return (
      <AnchoredPopup
        class="lp-time-picker"
        opened={this.isDropdownOpen}
        onToggle={this.onClose}
        placement={AnchoredPopup.Placement.BOTTOM}
      >
        <Input
          class="lp-time-picker-input"
          slot="anchor"
          label={this.label}
          placeholder="mm:hh am/pm"
          autoFocus={this.autoFocus}
          value={this.inputText}
          disabled={this.disabled}
          error={this.parsingError ?? this.error}
          warning={this.warning}
          showHighlightOnWarning={this.showHighlightOnWarning}
          onInput={this.onInput}
          onFocus={this.openTimePicker}
          onBlur={this.applyChangesAndEmitFocusOut}
          onSubmit={this.onClose}
        >
          {this.showIcon && <Icon slot="after" type={Icon.Type.CLOCK} clickable={false} stopPropagation={false} />}
        </Input>
        <div class="lp-time-picker-popup" slot="content">
          <TimeInput value={this.localValue} disabled={this.disabled} onChange={this.onChange} />
        </div>
      </AnchoredPopup>
    );
  }

  private onInput(value: string): void {
    this.inputText = value;

    const parsed = parseDateTime(value, TimePicker.SUPPORTED_FORMATS);
    const { hour, minute } = parsed ?? this.localValue;

    this.localValue = this.localValue.set({ hour, minute });
    this.parsingError = parsed
      ? null
      : `Time should match one of the supported formats: ${TimePicker.SUPPORTED_FORMATS.join('\n')}`;
  }

  private openTimePicker(): void {
    this.isDropdownOpen = !this.disabled;
  }

  private closeTimePicker(): void {
    this.isDropdownOpen = false;
  }

  private onChange(value: DateTime): void {
    this.localValue = value;
    this.inputText = value.toFormat(TimePicker.DEFAULT_FORMAT);
    this.parsingError = null;
  }

  private onClose(): void {
    this.blurInput();
    this.closeTimePicker();
    // blurInput might not trigger applyChanges
    // because the main input might have been blurred already
    // (when focusing on popup inputs)
    this.applyChangesAndEmitFocusOut();
  }

  private applyChangesAndEmitFocusOut(): void {
    this.emitLocalValue();
    // Reset it to clear out parsing errors
    // and restore the input value to last valid date/time
    this.resetLocalState();
    this.emitFocusOut();
  }

  private emitLocalValue(): void {
    if (!isEqual(this.value, this.localValue)) {
      this.$emit(TimePicker.EVENT_CHANGE, this.localValue);
    }
  }

  @Watch('value', { immediate: true })
  private resetLocalState(): void {
    this.localValue = this.value ?? TimePicker.defaultValue();
    this.inputText = this.value?.toFormat(TimePicker.DEFAULT_FORMAT) ?? '';
    this.parsingError = null;
  }

  private emitFocusOut(): void {
    this.$emit(TimePicker.EVENT_FOCUS_OUT);
  }

  private blurInput(): void {
    this.$el.querySelector('input')?.blur();
  }

  private static defaultValue(): DateTime {
    return DateTime.local().startOf('day');
  }
}

namespace TimePicker {
  export interface Props {
    value: DateTime | null;
    label?: string;
    showIcon?: boolean;
    disabled?: boolean;
    timeFormat?: string;
  }
}

export { TimePicker };
