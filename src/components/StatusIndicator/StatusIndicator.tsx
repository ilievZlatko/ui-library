import { Dictionary } from 'leanplum-lib-common';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Color } from '../../utils/styles';
import { Icon } from '../icon/Icon';

import './StatusIndicator.scss';

@Component({ name: 'StatusIndicator' })
class StatusIndicator extends Vue {
  private readonly COLOR_MAP: Dictionary<Color> = {
    [StatusIndicator.Color.DARK70]: Color.DARK70,
    [StatusIndicator.Color.DARK30]: Color.DARK30,
    [StatusIndicator.Color.GREEN]: Color.GREEN,
    [StatusIndicator.Color.YELLOW]: Color.YELLOW,
    [StatusIndicator.Color.RED]: Color.RED
  };
  @Prop({ type: String, required: true })
  readonly label: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly embedded: boolean;

  @Prop({
    type: String,
    required: false,
    default: () => StatusIndicator.Color.DARK70,
    validator(value: StatusIndicator.Color): boolean {
      return values(StatusIndicator.Color).indexOf(value) > -1;
    }
  })
  readonly color: StatusIndicator.Color;

  render(): VNode {
    return (
      <div
        class={cx('lp-status-indicator', { embedded: this.embedded })}
        style={`--status-color: ${this.COLOR_MAP[this.color]};`}
      >
        <Icon class="status-icon" type={Icon.Type.STATUS_INDICATOR} />
        {this.label}
      </div>
    );
  }
}

namespace StatusIndicator {
  export enum Color {
    DARK70 = 'dark70',
    DARK30 = 'dark30',
    GREEN = 'green',
    YELLOW = 'yellow',
    RED = 'red'
  }
}

export { StatusIndicator };
