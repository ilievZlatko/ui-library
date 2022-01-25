import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import './DevicePreview.scss';

@Component({ name: 'DevicePreview' })
class DevicePreview extends Vue {
  static HEIGHT: number = 800;
  static WIDTH: number = 400;
  static DEFAULT_OUTLINE_COLOR: string = '#1076fb';
  static CONTAINER_PADDING: number = 80;

  public $refs!: {
    scaleContainer: HTMLDivElement;
  };
  private scale: number = 1;
  private resizeObserver: ResizeObserver | null = null;

  @Prop({
    type: String,
    required: false,
    default: 'portrait',
    validator(value: DevicePreview.OrientationType): boolean {
      return values(DevicePreview.OrientationType).indexOf(value) > -1;
    }
  })
  readonly orientation: DevicePreview.OrientationType;

  @Prop({ type: Number, required: false, default: DevicePreview.WIDTH })
  readonly width: number;

  @Prop({ type: Number, required: false, default: DevicePreview.HEIGHT })
  readonly height: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly highlighted: boolean;

  @Prop({ type: String, required: false, default: DevicePreview.DEFAULT_OUTLINE_COLOR })
  readonly highlightColor: string;

  @Prop({ type: Number, required: false, default: DevicePreview.CONTAINER_PADDING })
  readonly containerPadding: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly overflowHidden: boolean;

  // TODO: (Zlatko) This is a workaround solution to handle
  // TODO: the device position in MMC full-preview screen
  // TODO: Need to another solution and remove the prop!
  @Prop({ type: String, required: false, default: '-50%' })
  readonly translateY: string;

  @Watch('width', { immediate: true })
  @Watch('height', { immediate: true })
  @Watch('orientation', { immediate: true })
  protected changeSize(): void {
    if (this.$refs.scaleContainer) {
      this.onResize();
    }
  }

  mounted(): void {
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.$refs.scaleContainer);
  }

  beforeDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$refs.scaleContainer);
    }
  }

  render(): VNode {
    return (
      <div
        class="device-scale-wrapper"
        ref="scaleContainer"
      >
        <div class="device-preview-frame" style={this.contentStyle}>
          {this.$slots.default}
        </div>
      </div>
    );
  }

  private get contentStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: this.orientation === 'landscape' ? `${this.height}px` : `${this.width}px`,
      height: this.orientation === 'landscape' ? `${this.width}px` : `${this.height}px`,
      outline: this.highlighted ? `0.75rem solid ${this.highlightColor}` : 'none',
      transform: `translate(-50%, ${this.translateY}) scale(${this.scale < 1 ? this.scale : 1})`,
      overflow: this.overflowHidden ? 'hidden' : 'unset'
    };
  }

  private onResize(): void {
    this.scale = Math.min(
      (this.$refs.scaleContainer.clientWidth - this.containerPadding) /
      (this.orientation === 'portrait' ? this.width : this.height),
      (this.$refs.scaleContainer.clientHeight - this.containerPadding) /
      (this.orientation === 'portrait' ? this.height : this.width)
    );
  }
}

namespace DevicePreview {
  export enum OrientationType {
    PORTRAIT = 'portrait',
    LANDSCAPE = 'landscape'
  }

  export interface Props {
    orientation?: DevicePreview.OrientationType;
    width?: number;
    height?: number;
    highlighted?: boolean;
    highlightColor?: string;
    overflowHidden?: boolean;
  }
}

export { DevicePreview };
