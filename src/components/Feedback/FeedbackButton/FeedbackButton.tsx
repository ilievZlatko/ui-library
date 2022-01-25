import Vue, { CreateElement, VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Location } from 'vue-router';
import { cx } from '../../../utils/cx';

import './FeedbackButton.scss';

@Component({ name: 'FeedbackButton' })
class FeedbackButton extends Vue {
  static readonly EVENT_CLICK = 'click';

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly halfWidth: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly secondary: boolean;

  @Prop({ type: String, required: false, default: null })
  readonly text: string | null;

  @Prop({ type: Object, required: false, default: (): Location | null => null })
  readonly to: Location | null;

  @Prop({ type: String, required: false, default: null })
  readonly href: string | null;

  @Prop({ type: Boolean, required: false, default: false })
  readonly openInNewTab: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly preventDefault: boolean;

  render(h: CreateElement): VNode | null {
    // If there is an href or to prop, use anchor or router-link. Anchor supersedes RouterLink.
    const tag = this.href
      ? FeedbackButton.Tag.ANCHOR
      : this.to
        ? FeedbackButton.Tag.ROUTER_LINK
        : FeedbackButton.Tag.BUTTON;

    const anchorOptions = this.href
      ? {
        target: this.openInNewTab ? '_blank' : undefined,
        rel: this.openInNewTab ? 'noreferrer noopener' : undefined,
        href: this.href
      }
      : {};

    const routerLinkProps = this.to ? { to: this.to } : {};

    const text = <span class="text">{this.text}</span>;

    return h(
      tag,
      {
        class: this.classNames,
        domProps: {
          disabled: this.disabled,
          ...anchorOptions
        },
        props: {
          ...routerLinkProps
        },
        on: {
          click: this.handleClick
        }
      },
      [text]
    );
  }

  private get classNames(): string {
    return cx('feedback-button', this.disabled ? 'disabled' : 'enabled', {
      'half-width': this.halfWidth,
      secondary: this.secondary
    });
  }

  private handleClick(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.preventDefault) {
      event?.preventDefault();
    }

    if (!this.disabled) {
      this.$emit(FeedbackButton.EVENT_CLICK);
    }
  }
}

namespace FeedbackButton {
  export interface Props {
    disabled?: boolean;
    text?: string | null;
    halfWidth?: boolean;
    secondary?: boolean;
    to?: Location | null;
    href?: string | null;
    openInNewTab?: boolean;
    preventDefault?: boolean;
  }

  export enum Tag {
    ANCHOR = 'a',
    BUTTON = 'button',
    ROUTER_LINK = 'router-link'
  }
}

export { FeedbackButton };
