import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';

import './ProgressCircle.scss';

@Component({ name: 'ProgressCircle' })
class ProgressCircle extends Vue {
  @Prop({ required: false, type: String, default: 'blue' })
  readonly color: ProgressCircle.Color;

  @Prop({ required: false, type: String, default: '64px' })
  readonly size: string;

  @Prop({ required: false, type: Boolean, default: true })
  readonly showValue: boolean;

  @Prop({ required: true, type: Number })
  readonly value: number;

  get percentage(): string {
    if (this.value < 0 || this.value > 100) {
      throw new Error(`The value must be between 0 and 100 (inclusive) while "${this.value}" was given.`);
    }

    return `${Math.round(this.value)}%`;
  }

  get style(): string {
    return `height: ${this.size}; width: ${this.size};`;
  }

  render(): VNode {
    return (
      <svg viewBox="0 0 36 36" class={cx('lp-progress-circle', `color-${this.color}`)} style={this.style}>
        <path class="bg-line" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <transition appear={true} name="progress">
          <path
            class="fg-line"
            style={{ visibility: this.value ? 'visible' : 'hidden' }}
            stroke-dasharray={`${this.value}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </transition>
        <text x="18" y="20.35" style={{ visibility: this.showValue ? 'visible' : 'hidden' }}>
          {this.percentage}
        </text>
      </svg>
    );
  }
}

namespace ProgressCircle {
  export enum Color {
    BLUE = 'blue',
    BLUE_LIGHT = 'blue-light',
    TEAL = 'teal',
    TEAL_LIGHT = 'teal-light',
    GREEN = 'green',
    GREEN_LIGHT = 'green-light',
    ORANGE = 'orange',
    ORANGE_LIGHT = 'orange-light',
    RED = 'red',
    RED_LIGHT = 'red-light',
    PURPLE = 'purple',
    PURPLE_LIGHT = 'purple-light'
  }
}

export { ProgressCircle };
