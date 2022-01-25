import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { VNodeEventManager } from '../../utils/VNodeEventManager';
import { PortalPopper } from '../PortalPopper/PortalPopper';

import './AnchoredPopup.scss';

// tslint:disable:jsdoc-format
/**
 * A base component for tooltips, guides and dropdowns.
 *
 * Allows the setting of an anchor and content:
```
<AnchoredPopup>
  <div slot="anchor">Anchor</div>
  <p slot="content">Popup content</p>
</AnchoredPopup>
 ```
 */
@Component({ name: 'AnchoredPopup' })
class AnchoredPopup extends Vue {
  static readonly EVENT_TOGGLE = 'toggle';
  static readonly EVENT_ANCHOR_ENTER = 'anchorEnter';
  static readonly EVENT_ANCHOR_LEAVE = 'anchorLeave';
  static readonly EVENT_ANCHOR_CLICK = 'anchorClick';
  static readonly EVENT_ANCHOR_KEYUP = 'anchorKeyup';
  static readonly EVENT_ANCHOR_KEYDOWN = 'anchorKeydown';
  static readonly EVENT_POPUP_ENTER = 'popupEnter';
  static readonly EVENT_POPUP_LEAVE = 'popupLeave';
  static readonly CLASS_DISAPPEAR = 'disappear';

  private static readonly CUSTOM_MODIFIER_ORDER: number = 840;
  private static uniqueId: number = 0;

  private showing: boolean = false;
  private instanceId: number = AnchoredPopup.uniqueId++;
  private popperId: string = `lp-anchored-popup-popper-${this.instanceId}`;
  private modifiers: Popper.Modifiers = {};
  private shouldDisappear: boolean = false;
  private eventManager: VNodeEventManager = new VNodeEventManager();

  /**
   * Offset along the main axis of the popup.
   * For TOP/BOTTOM placement the vertical axis is the main one.
   * For LEFT/RIGHT placement the horizontal axis is the main one.
   */
  @Prop({ type: Number, required: false, default: 0 })
  readonly offsetMainAxis: number;

  /**
   * Offset along the secondary axis of the popup.
   * For TOP/BOTTOM placement the horizontal axis is the secondary one.
   * For LEFT/RIGHT placement the vertical axis is the secondary one.
   */
  @Prop({ type: Number, required: false, default: 0 })
  readonly offsetSecondaryAxis: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly opened: boolean;

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

  @Watch('opened', { immediate: true })
  onOpenedChange(newValue: boolean, oldValue: boolean): void {
    this.$nextTick(() => {
      if (this.opened) {
        this.showing = true;
      }

      this.shouldDisappear = !newValue && oldValue;
    });
  }

  @Watch('alignWidths', { immediate: true })
  onAlignWidthsChange(): void {
    this.modifiers.sizeToAnchor = this.alignWidths
      ? {
          order: AnchoredPopup.CUSTOM_MODIFIER_ORDER, // execute before compute style.
          enabled: true,
          fn: (data) => {
            // Make the popup width equal to the refenrece(anchor) width.
            data.styles.width = `${data.offsets.reference.width}px`;

            return data;
          }
        }
      : undefined;
  }

  @Watch('offsetMainAxis', { immediate: true })
  onOffsetMainAxisChange(): void {
    this.updateOffsetModifier();
  }

  @Watch('offsetSecondaryAxis', { immediate: true })
  onOffsetSecondaryAxisChange(): void {
    this.updateOffsetModifier();
  }

  private updateOffsetModifier(): void {
    this.modifiers.offset = { enabled: true, offset: `${this.offsetSecondaryAxis}px, ${this.offsetMainAxis}px` };
  }

  mounted(): void {
    this.eventManager.add(this.$slots.anchor, 'mouseenter', this.onAnchorEnter);
    this.eventManager.add(this.$slots.anchor, 'mouseleave', this.onAnchorLeave);
    this.eventManager.add(this.$slots.anchor, 'click', this.onAnchorClick);
    this.eventManager.add(this.$slots.anchor, 'keydown', this.onAnchorKeydown);
    this.eventManager.add(this.$slots.anchor, 'keyup', this.onAnchorKeyup);
  }

  beforeDestroy(): void {
    this.eventManager.removeAll();
  }

  render(): VNode {
    return (
        <PortalPopper
          showing={this.showing}
          popperId={this.popperId}
          placement={this.placement}
          modifiers={this.modifiers}
          onClose={this.onClose}
        >
          <div
            id={this.popperId}
            key={this.popperId}
            class="lp-anchored-popup"
            onMouseenter={this.onPopupEnter}
            onMouseleave={this.onPopupLeave}
          >
            <div
              class={cx('lp-anchored-popup-content', { [AnchoredPopup.CLASS_DISAPPEAR]: this.shouldDisappear })}
              onAnimationend={this.onAnimationEnd}
            >
              {this.$slots.content}
            </div>
          </div>
          <template slot="anchor">{this.$slots.anchor}</template>
        </PortalPopper>
    );
  }

  private onClose(): void {
    this.shouldDisappear = true;
  }

  private onAnimationEnd({ animationName }: AnimationEvent): void {
    if (animationName === AnchoredPopup.CLASS_DISAPPEAR) {
      this.toggleVisibility(false);
      this.shouldDisappear = false;
    }
  }

  private toggleVisibility(newValue: boolean): void {
    this.showing = newValue;
    this.$emit(AnchoredPopup.EVENT_TOGGLE, newValue);
  }

  private onAnchorEnter(event: MouseEvent): void {
    this.$emit(AnchoredPopup.EVENT_ANCHOR_ENTER, event);
  }

  private onAnchorLeave(event: MouseEvent): void {
    this.$emit(AnchoredPopup.EVENT_ANCHOR_LEAVE, event);
  }

  private onAnchorClick(event: MouseEvent): void {
    this.$emit(AnchoredPopup.EVENT_ANCHOR_CLICK, event);
  }

  private onAnchorKeydown(event: KeyboardEvent): void {
    this.$emit(AnchoredPopup.EVENT_ANCHOR_KEYDOWN, event);
  }

  private onAnchorKeyup(event: KeyboardEvent): void {
    this.$emit(AnchoredPopup.EVENT_ANCHOR_KEYUP, event);
  }

  private onPopupEnter(event: MouseEvent): void {
    this.$emit(AnchoredPopup.EVENT_POPUP_ENTER, event);
  }

  private onPopupLeave(event: MouseEvent): void {
    this.$emit(AnchoredPopup.EVENT_POPUP_LEAVE, event);
  }
}

namespace AnchoredPopup {
  export enum Placement {
    AUTO = 'auto',
    AUTO_START = 'auto-start',
    AUTO_END = 'auto-end',
    TOP = 'top',
    TOP_START = 'top-start',
    TOP_END = 'top-end',
    BOTTOM = 'bottom',
    BOTTOM_START = 'bottom-start',
    BOTTOM_END = 'bottom-end',
    LEFT = 'left',
    LEFT_START = 'left-start',
    LEFT_END = 'left-end',
    RIGHT = 'right',
    RIGHT_START = 'right-start',
    RIGHT_END = 'right-end'
  }
}

export { AnchoredPopup };
