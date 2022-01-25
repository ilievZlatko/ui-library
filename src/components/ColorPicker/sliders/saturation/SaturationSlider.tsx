import clamp from 'lodash/clamp';
import tinycolor from 'tinycolor2';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ColorPickerConstants } from '../../ColorPickerConstants';
import { ColorSlider } from '../ColorSlider';

@Component({ name: 'SaturationSlider' })
class SaturationSlider extends ColorSlider {
  render(): VNode {
    return (
      <div class="color-slider saturation" style={this.containerStyle}>
        <div class="bar saturation" style={this.barStyle} onClick={this.handleMove}>
          <div class="bg white" />
          <div class="bg black" />
        </div>
        <span class="thumb" style={this.thumbStyle} />
      </div>
    );
  }

  private get containerStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: `${ColorPickerConstants.BG_SIZE}px`,
      height: `${ColorPickerConstants.BG_SIZE}px`
    };
  }

  private get thumbStyle(): Partial<CSSStyleDeclaration> {
    const { r, g, b } = this.color.toRgb();
    const { s, v } = this.color.toHsv();

    return {
      borderColor: this.color.isDark() ? '#FFFFFF' : '#000000',
      background: `rgb(${r}, ${g}, ${b})`,
      top: `${(1 - v) * ColorPickerConstants.BG_SIZE}px`,
      left: `${s * ColorPickerConstants.BG_SIZE}px`
    };
  }

  private get barStyle(): Partial<CSSStyleDeclaration> {
    return {
      background: `hsl(${this.hue}, 100%, 50%)`
    };
  }

  // public because it extends the base class
  public handleMove(event: MouseEvent): void {
    if (event && this.$el) {
      const rect = this.$el.getBoundingClientRect();

      const left: number = clamp(event.clientX - rect.left, 0, ColorPickerConstants.BG_SIZE);
      const top: number = clamp(event.clientY - rect.top, 0, ColorPickerConstants.BG_SIZE);

      const newColor: tinycolor.Instance = tinycolor({
        h: this.hue,
        s: (left / ColorPickerConstants.BG_SIZE) * 100,
        v: 100 - (top / ColorPickerConstants.BG_SIZE) * 100,
        a: this.color.getAlpha()
      });

      this.$emit('change', newColor);
    }
  }
}

export { SaturationSlider };
