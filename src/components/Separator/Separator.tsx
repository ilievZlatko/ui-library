import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Spacing } from '../../utils/styles';

import './Separator.scss';

@Component({ name: 'Separator' })
export class Separator extends Vue {
  @Prop({
    required: false,
    type: Number,
    default: (): Spacing => Spacing.REGULAR,
    validator: (value) => values(Spacing).includes(value)
  })
  readonly spacing: Spacing;

  @Prop({
    required: false,
    type: String,
    default: '24px'
  })
  readonly height: string;

  private get styles(): Partial<CSSStyleDeclaration> {
    return {
      margin: `0 ${this.spacing}px`,
      height: this.height
    };
  }

  render(): VNode {
    return (
      <div class="lp-separator">
        <div class="separator-line" style={this.styles} />
      </div>
    );
  }
}
