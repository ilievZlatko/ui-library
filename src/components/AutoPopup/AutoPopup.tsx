import { Debounced, KeyboardConstants } from 'leanplum-lib-common';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';

/**
 * A popup component that implements the most commonly used popup behaviors.
 *
 * This component can be used as a base for most other popup components
 * like Tooltip and Guide.
 */
@Component({ name: 'AutoPopup' })
class AutoPopup extends Vue {
  private static readonly EVENT_OPEN = 'open';
  private static readonly EVENT_CLOSE = 'close';

  /**
   * Offset along the main axis of the popup.
   * For TOP/BOTTOM placement the vertical axis is the main one.
   * For LEFT/RIGHT placement the horizontal axis is the main one.
   */
  @Prop({ required: false, default: 0 })
  readonly offsetMainAxis: number;

  /**
   * Offset along the secondary axis of the popup.
   * For TOP/BOTTOM placement the horizontal axis is the secondary one.
   * For LEFT/RIGHT placement the vertical axis is the secondary one.
   */
  @Prop({ required: false, default: 0 })
  readonly offsetSecondaryAxis: number;

  /**
   * Keep the popup width aligned with the anchor width.
   */
  @Prop({ type: Boolean, required: false, default: false })
  readonly alignWidths: boolean;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(AnchoredPopup.Placement).indexOf(value) > -1,
    default: () => AnchoredPopup.Placement.AUTO
  })
  readonly placement: AnchoredPopup.Placement;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(AutoPopup.EventTrigger).indexOf(value) > -1,
    default: () => AutoPopup.EventTrigger.CLICK
  })
  readonly eventTrigger: AutoPopup.EventTrigger;

  @Prop({ type: Boolean, required: false, default: false })
  readonly stopPropagation: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly openOnMount!: boolean;

  @Prop({ type: Number, required: false, default: 0 })
  readonly delayOpenMs: number;

  private opened: boolean = this.openOnMount;

  private openTimeout: NodeJS.Timeout;

  /**
   * Toggle the state of the modal or force it to
   * the provided 'opened' state.
   */
  toggle(opened: boolean = !this.opened): void {
    if (opened) {
      this.open();
    } else {
      this.close();
    }
  }

  render(): VNode {
    return (
      <AnchoredPopup
        offsetMainAxis={this.offsetMainAxis}
        offsetSecondaryAxis={this.offsetSecondaryAxis}
        alignWidths={this.alignWidths}
        placement={this.placement}
        opened={this.opened}
        onToggle={this.toggle}
        onAnchorClick={this.onClick}
        onAnchorKeyup={this.onKeyup}
        onAnchorEnter={this.onAnchorEnter}
        onAnchorLeave={this.onLeave}
        onPopupEnter={this.onPopupEnter}
        onPopupLeave={this.onLeave}
      >
        <template slot="anchor">{this.$slots.anchor}</template>
        <template slot="content">{this.$slots.content}</template>
      </AnchoredPopup>
    );
  }

  beforeDestroy(): void {
    this.cancelClose();
    clearTimeout(this.openTimeout);
  }

  private onKeyup(event: KeyboardEvent): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }

    if (event.key === KeyboardConstants.TAB_KEY) {
      this.open();
    }
  }

  private onPopupEnter(event: MouseEvent): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }

    switch (this.eventTrigger) {
      case AutoPopup.EventTrigger.HOVER:
      case AutoPopup.EventTrigger.CLICK_HOVER:
        this.open();
        break;
      default:
    }
  }

  private onAnchorEnter(event: MouseEvent): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }

    switch (this.eventTrigger) {
      case AutoPopup.EventTrigger.HOVER:
        this.open();
        break;
      default:
    }
  }

  private onLeave(event: MouseEvent): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }

    switch (this.eventTrigger) {
      case AutoPopup.EventTrigger.HOVER:
      case AutoPopup.EventTrigger.CLICK_HOVER:
        clearTimeout(this.openTimeout);
        this.close();
        break;
      default:
    }
  }

  private onClick(event: MouseEvent): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }

    switch (this.eventTrigger) {
      case AutoPopup.EventTrigger.CLICK:
      case AutoPopup.EventTrigger.CLICK_HOVER:
        this.toggle();
        break;
      case AutoPopup.EventTrigger.HOVER:
        clearTimeout(this.openTimeout);
        this.close();
        break;
      default:
    }
  }

  private open(): void {
    if (this.disabled) {
      return;
    }

    this.cancelClose();

    if (this.delayOpenMs) {
      this.openTimeout = setTimeout(this.executeOpen, this.delayOpenMs);
    } else {
      this.executeOpen();
    }
  }

  private executeOpen(): void {
    this.opened = true;

    this.$emit(AutoPopup.EVENT_OPEN);
  }

  @Debounced()
  private close(): void {
    this.opened = false;
    this.$emit(AutoPopup.EVENT_CLOSE);
  }

  @Debounced.Cancel('close') private cancelClose: () => void;
}

namespace AutoPopup {
  export const Placement = AnchoredPopup.Placement;
  export type Placement = AnchoredPopup.Placement;
  export enum EventTrigger {
    CLICK = 'click', // Opening and closing the popup happens only on clicks.
    HOVER = 'hover', // Opening and closing the popup happens only on mouse in/out.
    CLICK_HOVER = 'click_hover' // Opening only on click, closing on mouse out.
  }
}

export { AutoPopup };
