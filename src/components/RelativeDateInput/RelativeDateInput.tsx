import { DropdownOption, RelativeDate, subset } from 'leanplum-lib-common';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { DropdownButton } from '../DropdownButton/DropdownButton';
import { TextInput } from '../TextInput/TextInput';

import './RelativeDateInput.scss';

@Component({ name: 'RelativeDateInput' })
class RelativeDateInput extends Vue {
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_FOCUS_OUT = 'focusOut';

  static readonly DIRECTION_OPTIONS: Array<DropdownOption<number>> = [
    { label: RelativeDate.offsetDirection(-1), value: -1 },
    { label: RelativeDate.offsetDirection(1), value: 1 }
  ];

  @Prop({ type: Object, required: true })
  readonly value: RelativeDate;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly directionDisabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly autoFocus: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly showInputDirectionLabel: boolean;

  @Prop({
    type: Array,
    required: false,
    default: (): Array<RelativeDate.Unit> => values(RelativeDate.Unit),
    validator: subset(values(RelativeDate.Unit))
  })
  readonly timeUnits: Array<RelativeDate.Unit>;

  private inputValue: string = '';
  private inputError: string | null = null;
  private selectedDirection: DropdownOption<number> = RelativeDateInput.DIRECTION_OPTIONS.find(
    (x) => x.value === this.sign
  )!;

  @Watch('value', { immediate: true })
  onValueChange(): void {
    if (isNaN(this.value.offset)) {
      return;
    }

    this.selectedDirection = RelativeDateInput.DIRECTION_OPTIONS.find((x) => x.value === this.sign)!;
    this.inputValue = String(Math.abs(this.value.offset));
  }

  private get selectedUnit(): DropdownOption<RelativeDate.Unit> {
    return { value: this.value.unit, label: RelativeDate.formatUnit(this.value.offset, this.value.unit) };
  }

  private get timeUnitOptions(): Array<DropdownOption<RelativeDate.Unit>> {
    return this.timeUnits.map((value: RelativeDate.Unit) => ({
      value,
      label: RelativeDate.formatUnit(this.value.offset, value)
    }));
  }

  private get sign(): number {
    return this.value.offset ? Math.sign(this.value.offset) : -1;
  }

  render(): VNode {
    return (
      <div class="lp-relative-time-input">
        <TextInput
          placeholder="value"
          autoFocus={this.autoFocus}
          disabled={this.disabled}
          value={this.inputValue}
          loading={this.loading}
          showTooltipWhenOverflowing={true}
          error={this.inputError}
          onInput={this.onUnitInput}
          onFocusOut={this.emitFocusOut}
        />
        <DropdownButton
          disabled={this.disabled}
          activeItem={this.selectedUnit}
          items={this.timeUnitOptions}
          inline={true}
          onSelect={this.onSelectTimeMode}
        />
        {this.showInputDirectionLabel && (
          <DropdownButton
            class="lp-relative-time-input-direction"
            disabled={this.disabled || this.directionDisabled}
            activeItem={this.selectedDirection}
            items={RelativeDateInput.DIRECTION_OPTIONS}
            inline={true}
            onSelect={this.onSelectDirection}
          />
        )}
      </div>
    );
  }

  private onUnitInput(value: string): void {
    this.inputValue = value;
    const parsed = Number(value);

    this.inputError = !Number.isInteger(parsed) || parsed < 0 ? `Value must be a positive integer` : null;

    this.emitChange({ offset: parsed });
  }

  private onSelectTimeMode({ value }: DropdownOption<RelativeDate.Unit>): void {
    this.emitChange({ unit: value });
  }

  private onSelectDirection(item: DropdownOption<number>): void {
    this.selectedDirection = item;

    if (this.sign === item.value) {
      return;
    }

    this.emitChange({ offset: this.value.offset * -1 });
  }

  private emitChange(value: Partial<RelativeDate>): void {
    const mergedValue = { ...this.value, ...value };
    const offset = this.inputError ? NaN : Math.abs(mergedValue.offset) * this.selectedDirection.value;
    const newValue = { ...mergedValue, offset };

    this.$emit(RelativeDateInput.EVENT_CHANGE, newValue);
  }

  private emitFocusOut(): void {
    this.$emit(RelativeDateInput.EVENT_FOCUS_OUT);
  }
}

export { RelativeDateInput };
