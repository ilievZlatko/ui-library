import { cx } from 'leanplum-lib-ui';
import { default as Vue, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './SplitViewLayout.scss';

@Component({ name: 'SplitViewLayout' })
class SplitViewLayout extends Vue {
  @Prop({ required: false, default: false })
  loading: boolean;

  $slots: {
    leftContent: Array<VNode>;
    leftActions: Array<VNode>;
    rightContent: Array<VNode>;
  };

  render(): VNode {
    return (
      <div class={cx('lp-split-view-layout', { loading: this.loading })}>
        <div class="split-view-left">
          <div class="content">{this.$slots.leftContent}</div>
          {this.$slots.leftActions}
        </div>
        <div class="split-view-right">{this.$slots.rightContent}</div>
      </div>
    );
  }
}

export { SplitViewLayout };
