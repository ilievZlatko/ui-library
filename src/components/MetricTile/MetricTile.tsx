import { cx, Icon } from 'leanplum-lib-ui';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import './MetricTile.scss';

@Component({ name: 'MetricTile' })
class MetricTile extends Vue {
  @Prop({ required: false })
  readonly className?: string;

  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  readonly value: string;

  @Prop({ required: false, default: '' })
  readonly total: string;

  @Prop({ type: String, required: false, default: '' })
  readonly valueHint: string;

  @Prop({ required: false, default: (): Icon.Type => Icon.Type.HELP_MEDIUM })
  readonly valueHintIcon: string;

  @Prop({ type: String, required: false, default: '' })
  readonly valueSubtext: string;

  @Prop({ type: String, required: false, default: (): MetricTile.ValueSize => MetricTile.ValueSize.REGULAR })
  readonly valueSize: MetricTile.ValueSize;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly clickable: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({ type: String, required: false, default: '' })
  readonly tooltip: string;

  readonly $slots: {
    below: Array<VNode>;
    beside: Array<VNode>;
    valueHint: Array<VNode>;
  };

  render(): VNode {
    const valueHint = this.$slots.valueHint || this.valueHint;

    return (
      <div class={cx('lp-metric-tile', this.className, { clickable: this.clickable, loading: this.loading })}>
        <div class="tile-content" onClick={this.onClick}>
          <div class="tile-info">
            <div class="tile-title">
              {this.title}
              {this.tooltip && <Icon type={Icon.Type.INFO} tooltip={this.tooltip} />}
            </div>
            <div class={cx('tile-value', this.valueSize)}>
              {this.value}{this.total && <span class="tile-total">/{this.total}</span>}
              {!this.loading && valueHint && (
                <Icon class="value-hint-icon" size={16} type={this.valueHintIcon}>
                  <template slot="tooltip">{valueHint}</template>
                </Icon>
              )}
              {this.valueSubtext && <div class="value-subtext">{this.valueSubtext}</div>}
            </div>
            {this.$slots.below}
          </div>
          {this.$slots.beside}
          {this.disabled && <div class="disabled-overlay" />}
        </div>
      </div>
    );
  }

  onClick(e: MouseEvent): void {
    this.$emit('click', e);
  }
}

namespace MetricTile {
  export enum ValueSize {
    REGULAR = 'regular',
    MEDIUM = 'medium',
    LARGE = 'large'
  }
}

export { MetricTile };
