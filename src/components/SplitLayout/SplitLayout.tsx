import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { stopPropagation } from '../../../../lib-common/src';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';

import './SplitLayout.scss';

@Component({ name: 'SplitLayout' })
export class SplitLayout extends Vue {
  static readonly EVENT_COLLAPSED_PANE_CHANGE = 'collapsedPaneChange';

  @Prop({ type: Number, required: true })
  readonly leftMin: number;

  @Prop({ type: Number, required: true })
  readonly rightMin: number;

  @Prop({ type: String, required: true })
  readonly storageKey: string;

  @Prop({ type: Boolean, required: false, default: true })
  readonly showResizeIndicator: number;

  @Prop({ type: Number, required: false, default: 24 })
  readonly collapsedWidth: number;

  @Prop({ type: String, required: false, default: null })
  readonly collapsedPane: NullablePane;

  @Prop({ type: String, required: false, default: null })
  readonly collapsiblePane: NullablePane;

  readonly $slots: {
    left: Array<VNode>;
    right: Array<VNode>;
  };

  readonly $refs: {
    container: HTMLDivElement;
    right: HTMLDivElement;
  };

  private left: number = 0;
  private right: number = 0;

  private initialDragX: number = 0;
  private dragDeltaX: number = 0;

  private internalCollapsedPane: NullablePane = null;

  private expandingPane: NullablePane = null;

  private containerResizeObserver?: ResizeObserver;
  private rightPaneResizeObserver?: ResizeObserver;

  private rightPaneHeight: number = 0;

  private get expandedWidth(): number {
    return this.left + this.right - this.collapsedWidth;
  }

  private get leftOrExpanded(): number {
    if (this.internalCollapsedPane === Pane.RIGHT) {
      return this.expandedWidth;
    }

    return this.left + this.dragDeltaX;
  }

  private get rightOrExpanded(): number {
    if (this.internalCollapsedPane === Pane.LEFT) {
      return this.expandedWidth;
    }

    return this.right - this.dragDeltaX;
  }

  private get separatorX(): number {
    switch (this.internalCollapsedPane) {
      case Pane.LEFT:
        return this.collapsedWidth;
      case Pane.RIGHT:
        return this.expandedWidth;
      default:
        return this.left + this.dragDeltaX;
    }
  }

  private get hasTransitioningPane(): boolean {
    return Boolean(this.internalCollapsedPane || this.expandingPane);
  }

  private get leftPaneStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: pxOrAuto(this.leftOrExpanded),
      maxWidth: pxOrAuto(this.leftOrExpanded)
    };
  }

  private get rightPaneStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: pxOrAuto(this.rightOrExpanded)
    };
  }

  private get separatorStyle(): Partial<CSSStyleDeclaration> {
    return {
      transform: `translateX(${this.separatorX}px)`
    };
  }

  private get containerStyle(): Partial<CSSStyleDeclaration> {
    return {
      ...(this.hasTransitioningPane && { minHeight: pxOrAuto(this.rightPaneHeight) })
    };
  }

  private get isCollapseButtonReversed(): boolean {
    return (
      this.internalCollapsedPane === Pane.LEFT ||
      (this.collapsiblePane === Pane.RIGHT && this.internalCollapsedPane === null)
    );
  }

  private get disableDragging(): boolean {
    return this.leftMin + this.rightMin > this.left + this.right || this.hasTransitioningPane;
  }

  @Watch('collapsedPane', { immediate: true })
  onCollapsedPaneChange(): void {
    if (this.collapsedPane) {
      this.internalCollapsedPane = this.collapsedPane;
    } else {
      this.expandPane(this.internalCollapsedPane);
    }
  }

  mounted(): void {
    this.containerResizeObserver = new ResizeObserver(([{ contentRect }]) => {
      this.resizePanels(contentRect.width);
    });
    this.containerResizeObserver.observe(this.$refs.container);

    this.rightPaneResizeObserver = new ResizeObserver(([{ contentRect }]) => {
      this.rightPaneHeight = contentRect.height;
    });
    this.rightPaneResizeObserver.observe(this.$refs.right);

    const persistedRatio = Number(localStorage.getItem(this.storageKey));

    if (persistedRatio) {
      this.setPanelWidths(persistedRatio, this.$refs.container.getBoundingClientRect().width);
    } else {
      const { width } = this.$refs.container.getBoundingClientRect();
      this.resizePanels(width);
    }
  }

  beforeDestroy(): void {
    this.rightPaneResizeObserver?.disconnect();
    this.containerResizeObserver?.disconnect();

    removeEventListener('mousemove', this.onDragMove);
    removeEventListener('touchmove', this.onDragMove);

    removeEventListener('mouseup', this.onDragEnd);
    removeEventListener('touchend', this.onDragEnd);
  }

  render(): VNode {
    return (
      <div
        class={cx('lp-split-layout', {
          'with-transitioning-pane': this.hasTransitioningPane,
          resizing: this.initialDragX !== 0
        })}
        style={this.containerStyle}
        ref="container"
      >
        <div
          class={cx('lp-split-pane', {
            collapsible: this.collapsiblePane === Pane.LEFT,
            collapsed: this.internalCollapsedPane === Pane.LEFT
          })}
          style={this.leftPaneStyle}
          onTransitionend={this.onTransitionend}
        >
          {this.$slots.left}
        </div>
        <div
          class={cx('lp-split-pane-separator', { disabled: this.disableDragging })}
          style={this.separatorStyle}
          onMousedown={this.onDragStart}
          onTouchstart={this.onDragStart}
        >
          {this.collapsiblePane && (
            <Icon
              class={cx('collapse-button', { reverse: this.isCollapseButtonReversed })}
              clickable={true}
              type={Icon.Type.CHEVRON_LEFT}
              size={24}
              padding={4}
              onClick={this.onExpandOrCollapse}
              nativeOnMousedown={stopPropagation}
            />
          )}
          {this.showResizeIndicator && !this.disableDragging && (
            <div class="lp-resize-indicator">
              <div class="lp-resize-indicator-bar" />
              <div class="lp-resize-indicator-bar" />
            </div>
          )}
        </div>
        <div
          class={cx('lp-split-pane', {
            collapsible: this.collapsiblePane === Pane.RIGHT,
            collapsed: this.internalCollapsedPane === Pane.RIGHT
          })}
          style={this.rightPaneStyle}
          onTransitionend={this.onTransitionend}
          ref="right"
        >
          {this.$slots.right}
        </div>
      </div>
    );
  }

  private resizePanels(containerWidth: number): void {
    if (this.collapsiblePane === Pane.LEFT) {
      this.left = Math.max(this.leftMin, this.left);
      this.right = containerWidth - this.left;
    } else if (this.collapsiblePane === Pane.RIGHT) {
      this.right = Math.max(this.rightMin, this.right);
      this.left = containerWidth - this.right;
    } else {
      this.setPanelWidths(this.left && this.right ? this.left / this.right : 1 / 1, containerWidth);
    }
  }

  private getClientX(event: PointerEvent | TouchEvent): number {
    const { clientX } = (window.TouchEvent && event instanceof TouchEvent) ? event.touches[0] : event as PointerEvent;

    return clientX;
  }

  private onDragStart(event: PointerEvent | TouchEvent): void {
    if (this.disableDragging) {
      return;
    }

    const clientX = this.getClientX(event);
    this.initialDragX = clientX;

    addEventListener('mousemove', this.onDragMove);
    addEventListener('touchmove', this.onDragMove);

    addEventListener('mouseup', this.onDragEnd);
    addEventListener('touchend', this.onDragEnd);
  }

  private onDragMove(event: PointerEvent | TouchEvent): void {
    const clientX = this.getClientX(event);
    const deltaX = clientX - this.initialDragX;

    if (this.left + deltaX < this.leftMin) {
      this.dragDeltaX = this.leftMin - this.left;
    } else if (this.right - deltaX < this.rightMin) {
      this.dragDeltaX = this.right - this.rightMin;
    } else {
      this.dragDeltaX = deltaX;
    }
  }

  private onDragEnd(): void {
    this.left += this.dragDeltaX;
    this.right -= this.dragDeltaX;

    this.dragDeltaX = 0;
    this.initialDragX = 0;

    removeEventListener('mousemove', this.onDragMove);
    removeEventListener('touchmove', this.onDragMove);

    removeEventListener('mouseup', this.onDragEnd);
    removeEventListener('touchend', this.onDragEnd);

    localStorage.setItem(this.storageKey, String(this.left / this.right));
  }

  private expandPane(value: NullablePane): void {
    if (this.internalCollapsedPane !== value) {
      return;
    }

    this.expandingPane = value;
    this.internalCollapsedPane = null;
  }

  private onTransitionend(event: TransitionEvent): void {
    if (!this.expandingPane || !event.propertyName.includes('width')) {
      return;
    }

    this.expandingPane = null;
    this.$emit(SplitLayout.EVENT_COLLAPSED_PANE_CHANGE, null);
  }

  private onExpandOrCollapse(): void {
    if (this.internalCollapsedPane) {
      this.expandPane(this.internalCollapsedPane);
    } else if (this.collapsiblePane) {
      this.internalCollapsedPane = this.collapsiblePane;
      this.$emit(SplitLayout.EVENT_COLLAPSED_PANE_CHANGE, this.internalCollapsedPane);
    }
  }

  private setPanelWidths(ratio: number, width: number): void {
    this.left = (width * ratio) / (1 + ratio);
    this.right = width - this.left;
  }
}

type NullablePane = Pane | null;

export enum Pane {
  LEFT = 'left',
  RIGHT = 'right'
}

function pxOrAuto(value: number): string {
  return value ? `${value}px` : 'auto';
}
