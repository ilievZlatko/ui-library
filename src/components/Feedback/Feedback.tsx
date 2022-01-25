import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';

import './Feedback.scss';

@Component({ name: 'Feedback' })
class Feedback extends Vue {
  @Prop({
    type: String,
    required: false,
    validator: (value) => values(Feedback.Type).indexOf(value) > -1,
    default: () => Feedback.Type.INFO
  })
  readonly type: Feedback.Type;

  @Prop({ type: String, required: false, default: null })
  readonly title: string | null;

  @Prop({ type: String, required: false, default: null })
  readonly message: string | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly compact: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly showArrow: boolean;

  $slots: {
    default: Array<VNode>;
  };

  render(): VNode {
    return (
      <div
        class={`lp-feedback ${this.type}`}
        onMouseenter={this.onMouseEnter}
        onMouseleave={this.onMouseLeave}
      >
        {this.showArrow && <div class="arrow" />}
        <div class={cx('content', { compact: this.compact })}>
          {this.title && <p class="title">{this.title}</p>}
          {this.message && <p class="message">{this.message}</p>}
          <div class="default">{this.$slots.default}</div>
        </div>
      </div>
    );
  }

  private onMouseEnter(): void {
    this.$emit('mouseenter');
  }

  private onMouseLeave(): void {
    this.$emit('mouseleave');
  }
}

namespace Feedback {
  export enum Type {
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
  }
}

export { Feedback };
