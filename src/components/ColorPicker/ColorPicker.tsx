import tinycolor from 'tinycolor2';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Button } from '../Button/Button';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';
import { Modal } from '../Modal/Modal';
import { ColorPickerConstants } from './ColorPickerConstants';
import { AlphaSlider } from './sliders/alpha/AlphaSlider';
import { HueSlider } from './sliders/hue/HueSlider';
import { SaturationSlider } from './sliders/saturation/SaturationSlider';

import './ColorPicker.scss';

@Component({ name: 'ColorPicker' })
class ColorPicker extends Vue {
  private static readonly DEFAULT_VALUE: string = 'rgba(255, 255, 255, 1)';
  private static readonly DEFAULT_PLACEHOLDER: string = 'Choose a color';

  private localValue: tinycolor.Instance;
  private localHue: number;
  private showDialog: boolean;

  @Prop({ type: String, required: false, default: null })
  readonly label: string | null;

  @Prop({ type: String, required: false, default: null })
  readonly defaultValue: string | null;

  @Prop({ type: String, required: false, default: null })
  readonly value: string | null;

  @Prop({ type: String, required: false, default: null })
  readonly error: string | null;

  @Prop({ required: false, default: false })
  readonly disabled: boolean;

  @Prop({ required: false, default: false })
  readonly readonly: boolean;

  @Prop({ required: false, default: false })
  readonly clearButton: boolean;

  @Prop({ required: false, default: false })
  readonly useNewStyles: boolean;

  @Watch('value', { immediate: true })
  onChangeValue(): void {
    this.resetLocals(this.value);
  }

  data(): ColorPicker.Data {
    const localValue = tinycolor(this.value || this.defaultValue || ColorPicker.DEFAULT_VALUE);

    return {
      localValue,
      localHue: localValue.toHsv().h,
      showDialog: false
    };
  }

  render(): VNode {
    if (this.label !== null) {
      return (
        <LegendWrapper
          class="lp-color-picker-legend"
          label={this.label}
          readonly={this.readonly}
          error={this.error}
          onFocus={this.openDialog}
          expanded={true}
        >
          {this.renderInput()}
          <template slot={LegendWrapper.Slot.LABEL}>{this.$slots[LegendWrapper.Slot.LABEL]}</template>
          <template slot={LegendWrapper.Slot.LABEL_HOVER}>{this.$slots[LegendWrapper.Slot.LABEL_HOVER]}</template>
          <template slot={LegendWrapper.Slot.LABEL_ACTIVE}>{this.$slots[LegendWrapper.Slot.LABEL_ACTIVE]}</template>
        </LegendWrapper>
      );
    }

    return this.renderInput();
  }

  private renderInput(): VNode {
    return (
      <div class={this.classNames}>
        <div class="control" onClick={this.openDialog}>
          <div class="color-preview" style={{ 'background-image': ColorPickerConstants.ALPHA_BG }}>
            <div class="value" style={{ background: this.valueStr }} />
          </div>
          <p class="value-str">{this.valueStr}</p>
        </div>
        {this.clearButton && (
          <span class="clear floating" onClick={this.onClearValue}>
            ×
          </span>
        )}
        {this.showDialog && (
          <Modal
            className="lp-color-picker-modal"
            title="Choose a color"
            onClose={this.hideDialog}
            escClose={true}
            closeButton={true}
            width="420px"
          >
            <div class="color-slider-container">
              <div
                class="bg-hue"
                style={{
                  width: `${ColorPickerConstants.TOTAL_WIDTH}px`,
                  height: `${ColorPickerConstants.BG_SIZE}px`
                }}
              >
                <SaturationSlider color={this.localValue} hue={this.localHue} onChange={this.updateColor} />
                <HueSlider color={this.localValue} hue={this.localHue} onChange={this.updateHue} />
              </div>
              <AlphaSlider color={this.localValue} hue={this.localHue} onChange={this.updateColor} />
            </div>
            <div class="input">
              <label>
                <input class="value-input" type="text" value={this.localValueStr} onChange={this.updateValue} />
              </label>
            </div>
            <template slot="footer">
              <Button class="close" onClick={this.hideDialog} text="Close" />
              {!this.isPristine && [
                <Button class="reset" disabled={this.isPristine} onClick={this.resetLocals} text="Reset" />,
                <Button
                  class="save"
                  color={Button.Color.PRIMARY}
                  disabled={this.isPristine}
                  onClick={this.emitChange}
                  text="Save"
                />
              ]}
            </template>
          </Modal>
        )}
      </div>
    );
  }

  private get classNames(): string {
    return cx(
      'lp-color-picker-input',
      {
        disabled: this.disabled,
        readonly: this.readonly,
        'new-ux': this.useNewStyles
      }
    );
  }

  private get valueStr(): string {
    if (this.label !== null && this.value === null) {
      return ColorPicker.DEFAULT_PLACEHOLDER;
    }

    return this.colorToRgba(tinycolor(this.value || this.defaultValue || ColorPicker.DEFAULT_VALUE));
  }

  private get localValueStr(): string {
    return this.colorToRgba(this.localValue);
  }

  private get isPristine(): boolean {
    return this.localValueStr === this.valueStr;
  }

  private updateColor(color: tinycolor.Instance): void {
    this.localValue = tinycolor(color.toRgbString());
  }

  private updateHue(hue: number): void {
    this.localHue = hue;
    this.localValue = tinycolor({ ...this.localValue.toHsv(), h: hue });
  }

  private updateValue(event?: Event): void {
    if (event) {
      this.resetLocals((event.target as HTMLInputElement).value);
    }
  }

  private colorToRgba(color: tinycolor.Instance): string {
    const { r, g, b, a } = color.toRgb();

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  private resetLocals(value: string | null): void {
    this.localValue = tinycolor(value || this.defaultValue || ColorPicker.DEFAULT_VALUE);
    this.localHue = this.localValue.toHsv().h;
  }

  private openDialog(): void {
    if (!this.disabled && !this.readonly) {
      this.showDialog = true;
    }
  }

  private hideDialog(): void {
    this.showDialog = false;
    this.resetLocals(this.value);
  }

  private onClearValue(): void {
    this.$emit('clear');
  }

  private emitChange(): void {
    if (!this.disabled && this.localValueStr !== this.valueStr) {
      this.showDialog = false;
      this.$emit('input', this.localValueStr);
      this.$emit('change', this.localValueStr);
    }
  }
}

namespace ColorPicker {
  export interface Data {
    localValue: tinycolor.Instance;
    localHue: number;
    showDialog: boolean;
  }
}

export { ColorPicker };
