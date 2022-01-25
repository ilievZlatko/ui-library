import clamp from 'lodash/clamp';
import tinycolor from 'tinycolor2';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ColorPickerConstants } from '../../ColorPickerConstants';
import { ColorSlider } from '../ColorSlider';

@Component({ name: 'AlphaSlider' })
class AlphaSlider extends ColorSlider {
  render(): VNode {
    return (
      <div class="color-slider alpha" style={this.containerStyle}>
        <div class="bar" style={this.barStyle} onClick={this.handleMove} />
        <span class="thumb" style={this.thumbStyle} />
      </div>
    );
  }

  private get containerStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: `${ColorPickerConstants.TOTAL_WIDTH}px`,
      height: `${ColorPickerConstants.HUE_ALPHA_SIZE}px`,
      backgroundImage: ColorPickerConstants.ALPHA_BG,
      marginTop: `${ColorPickerConstants.SPLIT_MARGIN_SIZE}px`
    };
  }

  private get barStyle(): Partial<CSSStyleDeclaration> {
    const { r, g, b } = this.color.toRgb();

    return {
      background: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`
    };
  }

  private get thumbStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: `${ColorPickerConstants.SLIDER_THUMB_SIZE}px`,
      left: `${Math.round(this.color.getAlpha() * 100)}%`
    };
  }

  // public because it extends the base class
  public handleMove(event: MouseEvent): void {
    if (event && this.$el) {
      const rectWidth: number = ColorPickerConstants.TOTAL_WIDTH;
      const thumbWidth: number = ColorPickerConstants.SLIDER_THUMB_SIZE;

      const left: number = clamp(
        event.clientX - this.$el.getBoundingClientRect().left,
        thumbWidth / 2,
        rectWidth - thumbWidth / 2
      );

      const alpha: number = Math.round(((left - thumbWidth / 2) / (rectWidth - thumbWidth)) * 100);

      const newColor: tinycolor.Instance = tinycolor(this.color.toRgbString()).setAlpha(alpha / 100);

      this.$emit('change', newColor);
    }
  }
}

export { AlphaSlider };
