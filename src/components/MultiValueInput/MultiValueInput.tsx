import { Debounced, Dictionary, KeyboardConstants, LabeledValue } from 'leanplum-lib-common';
import isEqual from 'lodash/isEqual';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { getTextWidth } from '../../utils/getTextWidth';
import { Button } from '../Button/Button';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../icon/Icon';
import { NotificationContent } from '../NotificationTooltip/NotificationContent/NotificationContent';
import { Pill } from '../Pill/Pill';
import { Tooltip } from '../Tooltip/Tooltip';
import { TypeaheadNote } from '../TypeaheadNote/TypeaheadNote';

import './MultiValueInput.scss';

/**
 * A multi value input component.
 *
 * Allows a user to provide multiple values - when the user
 * clicks enter the value is added as a `pill`. Pills can be
 * edited and deleted.
 */
@Component({ name: 'MultiValueInput' })
class MultiValueInput extends Vue {
  private static readonly PASTE_REGEX = /,|\t|\n/;
  private static readonly MIN_PILL_WIDTH: number = 56;
  private static readonly MAX_PILL_WIDTH: number = 216;

  static readonly EVENT_INPUT: string = 'input';
  static readonly EVENT_CHANGE: string = 'change';
  static readonly EVENT_BUTTON_CLICK: string = 'buttonClick';
  static readonly EVENT_FOCUS: string = 'focus';
  static readonly EVENT_FOCUS_OUT: string = 'focusOut';

  @Prop({ required: false, type: Array, default: (): Array<string> => [] })
  readonly pills: Array<string>;

  @Prop({ required: false, type: Boolean, default: false })
  readonly disabled: boolean;

  @Prop({ required: false, type: Boolean, default: false })
  readonly autoFocus: boolean;

  @Prop({ required: false, type: Number, default: Infinity })
  readonly maxPillCount: number;

  @Prop({ required: false, type: Number, default: null })
  readonly maxLength: number | null;

  @Prop({ required: false, type: String, default: '' })
  readonly placeholder: string;

  @Prop({ required: false, type: String, default: '' })
  readonly typeaheadSummary: string;

  @Prop({ required: false, type: Array, default: (): Array<LabeledValue> => [] })
  readonly typeaheadOptions: Array<LabeledValue>;

  @Prop({ required: false, type: Array, default: (): Array<Array<string> | undefined> => [] })
  readonly warnings: Array<Array<string> | undefined>;

  @Prop({ required: false, type: Array, default: (): Array<Array<string> | undefined> => [] })
  readonly errors: Array<Array<string> | undefined>;

  private editingIndex: number = -1;
  private editingValue: string = '';
  private computedWidths: Dictionary<number> = {};
  private animateWidth: boolean = false; // Allows disabling pill width animation on paste and pill delete.
  private showConfirmModal: boolean = false;
  private pastedData: { pills: Array<string>, total: number, inserted: number } | null = null;

  private get currentPills(): Array<Value> {
    let hasInput = false;

    const pills = this.pills.map((value, index) => {
      const isInput = index === this.editingIndex;
      hasInput = hasInput || isInput;

      return { isInput, value, width: this.getWidth(value) };
    });

    if (!hasInput && this.shouldShowInput) {
      pills.push({ isInput: true, value: '', width: this.getWidth('') });
    }

    return pills;
  }

  private get isEmpty(): boolean {
    return this.pills.length === 0;
  }

  private get shouldShowInput(): boolean {
    return this.editingIndex !== -1 || this.isEmpty;
  }

  private get visibleTypeaheadOptions(): Array<LabeledValue> {
    // Exclude all current pill values from the visible typeahead options.
    // The currently edited pill's original value should not be hidden though.
    const hiddenOptions = new Set(this.pills.filter((_, i) => i !== this.editingIndex));

    return this.typeaheadOptions.filter(({ label }: LabeledValue) => !hiddenOptions.has(label));
  }

  private get inputErrors(): Array<string> {
    const index = this.isEmpty ? 0 : this.editingIndex;

    return index >= 0 && this.errors[index] || [];
  }

  private get inputWarnings(): Array<string> {
    const index = this.isEmpty ? 0 : this.editingIndex;

    return index >= 0 && this.warnings[index] || [];
  }

  private get inputClasses(): string {
    return cx({
      first: this.pills.length === 0 || this.editingIndex === 0,
      error: this.inputErrors.length > 0,
      warning: this.inputErrors.length === 0 && this.inputWarnings.length > 0
    });
  }

  private get buttonDisabled(): boolean {
    return (
      this.pills.length >= this.maxPillCount ||
      (this.shouldShowInput && this.editingValue.length === 0)
    );
  }

  $refs: {
    input: HTMLInputElement;
    button: Button;
  };

  mounted(): void {
    if (this.autoFocus) {
      this.$refs.input?.focus();
    }
  }

  render(): VNode {
    return (
      <div class="lp-multi-value-input">
        <div class="multi-line-wrapper">
          {this.currentPills.map(({ isInput, value, width }, index) => (
            <div
              key={index}
              class={cx('multi-value', { 'animate-width': this.animateWidth || isInput })}
              style={`--pill-width: ${width}px`}
            >
              {isInput ? this.renderInput() : this.renderPill(value, index)}
            </div>
          ))}
          {this.renderButton()}
        </div>
        {this.showConfirmModal && this.renderConfirmModal()}
      </div>
    );
  }

  private renderPill(pillValue: string, index: number): VNode {
    return (
      <Pill
        class="multi-value-pill"
        text={pillValue}
        warning={this.warnings[index]}
        error={this.errors[index]}
        disabled={this.disabled}
        showClose={this.pills.length > 1}
        onClick={() => this.pillEditStart(pillValue, index)}
        onClose={() => this.pillDelete(index)}
      />
    );
  }

  private renderInput(): VNode {
    const notificationType = this.inputErrors.length > 0 ? Tooltip.Type.ERROR : Tooltip.Type.WARNING;
    const notificationMessage = this.inputErrors.length > 0 ? this.inputErrors : this.inputWarnings;

    return (
      <Dropdown
        popupClass="lp-multi-value-input-dropdown"
        options={this.visibleTypeaheadOptions}
        closeOnSelect={false}
        disabled={this.showConfirmModal}
        onSelect={this.onSelectFromDropdown}
      >
        {this.typeaheadSummary && <TypeaheadNote text={this.typeaheadSummary} slot="header" />}
        <Tooltip type={notificationType} placement={Tooltip.Placement.TOP}>
          <input
            class={this.inputClasses}
            ref="input"
            v-model={this.editingValue}
            placeholder={this.placeholder}
            maxLength={this.maxLength}
            disabled={this.disabled}
            onFocus={this.onFocus}
            onFocusout={this.onFocusOut}
            onKeyup={this.onKeyUp}
            onPaste={this.onPaste}
          />
          {notificationMessage.length > 0 && <NotificationContent slot="content" message={notificationMessage} />}
        </Tooltip>
      </Dropdown>
    );
  }

  private renderButton(): VNode | null {
    if (this.disabled) {
      return null;
    }

    return (
      <Button
        ref="button"
        class="multi-value-button"
        icon={Icon.Type.PLUS}
        tooltip={this.pills.length >= this.maxPillCount ? 'Maximum allowed number of values reached' : ''}
        tooltipPlacement={Tooltip.Placement.TOP}
        disabled={this.buttonDisabled}
        onClick={this.onButtonClick}
      />
    );
  }

  private renderConfirmModal(): VNode {
    return (
      <ConfirmModal
        opened={this.showConfirmModal}
        title="Limit Exceeded"
        confirmLabel="Continue"
        onCancel={this.onClosePaste}
        onConfirm={this.onConfirmPaste}
      >
        <p>
          The maximum number of multiple values reached. Only <b>{this.pastedData?.inserted ?? 'N/A'}</b> out of the{' '}
          <b>{this.pastedData?.total ?? 'N/A'}</b> pasted values will be added. Are you sure you want to continue?
        </p>
      </ConfirmModal>
    );
  }

  private onFocus(): void {
    this.animateWidth = true;

    if (this.isEmpty) {
      this.editingIndex = 0;
    }

    this.$emit(MultiValueInput.EVENT_FOCUS);
  }

  private onFocusOut(): void {
    if (this.editingValue === '') {
      this.pillDelete(this.editingIndex);
    } else {
      this.pillEditComplete(this.editingValue);
    }

    this.editingValue = '';
    this.editingIndex = -1;

    this.$emit(MultiValueInput.EVENT_FOCUS_OUT);
  }

  private onKeyUp(event?: KeyboardEvent): void {
    if (event) {
      switch (event.key) {
        case KeyboardConstants.ENTER_KEY:
          this.addPillAndKeepInput(this.editingValue);
          break;
        default:
          const values = this.currentPills.map(({ value }) => value);
          values[this.editingIndex] = this.editingValue;
          this.$emit(MultiValueInput.EVENT_INPUT, { inputValue: this.editingValue, values });
      }
    }
  }

  private onPaste(event: ClipboardEvent): void {
    if (!event.clipboardData) {
      return;
    }

    event.preventDefault();

    const data = event.clipboardData.getData('text/plain').split(MultiValueInput.PASTE_REGEX);
    const pills = data.map((pill) => pill.trim());

    if (pills.length === 0) {
      return;
    }

    const pillsToInsert = pills.slice(0, this.maxPillCount - this.currentPills.length + 1);

    const newPills = this.currentPills.map(({ value }) => value);
    newPills.splice(this.editingIndex, 1, ...pillsToInsert);

    if (pillsToInsert.length < pills.length) {
      this.pastedData = { pills: newPills, total: data.length, inserted: pillsToInsert.length };
      this.openConfirmModal();
    } else {
      this.finishPaste(newPills);
    }
  }

  private finishPaste(newPills: Array<string>): void {
    this.editingIndex = -1;
    this.editingValue = '';

    this.animateWidth = false;
    this.emitChange(newPills);
  }

  private onConfirmPaste(): void {
    this.finishPaste(this.pastedData?.pills ?? []);
    this.onClosePaste();
  }

  private onClosePaste(): void {
    this.pastedData = null;
    this.closeConfirmModal();
  }

  private openConfirmModal(): void {
    this.showConfirmModal = true;
  }

  private closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  private async onButtonClick(): Promise<void> {
    this.editingIndex = this.pills.length;
    this.editingValue = '';

    this.$emit(MultiValueInput.EVENT_BUTTON_CLICK);

    await this.focusInput();
  }

  private onSelectFromDropdown({ label }: Dropdown.Item, isMouseClick: boolean): void {
    if (isMouseClick) {
      this.animateWidth = false;
      this.pillEditComplete(label);
    } else {
      this.addPillAndKeepInput(label);
    }
  }

  @Debounced(0)
  private async addPillAndKeepInput(value: string): Promise<void> {
    this.animateWidth = false;
    if (this.pillEditComplete(value)) {
      // Skip over the focus out.
      await this.$nextTick();
      this.onButtonClick();
    }
  }

  private async pillEditStart(value: string, index: number): Promise<void> {
    // Complete any previous edit.
    if (this.pillEditComplete(this.editingValue)) {
      this.editingIndex = index;
      this.editingValue = value;

      await this.focusInput();
    }
  }

  private pillEditComplete(newValue: string): boolean {
    if (newValue.length === 0) {
      return true; // nothing to do.
    }

    let updated = false;
    const newPills = this.currentPills.map(({ isInput, value }) => {
      updated = updated || isInput;

      return isInput ? newValue : value;
    });

    if (!updated) {
      newPills.push(newValue);
    }

    if (!isEqual(this.currentPills.map(({value}) => value), newPills)) {
      this.emitChange(newPills);
    }

    this.editingValue = '';
    this.editingIndex = -1;

    return true; // pill added.
  }

  private pillDelete(index: number): void {
    this.animateWidth = false;
    this.emitChange(this.pills.filter((_, i) => i !== index));
  }

  private getWidth(value: string): number {
    if (value === '') {
      return MultiValueInput.MAX_PILL_WIDTH;
    }

    if (this.computedWidths[value] !== undefined) {
      return this.computedWidths[value];
    }

    const width = Math.min(
      Math.max(getTextWidth(value) + 32, MultiValueInput.MIN_PILL_WIDTH),
      MultiValueInput.MAX_PILL_WIDTH
    );

    this.computedWidths[value] = width;

    return width;
  }

  private async focusInput(): Promise<void> {
    await this.$nextTick();
    this.$refs.input?.focus();
    this.$refs.input?.select();
  }

  private emitChange(pills: Array<string>): void {
    this.$emit(MultiValueInput.EVENT_CHANGE, pills);
  }
}

interface Value {
  isInput: boolean;
  value: string;
  width: number;
}

export { MultiValueInput };
