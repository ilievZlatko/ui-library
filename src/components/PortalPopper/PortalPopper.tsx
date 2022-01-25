import { KeyboardConstants } from 'leanplum-lib-common';
import Popper from 'popper.js';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { isEventTargetingAnyOf } from '../../utils/isEventTargettingAnyOf';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Stargate } from '../Stargate/Stargate';

@Component({ name: 'PortalPopper' })
class PortalPopper extends Vue {
  @Prop({ type: String, required: true })
  readonly popperId: string;

  @Prop({ type: Boolean, required: true })
  readonly showing: boolean;

  @Prop({ type: String, required: true })
  readonly placement: AnchoredPopup.Placement;

  @Prop({ type: Object, required: false, default: (): null => null })
  readonly modifiers: Popper.Modifiers | null;

  private popper: Popper | null = null;
  private popperContent: Element | null = null;

  mounted(): void {
    this.addListeners();
    this.updatePopper();
  }

  updated(): void {
    // The Stargate needs a tick to move its contents.
    // Without this delay the popperContent might not exist yet.
    this.$nextTick(() => this.updatePopper());
  }

  beforeDestroy(): void {
    this.removeListeners();
    if (this.popper !== null) {
      this.popper.destroy();
    }
  }

  render(): VNode | null {
    return (
      <Stargate onBodyKeyDown={this.onBodyKeyDown}>
        {this.showing && this.$slots.default}
        <template slot="anchor">{this.$slots.anchor}</template>
      </Stargate>
    );
  }

  private updatePopper(): void {
    if (!this.showing) {
      return;
    }

    this.popperContent = document.getElementById(this.popperId);

    if (!!this.$el && !!this.popperContent) {
      if (this.popper) {
        this.popper.destroy();
      }
      this.popper = new Popper(this.$el, this.popperContent, {
        placement: this.placement,
        modifiers: this.modifiers || undefined
      });
    }
  }

  /**
   * Close the popup on `mousedown` outside of it.
   *
   * Using `mousedown` instead of `click`, because stopping propagation
   * on `mousedown` event also prevents `mouseup` and `click` events from firing.
   */
  private onBodyMouseDown(event: UIEvent): void {
    if (!this.showing) {
      return;
    }
    if (!isEventTargetingAnyOf(event, this.$el, this.popperContent)) {
      event.stopPropagation();
      this.close();
    }
  }

  // Close on ESC or TAB keys
  private onBodyKeyDown(event: KeyboardEvent): void {
    if (this.showing && (event.key === KeyboardConstants.ESC_KEY || event.key === KeyboardConstants.TAB_KEY)) {
      event.stopPropagation();
      this.close();
    }
  }

  private addListeners(): void {
    document.addEventListener('mousedown', this.onBodyMouseDown as EventListener, { capture: true });
  }

  private removeListeners(): void {
    document.removeEventListener('mousedown', this.onBodyMouseDown as EventListener, { capture: true });
  }

  private close(): void {
    this.$emit('close');
  }
}

namespace PortalPopper {
  export interface Props {
    popperId: string;
    anchorId: string;
    showing: boolean;
    placement: Popper.Placement;
    modifiers?: Popper.Modifiers;
  }
}

export { PortalPopper };
