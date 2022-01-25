import Vue, { VNode, VueConstructor } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Badge } from '../Badge/Badge';
import { Icon } from '../icon/Icon';

import './TabStrip.scss';

namespace TabStrip {
  export interface Header {
    title: string;
    subtitle?: string;
    icon?: Icon.Type;
    badge?: string;
    badgeColor?: Badge.Color;
  }
}

@Component({ name: 'TabStrip' })
class TabStrip extends Vue {
  static readonly EVENT_TAB_CHANGE = 'tabChange';

  $slots: {
    actions: Array<VNode>;
    default: Array<VNode>;
  };

  @Prop({ type: Number, required: true })
  active: number;

  @Prop({ type: Array, required: true })
  headers: Array<TabStrip.Header>;

  @Prop({ type: Boolean, default: false })
  largeTitle: boolean;

  @Prop({ type: Function })
  headerComponent: VueConstructor;

  @Prop({ type: Boolean, default: false })
  vertical: boolean;

  created(): void {
    if (Boolean(this.$slots.default) && this.headers.length !== this.$slots.default.length) {
      console.warn('Mismatched number of headers and number of slots');
    }
  }

  onClick(index: number): void {
    if (index !== this.active) {
      this.$emit(TabStrip.EVENT_TAB_CHANGE, index);
    }
  }

  get flexBasis(): number {
    const actionsHeader = Boolean(this.$slots.actions) ? 1 : 0;

    return Math.round(100 / (this.headers.length + actionsHeader));
  }

  render(): VNode {
    return (
      <div class={cx('lp-tab-strip', { 'lp-tab-strip-vertical': this.vertical })}>
        <ul class="lp-tab-strip-list">
          {this.headers.map(this.renderHeader)}
          {this.renderActions()}
        </ul>
        {Boolean(this.$slots.default) && this.$slots.default.filter((_, index) => index === this.active)}
      </div>
    );
  }

  private renderHeader(header: TabStrip.Header, index: number): VNode {
    const className = cx('lp-tab-strip-header', {
      active: index === this.active,
      subtitle: Boolean(header.subtitle)
    });

    const content = [
      <div class={cx('lp-tab-strip-title', { largeTitle: this.largeTitle })}>
        {header.icon && <Icon type={header.icon} />}
        <span>{header.title || index}</span>
        {header.badge && (
          <Badge class="lp-tab-strip-badge" text={header.badge} color={header.badgeColor || Badge.Color.GREY_LIGHT} />
        )}
      </div>,
      header.subtitle && (
        <div class="lp-tab-strip-subtitle">
          <span>{header.subtitle}</span>
        </div>
      )
    ];

    if (this.headerComponent) {
      const HeaderComponent = this.headerComponent;

      return (
        <HeaderComponent class={className} style={`flex-basis: ${this.flexBasis}%;`} item={header}>
          {content}
        </HeaderComponent>
      );
    }

    return (
      <div onClick={(): void => this.onClick(index)} class={className} style={`flex-basis: ${this.flexBasis}%;`}>
        {content}
      </div>
    );
  }

  private renderActions(): VNode | null {
    return Boolean(this.$slots.actions) ? (
      <div class="lp-tab-strip-header-actions">{this.$slots.actions}</div>
    ) : null;
  }
}

export { TabStrip };
