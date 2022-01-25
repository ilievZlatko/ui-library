import { isNumber } from 'util';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Header } from '../Header/Header';
import { Icon } from '../icon/Icon';

import './GuideStep.scss';

@Component({ name: 'GuideStep' })
class GuideStep extends Vue {
  @Prop({
    required: true,
    type: [Number, String],
    validator: (value) => isNumber(value) || Object.values(Icon.Type).includes(value)
  })
  readonly indexIcon: number | Icon.Type;

  @Prop({ required: true, type: String })
  readonly title: string;

  @Prop({ required: false, type: String, default: '' })
  readonly subTitle: string;

  @Prop({ required: false, type: String, default: '' })
  readonly subTitleHtml: string;

  render(): VNode {
    return (
      <div class="lp-setup-guide-step">
        <div class="step-thumbnail">
          <div class="step-icon">{isNumber(this.indexIcon) ? this.indexIcon : <Icon type={this.indexIcon} />}</div>
          <div class="step-line">&nbsp;</div>
        </div>
        <div class="step-content">
          <Header
            class="step-title"
            title={this.title}
            subTitle={this.subTitle}
            subTitleHtml={this.subTitleHtml}
            bigTitle={false}
            withSpacing={false}
            withSeparator={false}
          />
          {this.$slots.default && <div class="step-slot">{this.$slots.default}</div>}
        </div>
      </div>
    );
  }
}

export { GuideStep };
