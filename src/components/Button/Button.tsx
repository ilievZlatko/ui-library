import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { cx } from '../../utils/cx';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Badge } from '../Badge/Badge';
import { Icon } from '../icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';

import './Button.scss';

@Component({ name: 'Button' })
class Button extends Vue {
  static readonly EVENT_CLICK = 'click';
  static readonly EVENT_FILE = 'file';

  @Prop({
    type: String,
    required: false,
    default: 'button',
    validator(value: Button.Type): boolean {
      return values(Button.Type).indexOf(value) > -1;
    }
  })
  readonly type: Button.Type;

  @Prop({
    type: String,
    required: false,
    default: 'light',
    validator(value: Button.Color): boolean {
      return values(Button.Color).indexOf(value) > -1;
    }
  })
  readonly color: Button.Color;

  @Prop({
    type: String,
    required: false,
    default: 'normal',
    validator(value: Button.Appearance): boolean {
      return values(Button.Appearance).indexOf(value) > -1;
    }
  })
  readonly appearance: Button.Appearance;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: String, required: false, default: null })
  readonly text: string | null;

  @Prop({ type: String, required: false, default: null })
  readonly icon: Icon.Type;

  @Prop({ type: String, required: false, default: () => Button.IconPlacement.LEFT })
  readonly iconPlacement: Button.IconPlacement;

  @Prop({ type: Number, required: false, default: undefined })
  readonly iconSize?: number;

  @Prop({ type: String, required: false, default: null })
  readonly tooltip: string | null;

  @Prop({ type: String, required: false, default: () => AnchoredPopup.Placement.BOTTOM })
  readonly tooltipPlacement: AnchoredPopup.Placement;

  @Prop({ type: String, required: false, default: null })
  readonly badge: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
    validator(value: Button.Color): boolean {
      return values(Button.Color).indexOf(value) > -1;
    }
  })
  readonly dotIndicator: Button.Color | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly stopPropagation: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly inline: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly loading: boolean;

  @Prop({ type: [Object, String], required: false, default: null })
  readonly to: RawLocation | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly multiple: boolean;

  render(): VNode | null {
    if (!this.hasText && !this.hasIcon) {
      throw new Error('Either set "text" or "icon" property, or both.');
    }

    const shouldUseLink = this.to && !this.disabled;
    const ButtonElement = shouldUseLink ? 'router-link' : 'button';

    const events = {
      click: this.handleClick,
      mouseover: this.emitMouseOver,
      mouseleave: this.emitMouseLeave
    };

    return (
      <ButtonElement
        to={this.to}
        type={this.buttonElementType}
        class={this.classNames}
        disabled={this.disabled || this.loading}
        {...{ [shouldUseLink ? 'nativeOn' : 'on']: events }}
      >
        {this.renderContent()}
        {this.loading && <div class="loading-spinner" />}
      </ButtonElement>
    );
  }

  private renderContent(): VNode {
    if (this.tooltip) {
      return (
        <Tooltip placement={this.tooltipPlacement} offset={6}>
          {this.renderButtonContent()}
          <p slot="content">{this.tooltip}</p>
        </Tooltip>
      );
    }

    return this.renderButtonContent();
  }

  private get buttonElementType(): string {
    return this.type === Button.Type.SUBMIT ? 'submit' : 'button';
  }

  private get classNames(): string {
    return cx('lp-button', `color-${this.color}`, this.appearance, this.disabled ? 'disabled' : 'enabled', {
      'has-tooltip': this.hasTooltip,
      'icon-only': !this.hasText,
      inline: this.inline,
      loading: this.loading,
      'with-indicator': this.dotIndicator !== null
    });
  }

  private renderButtonContent(): VNode {
    const icon = this.hasIcon ? (
      <Icon type={this.icon} class="icon" stopPropagation={false} size={this.iconSize} />
    ) : null;
    const text = this.hasText ? <span class="text">{this.text}</span> : null;
    const badge = this.hasBadge ? <Badge class="badge" text={this.badge} /> : null;
    const dotIndicator = this.dotIndicator ? <div class={`btn-dot-indicator indicator-${this.dotIndicator}`} /> : null;
    const isReverse = this.iconPlacement === Button.IconPlacement.RIGHT;
    const hasFileChooser = this.type === Button.Type.FILE;

    return (
      <div class={cx('lp-btn-content', { reverse: isReverse })}>
        {dotIndicator}
        {isReverse ? [badge, text, icon] : [badge, icon, text]}
        {hasFileChooser && (
          <input type="file" multiple={this.multiple} class="btn-file-input" disabled={this.disabled} title="" onChange={this.onSelectFile} />
        )}
      </div>
    );
  }

  private get hasText(): boolean {
    return !isEmpty(this.text);
  }

  private get hasIcon(): boolean {
    return !isEmpty(this.icon);
  }

  private get hasBadge(): boolean {
    return !isEmpty(this.badge);
  }

  private get hasTooltip(): boolean {
    return !isEmpty(this.tooltip);
  }

  private handleClick(event?: Event): void {
    if (event && this.stopPropagation) {
      event.stopPropagation();
    }
    this.$emit(Button.EVENT_CLICK);
  }

  private emitMouseOver(): void {
    this.$emit('mouseOver');
  }

  private emitMouseLeave(): void {
    this.$emit('mouseLeave');
  }

  private onSelectFile(e: MouseEvent): void {
    this.$emit(Button.EVENT_FILE, this.getSelectedFile(e.target as HTMLInputElement));
  }

  private getSelectedFile(input: HTMLInputElement): File | FileList | null {
    if (this.multiple) {
      return input?.files ?? null;
    }

    return input?.files?.[0] ?? null;
  }
}

namespace Button {
  export enum Color {
    LIGHT = 'light',
    DANGER = 'danger',
    WARNING = 'warning',
    PRIMARY = 'primary',
    SUCCESS = 'success',
    TRANSPARENT = 'transparent'
  }

  export enum Appearance {
    NORMAL = 'normal',
    OUTLINE = 'outline',
    LIGHTEN = 'lighten'
  }

  export enum IconPlacement {
    LEFT = 'left',
    RIGHT = 'right'
  }

  export enum Type {
    BUTTON = 'button',
    SUBMIT = 'submit',
    FILE = 'file'
  }

  export interface Props {
    type?: Button.Type;
    color?: Button.Color;
    appearance?: Button.Appearance;
    disabled?: boolean;
    loading?: boolean;
    text?: string | null;
    icon?: Icon.Type;
    iconPlacement?: Button.IconPlacement;
    badge?: string | null;
    dotIndicator?: Button.Color | null;
    tooltip?: string | null;
    tooltipPlacement?: AnchoredPopup.Placement;
    to?: RawLocation | null;
  }
}

export { Button };
