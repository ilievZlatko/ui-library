import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { NotificationContent } from './NotificationContent/NotificationContent';

import './NotificationTooltip.scss';

/**
 * Notification tooltip component
 */
@Component({ name: 'NotificationTooltip' })
class NotificationTooltip extends Vue {
  @Prop({ type: [String, Array], required: false, default: '' })
  message: string | Array<string>;

  @Prop({ type: String, required: false, default: () => NotificationTooltip.Type.INFO })
  type: NotificationTooltip.Type;

  @Prop({ type: Boolean, required: false, default: true })
  positionAbsolute: boolean;

  private get tooltipType(): Tooltip.Type {
    return NotificationTooltip.map[this.type].tooltip;
  }

  private get circleType(): Icon.Circle {
    return NotificationTooltip.map[this.type].circle;
  }

  render(): VNode {
    return (
      <Tooltip type={this.tooltipType} class="lp-notification-tooltip">
        <Icon
          class={cx('lp-notification-tooltip-icon', { absolute: this.positionAbsolute })}
          type={Icon.Type.EXCLAMATION}
          circle={this.circleType}
        />
        <NotificationContent slot="content" message={this.message} />
      </Tooltip>
    );
  }
}

namespace NotificationTooltip {
  export enum Type {
    INFO = 'info',
    ERROR = 'error',
    WARNING = 'warning'
  }

  type TypeMappings = { [K in Type]: { tooltip: Tooltip.Type; circle: Icon.Circle } };

  export const map: TypeMappings = {
    [Type.INFO]: { tooltip: Tooltip.Type.INFO, circle: Icon.Circle.INFO },
    [Type.WARNING]: { tooltip: Tooltip.Type.WARNING, circle: Icon.Circle.WARNING },
    [Type.ERROR]: { tooltip: Tooltip.Type.ERROR, circle: Icon.Circle.DANGER }
  };
}

export { NotificationTooltip };
