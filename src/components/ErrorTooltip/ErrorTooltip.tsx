import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { NotificationTooltip } from '../NotificationTooltip/NotificationTooltip';

// import './ErrorTooltip.scss';

/**
 * Error Tooltip helper component.
 *
 * Shared styles for error tooltips in input
 */
@Component({ name: 'ErrorTooltip' })
class ErrorTooltip extends Vue {
  @Prop({ type: [String, Array], required: false, default: '' })
  message: string | Array<string>;

  @Prop({ type: Boolean, required: false, default: true })
  positionAbsolute: boolean;

  render(): VNode {
    return (
      <NotificationTooltip
        message={this.message}
        type={NotificationTooltip.Type.ERROR}
        positionAbsolute={this.positionAbsolute}
      />
    );
  }
}

export { ErrorTooltip };
