import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';

import './LoadingSpinner.scss';

@Component({ name: 'LoadingSpinner' })
class LoadingSpinner extends Vue {
  @Prop({ type: String, required: false, default: (): string => LoadingSpinner.Size.REGULAR })
  readonly size: LoadingSpinner.Size;

  render(): VNode {
    return <span class={cx('lp-loading-spinner', this.size)} />;
  }
}

namespace LoadingSpinner {
  export enum Size {
    REGULAR = 'regular',
    SMALL = 'small'
  }
}

export { LoadingSpinner };
