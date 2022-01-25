import clamp from 'lodash/clamp';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './ProgressBar.scss';

@Component({ name: 'ProgressBar' })
class ProgressBar extends Vue {
  @Prop({ required: true, type: Number })
  readonly value: number;

  @Prop({ required: false, type: Number, default: 0 })
  readonly secondaryValue: number;

  get translateStyle(): string {
    return `transform: translateX(-${100 - clamp(this.value, 0, 100)}%);`;
  }

  get translateSecondaryStyle(): string {
    return `transform: translateX(-${100 - clamp(this.value + this.secondaryValue, 0, 100)}%);`;
  }

  render(): VNode {
    return (
      <div class="lp-progress-bar">
        <span class="progress-label">{this.value.toFixed(0)}%</span>
        <div class="progress-container">
          {!!this.secondaryValue && <div class="progress-content secondary" style={this.translateSecondaryStyle}/>}
          <div class="progress-content primary" style={this.translateStyle}/>
        </div>
      </div>
    );
  }
}

export { ProgressBar };
