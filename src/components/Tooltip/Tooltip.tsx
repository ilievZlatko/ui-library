import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { VNodeEventManager } from '../../utils/VNodeEventManager';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Feedback } from '../Feedback/Feedback';

import './Tooltip.scss';

// tslint:disable:jsdoc-format
/**
 * Shows a message when the mouse hovers on the specified anchor.
 *
 * With simple content:
```
<Tooltip message="Tooltip message">
  <div>Anchor</div>
</Tooltip>
```
  * With advanced content:
```
<Tooltip>
  <div>Anchor</div>
  <template slot="content">
    <div>Content</div>
  </template>
</Tooltip>
```
 */

const TOOLTIP_DELAY = 400;

@Component({ name: 'Tooltip' })
class Tooltip extends Vue {
  private eventManager: VNodeEventManager = new VNodeEventManager();
  private opened: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  /**
   * A shortcut for adding simple text as content.
   * Shows on top of the default slotted content
   * if both are provided.
   */
  @Prop({ required: false, default: null })
  readonly message: string | null;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(Feedback.Type).indexOf(value) > -1,
    default: () => Feedback.Type.INFO
  })
  readonly type: Feedback.Type;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(AnchoredPopup.Placement).indexOf(value) > -1,
    default: () => AnchoredPopup.Placement.RIGHT
  })
  readonly placement: AnchoredPopup.Placement;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  /**
   * Spacing to insert between the tooltip and the element
   * which serves as its anchor.
   */
  @Prop({ type: Number, required: false, default: 0 })
  readonly offset: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly showArrow: boolean;

  $slots: {
    content: Array<VNode>;
    default: Array<VNode>;
  };

  mounted(): void {
    this.eventManager.add(this.$slots.default, 'mouseenter', this.onMouseEnter);
    this.eventManager.add(this.$slots.default, 'mouseleave', this.onMouseLeave);
  }

  beforeDestroy(): void {
    this.eventManager.removeAll();
  }

  render(): VNode {
    return (
      <AnchoredPopup opened={this.opened} placement={this.placement} offsetMainAxis={this.offset}>
        <template slot="anchor">{this.$slots.default}</template>
        {(this.message || this.$slots.content) && !this.disabled && (
          <Feedback slot="content" compact={true} showArrow={this.showArrow} type={this.type}>
            {this.message ? <span class="lp-tooltip-message">{this.message}</span> : null}
            {this.$slots.content}
          </Feedback>
        )}
      </AnchoredPopup>
    );
  }

  private onMouseEnter(): void {
    if (this.disabled) {
      return;
    }

    this.timer = setTimeout(() => {
      this.opened = true;
    }, TOOLTIP_DELAY);
  }

  private onMouseLeave(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.opened = false;
  }
}

namespace Tooltip {
  export const Type = Feedback.Type;
  export type Type = Feedback.Type;
  export const Placement = AnchoredPopup.Placement;
  export type Placement = AnchoredPopup.Placement;
}

export { Tooltip };
