import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './BounceSpinner.scss';

@Component({ name: 'BounceSpinner' })
class BounceSpinner extends Vue {
  static readonly COUNT: number = 3;

  @Prop({ required: false, default: '#b7b4b0' })
  color: string;

  render(): VNode {
    return (
      <div class="bounce-spinner-view">
        {Array.from(
          { length: BounceSpinner.COUNT },
          (_, i): VNode => (
            <div key={i} class="bouncer" style={{ backgroundColor: this.color, animationDelay: `0.${i}s` }} />
          )
        )}
      </div>
    );
  }
}

export { BounceSpinner };
