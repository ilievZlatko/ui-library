import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Icon } from '../icon/Icon';

import './InfoSection.scss';

@Component({ name: 'InfoSection' })
class InfoSection extends Vue {
  @Prop({ type: String, required: false, default: Icon.Type.INFO })
  readonly icon: Icon.Type;

  @Prop({ type: String, required: false, default: '' })
  readonly title: string;

  readonly $slots: {
    default: Array<VNode>,
    sidebar: Array<VNode>
  };

  render(): VNode {
    return (
      <div class="lp-info-section">
        <div class="lp-info-section-sidebar">
          {this.renderSidebarContent()}
        </div>
        <div class="lp-info-section-content">
          {this.title && <p class="lp-info-section-title">{this.title}</p>}
          {this.$slots.default}
        </div>
      </div>
    );
  }

  private renderSidebarContent(): Array<VNode> {
    if (this.$slots.sidebar) {
      return this.$slots.sidebar;
    }

    return [
      <Icon type={this.icon} clickable={false} />
    ];
  }
}

export { InfoSection };
