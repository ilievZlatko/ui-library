import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';

import './Toggle.scss';

@Component({ name: 'Toggle' })
class Toggle extends Vue {
  @Prop({ type: String, required: false, default: null })
  readonly label: string | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly active: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly stopPropagation: boolean;

  render(): VNode {
    return (
      <div
        class={cx('lp-toggle', { active: this.active, disabled: this.disabled })}
        onClick={this.emitToggle}
        onMousedown={this.onMousedown}
      >
        {this.label && <div class="label">{this.label}</div>}
        <div class="track">
          <div class="dot" />
        </div>
      </div>
    );
  }

  private emitToggle(event: PointerEvent): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }

    if (!this.disabled) {
      this.$emit('toggle', !this.active);
    }
  }

  private onMousedown(event: PointerEvent): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }
  }
}

export { Toggle };
