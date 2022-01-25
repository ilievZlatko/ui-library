import values from 'lodash/values';
import { VNode } from 'vue';
import { mixins } from 'vue-class-component';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Resize } from '../../mixins/resize';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Tooltip } from '../Tooltip/Tooltip';

import './OverflowableText.scss';

@Component({ name: 'OverflowableText' })
class OverflowableText extends mixins(Resize) {
  @Prop({ type: String, required: false, default: '' })
  readonly text: string;

  @Prop({ type: String, required: false, default: '' })
  readonly tooltip: string;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(AnchoredPopup.Placement).indexOf(value) > -1,
    default: () => AnchoredPopup.Placement.TOP
  })
  readonly tooltipPlacement: AnchoredPopup.Placement;

  private isTextOverflowing: boolean = false;

  readonly $refs: {
    title: HTMLElement;
  };

  @Watch('text')
  async onResize(): Promise<void> {
    requestAnimationFrame(() => {
      if (this.$refs.title) {
        this.isTextOverflowing = this.$refs.title.scrollWidth > this.$refs.title.clientWidth;
      }
    });
  }

  mounted(): void {
    this.onResize();
  }

  render(): VNode {
    const content = (
      <div ref="title" class="overflowable-text">
        {this.text}
      </div>
    );

    const tooltipMessage = this.renderTooltipMessage();

    return tooltipMessage ? (
      <Tooltip message={tooltipMessage} placement={this.tooltipPlacement}>
        {content}
      </Tooltip>
    ) : content;
  }

  private renderTooltipMessage(): string | VNode {
    if (!this.tooltip) {
      // No custom tooltip - show overflow text only when needed.
      return this.isTextOverflowing ? this.text : '';
    }

    if (!this.isTextOverflowing || !this.text) {
      // Custom tooltip and not overflowing - show only the custom tooltip.
      return this.tooltip;
    }

    // Custom tooltip and overflowing - show both.
    return (
      <div slot="content">
        <div class="overflowable-text-tooltip-text">{this.text}</div>
        <div class="overflowable-text-tooltip-separator" />
        <div>{this.tooltip}</div>
      </div>
    );
  }
}

export { OverflowableText };
