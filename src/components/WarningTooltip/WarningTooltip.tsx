import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { NotificationTooltip } from '../NotificationTooltip/NotificationTooltip';

// import './WarningTooltip.scss';

/**
 * Warning Tooltip helper component.
 *
 * Shared styles for warning tooltips in input
 */
@Component({ name: 'WarningTooltip' })
class WarningTooltip extends Vue {
  @Prop({ type: [String, Array], required: false, default: [] })
  message: string | Array<string>;

  render(): VNode {
    return <NotificationTooltip message={this.message} type={NotificationTooltip.Type.WARNING} />;
  }
}

export { WarningTooltip };
