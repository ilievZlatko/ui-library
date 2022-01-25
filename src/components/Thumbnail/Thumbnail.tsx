import { oneOf } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Color } from '../../utils/styles';
import { Icon } from '../icon/Icon';
import { OverflowableText } from '../OverflowableText/OverflowableText';

import './Thumbnail.scss';

@Component({ name: 'Thumbnail' })
class Thumbnail extends Vue {
  private static readonly TRANSPARENTIZE_PERCENTAGE = 0.1;
  private static readonly ALPHA = Math.round(256 * Thumbnail.TRANSPARENTIZE_PERCENTAGE).toString(16);

  @Prop({ type: String, required: true, validator: oneOf(Object.values(Icon.Type)) })
  readonly icon: Icon.Type;

  @Prop({ type: String, required: false, default: Color.DARK30, validator: colorValidator })
  readonly color: string;

  @Prop({ type: String, required: false, default: null, validator: colorValidator })
  readonly backgroundColor: string | null;

  @Prop({ type: String, required: false, validator: oneOf(Object.values(Icon.Type)), default: null })
  readonly hoverIcon: Icon.Type | null;

  @Prop({ type: String, required: false, default: null })
  readonly title: string | null;

  @Prop({ type: String, required: false, default: null })
  readonly subtitle: string | null;

  @Prop({ type: Number, required: false, default: 40 })
  readonly size: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly hovered: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly clickable: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly transparentizeBackgroundColor: boolean;

  private get iconStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: `${this.size}px`,
      minHeight: `${this.size}px`,
      backgroundColor: this.hovered ? this.color : this.computedBackgroundColor,
      color: this.hovered ? Color.WHITE : this.color
    };
  }

  private get computedBackgroundColor(): string | undefined {
    if (!this.backgroundColor) {
      return `${this.color}${Thumbnail.ALPHA}`;
    }

    return `${this.backgroundColor}${this.transparentizeBackgroundColor ? Thumbnail.ALPHA : ''}`;
  }

  private get detailsStyle(): Partial<CSSStyleDeclaration> {
    return {
      minHeight: `${this.size}px`
    };
  }

  private get hasDetails(): boolean {
    return Boolean(this.title || this.subtitle);
  }

  render(): VNode {
    if (!this.hasDetails) {
      return this.renderIcon();
    }

    return (
      <div class="lp-thumbnail">
        {this.renderIcon()}
        <div class="lp-thumbnail-details" style={this.detailsStyle}>
          {this.title && <OverflowableText class="lp-thumbnail-title" text={this.title} />}
          {this.$slots.actions && <div class="lp-thumbnail-actions">{this.$slots.actions}</div>}
          {this.subtitle && <OverflowableText class="lp-thumbnail-subtitle" text={this.subtitle} />}
        </div>
      </div>
    );
  }

  private renderIcon(): VNode {
    return (
      <div class="lp-thumbnail-icon" style={this.iconStyle}>
        <Icon
          padding={(this.size - Icon.DEFAULT_SIZE_NUM) / 2}
          size={this.size}
          type={(this.hovered && this.hoverIcon) || this.icon}
          clickable={this.clickable}
        />
      </div>
    );
  }
}

function colorValidator(value: string): boolean {
  return /^#[A-Fa-f0-9]{6}$/.test(value);
}

export { Thumbnail };
