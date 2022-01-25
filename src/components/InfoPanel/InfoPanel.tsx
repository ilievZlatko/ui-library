import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';

import './InfoPanel.scss';

enum InfoPanelType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info'
}

@Component({ name: 'InfoPanel' })
class InfoPanel extends Vue {
  private static readonly ICON_SIZE: number = 16;
  private static readonly TYPE_METADATA: { [key in InfoPanelType]: { className: string; iconType: Icon.Type } } = {
    [InfoPanelType.SUCCESS]: { className: 'success', iconType: Icon.Type.CHECK_MEDIUM },
    [InfoPanelType.WARNING]: { className: 'warning', iconType: Icon.Type.EXCLAMATION_MEDIUM },
    [InfoPanelType.DANGER]: { className: 'danger', iconType: Icon.Type.EXCLAMATION_MEDIUM },
    [InfoPanelType.INFO]: { className: 'info', iconType: Icon.Type.EXCLAMATION_MEDIUM }
  };

  @Prop({ type: String, default: '', required: false })
  readonly message: string;

  @Prop({ type: Boolean, default: false, required: false })
  readonly inline: boolean;

  @Prop({ type: Boolean, default: true, required: false })
  readonly emphasize: boolean;

  @Prop({
    type: String,
    default: InfoPanelType.SUCCESS,
    validator: (value: InfoPanelType): boolean => values(InfoPanelType).indexOf(value) !== -1
  })
  readonly type: InfoPanelType;

  readonly $slots: { default: Array<VNode> };

  render(): VNode {
    const { className, iconType } = InfoPanel.TYPE_METADATA[this.type];

    return (
      <div class={cx(`lp-info-panel ${className}`, { inline: this.inline, emphasize: this.emphasize })}>
        <Icon class="lp-info-panel-icon" size={InfoPanel.ICON_SIZE} type={iconType} />
        {this.message && <p class="lp-info-panel-message">{this.message}</p>}
        {this.$slots.default}
      </div>
    );
  }
}

namespace InfoPanel {
  export const Type = InfoPanelType;
  export type Type = InfoPanelType;
}

export { InfoPanel };
