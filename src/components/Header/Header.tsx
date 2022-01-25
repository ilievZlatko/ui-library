import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';
import { OverflowableText } from '../OverflowableText/OverflowableText';
import './Header.scss';

@Component({ name: 'Header' })
class Header extends Vue {
  @Prop({ type: String, required: false, default: '' })
  readonly title: string;

  @Prop({ type: String, required: false, default: '' })
  readonly subTitle: string;

  @Prop({ type: String, required: false, default: '' })
  readonly subTitleHtml: string;

  @Prop({ type: String, required: false, default: '' })
  readonly infoTooltip: string;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly bigTitle: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly boldTitle: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly withSpacing: boolean;

  @Prop({ type: Boolean, required: false, default: true })
  readonly withSeparator: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly wrap: boolean;

  render(): VNode {
    return (
      <div
        class={cx('lp-header', {
          big: this.bigTitle,
          bold: this.boldTitle,
          wrap: this.wrap,
          'with-spacing': this.withSpacing,
          'with-separator': this.withSeparator
        })}
      >
        <div class="title-wrapper">
          <div class="title-row">
            <OverflowableText class="title" text={this.title} />
            {!this.loading && this.$slots.leftActions}
          </div>
          {this.subTitle && <div class="subtitle">{this.subTitle}</div>}
          {this.subTitleHtml && <div class="subtitle" domPropsInnerHTML={this.subTitleHtml} />}
        </div>
        {!!this.infoTooltip && <Icon class="info-icon" type={Icon.Type.INFO} tooltip={this.infoTooltip} />}
        <div class="actions">{!this.loading && this.$slots.actions}</div>
      </div>
    );
  }
}

export { Header };
