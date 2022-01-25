import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { AutoPopup } from '../AutoPopup/AutoPopup';
import { Feedback } from '../Feedback/Feedback';
import { Icon } from '../icon/Icon';

import './Guide.scss';

// tslint:disable:jsdoc-format
/**
 * Shows an icon and on click shows a popup with additional information.
 *
 * Example:
```
<Guide type={Feedback.Type.WARN} icon={<some icon>}>
  <div>Content</div>
</Guide>
```
 */
@Component({ name: 'Guide' })
class Guide extends Vue {
  // Override default of 20.
  private static readonly ICON_SIZE: number = 20;

  @Prop({
    type: String,
    required: false,
    default: null
  })
  title: string | null;

  @Prop({
    type: String,
    required: false,
    default: null
  })
  message: string | null;

  @Prop({ required: false, default: '' })
  popoutClassName: string;

  @Prop({ required: false, default: false })
  openOnMount: boolean;

  @Prop({ required: false, default: AutoPopup.EventTrigger.HOVER })
  eventTrigger: AutoPopup.EventTrigger;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(Feedback.Type).indexOf(value) > -1,
    default: () => Feedback.Type.INFO
  })
  type: Feedback.Type;

  @Prop({
    type: String,
    required: false,
    validator: (value) => values(AutoPopup.Placement).indexOf(value) > -1,
    default: () => AutoPopup.Placement.RIGHT
  })
  placement: AutoPopup.Placement;

  private get iconType(): Icon.Type {
    switch (this.type) {
      case Guide.Type.WARNING:
      case Guide.Type.ERROR:
        return Icon.Type.EXCLAMATION;
      case Guide.Type.INFO:
      default:
        return Icon.Type.INFO;
    }
  }

  private get iconCircle(): Icon.Circle {
    switch (this.type) {
      case Guide.Type.WARNING:
        return Icon.Circle.WARNING;
      case Guide.Type.ERROR:
        return Icon.Circle.DANGER;
      case Guide.Type.INFO:
      default:
        return Icon.Circle.NONE;
    }
  }

  render(): VNode {
    return (
      <AutoPopup
        class={cx('lp-guide', this.type)}
        placement={this.placement}
        eventTrigger={this.eventTrigger}
        offsetMainAxis={8}
        openOnMount={this.openOnMount}
      >
        <Icon
          slot="anchor"
          class={cx('guide-icon', this.type)}
          type={this.iconType}
          circle={this.iconCircle}
          size={Guide.ICON_SIZE}
          // Prevent closing the popup on click
          nativeOnClick={(e: MouseEvent) => {
            if (this.eventTrigger === AutoPopup.EventTrigger.HOVER) {
              e.stopImmediatePropagation();
              e.preventDefault();
            }
          }}
        />
        <Feedback
          class={this.popoutClassName}
          slot="content"
          title={this.title}
          message={this.message}
          type={this.type}
        >
          {this.$slots.default}
        </Feedback>
      </AutoPopup>
    );
  }
}

namespace Guide {
  export type Type = Feedback.Type;
  export const Type = Feedback.Type;
  export const Placement = AutoPopup.Placement;
}

export { Guide };
