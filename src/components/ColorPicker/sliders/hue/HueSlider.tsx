import clamp from 'lodash/clamp';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { ColorPickerConstants } from '../../ColorPickerConstants';
import { ColorSlider } from '../ColorSlider';

@Component({ name: 'HueSlider' })
class HueSlider extends ColorSlider {
  private static HUE_RADIUS: number = 360;

  render(): VNode {
    return (
      <div class="color-slider hue" style={this.containerStyle}>
        <div class="bar" onClick={this.handleMove} />
        <span class="thumb" style={this.thumbStyle} />
      </div>
    );
  }

  private get containerStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: `${ColorPickerConstants.HUE_ALPHA_SIZE}px`,
      height: `${ColorPickerConstants.BG_SIZE}px`,
      marginLeft: `${ColorPickerConstants.SPLIT_MARGIN_SIZE}px`
    };
  }

  private get thumbStyle(): Partial<CSSStyleDeclaration> {
    const top: number = Math.round(
      (this.hue * (ColorPickerConstants.BG_SIZE - ColorPickerConstants.SLIDER_THUMB_SIZE / 2)) / HueSlider.HUE_RADIUS
    );

    return {
      height: `${ColorPickerConstants.SLIDER_THUMB_SIZE}px`,
      top: `${top}px`
    };
  }

  // public because it extends the base class
  public handleMove(event: MouseEvent): void {
    if (event && this.$el) {
      this.updateHuePosition(event.clientY - this.$el.getBoundingClientRect().top);
    }
  }

  // public for testing
  public updateHuePosition(top: number): void {
    const rectHeight: number = ColorPickerConstants.BG_SIZE;
    const thumbTop: number = ColorPickerConstants.SLIDER_THUMB_SIZE;

    top = clamp(top, thumbTop / 2, rectHeight - thumbTop / 2);

    const hue = Math.round(((top - thumbTop / 2) / (rectHeight - thumbTop)) * HueSlider.HUE_RADIUS);

    this.$emit('change', hue);
  }
}

export { HueSlider };
