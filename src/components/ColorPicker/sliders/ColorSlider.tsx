import tinycolor from 'tinycolor2';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './ColorSlider.scss';

@Component({ name: 'ColorSlider' })
class ColorSlider extends Vue {
  @Prop({ type: Object, required: true })
  color: tinycolor.Instance;

  @Prop({ required: true })
  hue: number;

  private isDragging: boolean = false;

  mounted(): void {
    this.$el.addEventListener('mousedown', this.onMouseDown);
  }

  beforeDestroy(): void {
    this.$el.removeEventListener('mousedown', this.onMouseDown);
  }

  handleMove(event: MouseEvent): void {
    // children components shall implement this method
  }

  protected onMouseDown(event?: MouseEvent): void {
    if (event) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);

      this.isDragging = true;
    }
  }

  protected onMouseMove(event?: MouseEvent): void {
    if (event && this.$el && this.isDragging) {
      this.handleMove(event);
    }
  }

  protected onMouseUp(): void {
    if (this.$el && this.isDragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);

      this.isDragging = false;
    }
  }
}

export { ColorSlider };
