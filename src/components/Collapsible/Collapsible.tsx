import { oneOf } from 'leanplum-lib-common';
import Vue, { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { cx } from '../../utils/cx';
import { Icon } from '../icon/Icon';
import { OverflowableText } from '../OverflowableText/OverflowableText';

import './Collapsible.scss';

interface CollapsibleProps {
  expanded?: boolean;
  active?: boolean;
  embedded?: boolean;
  title?: string;
  titleHeight?: number;
  icon?: Icon.Type | null;
  disabled?: boolean;
}

@Component({ name: 'Collapsible' })
class Collapsible extends Vue implements CollapsibleProps {
  static readonly EVENT_TOGGLE: string = 'toggle';
  static readonly TITLE_HEIGHT: number = 52 /* px */;
  static readonly TRANSITION_DURATION: number = 200 /* ms */;

  @Prop({ type: Boolean, required: false, default: false })
  readonly expanded!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly active: boolean;

  @Prop({ type: String, required: false, validator: oneOf(Object.values(Icon.Type)), default: null })
  readonly icon: Icon.Type | null;

  @Prop({ type: String, required: false, default: '' })
  readonly title: string;

  @Prop({ type: Number, required: false, default: (): number => Collapsible.TITLE_HEIGHT })
  readonly titleHeight: number;

  @Prop({ type: Boolean, required: false, default: false })
  readonly embedded: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  readonly disabled: boolean;

  readonly $refs: {
    content: HTMLDivElement;
  };

  private isExpanded: boolean = this.expanded;
  private maxHeight: number | null = null; /* null is auto */

  // Non-reactive
  private animationFrame: number;
  private transitionTimeout: NodeJS.Timeout;

  private get height(): string {
    if (!this.isExpanded) {
      return `${this.titleHeight}px`;
    }

    if (this.maxHeight === null) {
      return 'auto';
    }

    return `${this.maxHeight + this.titleHeight}px`;
  }

  @Watch('expanded')
  onExpandedChange(): void {
    if (this.isExpanded !== this.expanded) {
      this.toggle();
    }
  }

  beforeDestroy(): void {
    this.cancelOngoingAnimation();
  }

  render(): VNode {
    const wrapperStyle: Partial<CSSStyleDeclaration> = {
      height: `${this.height}`
    };

    const titleStyle: Partial<CSSStyleDeclaration> = {
      // Accommodate top & bottom borders
      height: `${this.titleHeight - 2}px`
    };

    return (
      <div
        class={cx('lp-collapsible', {
          expanded: this.isExpanded,
          active: this.active,
          embedded: this.embedded,
          disabled: this.disabled
        })}
        style={wrapperStyle}
      >
        <h2 class="lp-collapsible-title" style={titleStyle} onClick={this.toggle}>
          {(this.embedded || !this.disabled) && (
            <Icon class="collapsible-chevron" type={Icon.Type.CHEVRON_DOWN_SMALL} clickable={!this.disabled} />
          )}
          {this.icon !== null && <Icon class="user-icon" type={this.icon} clickable={!this.disabled} />}
          <OverflowableText text={this.title} />
          {this.$slots.afterTitle}
          {this.$slots.action && <div class="actions">{this.$slots.action}</div>}
        </h2>
        <div ref="content" class="lp-collapsible-content">
          {this.$slots.default}
        </div>
      </div>
    );
  }

  private async toggle(): Promise<void> {
    if (this.disabled) {
      return;
    }

    this.maxHeight = this.getMaxHeight();

    this.cancelOngoingAnimation();
    // Waiting for the calculated max-height to be rendered.
    this.animationFrame = requestAnimationFrame(() => {
      this.isExpanded = !this.isExpanded;
      this.$emit(Collapsible.EVENT_TOGGLE, this.isExpanded);

      if (this.isExpanded) {
        // Waiting for the transition from 0 -> actual max height to finish
        // so we can set it later to auto.
        this.transitionTimeout = setTimeout(() => {
          this.maxHeight = null;
        }, Collapsible.TRANSITION_DURATION);
      }
    });
  }

  private getMaxHeight(): number | null {
    if (!this.$refs.content) {
      return null;
    }

    return this.$refs.content.clientHeight;
  }

  private cancelOngoingAnimation(): void {
    clearTimeout(this.transitionTimeout);
    cancelAnimationFrame(this.animationFrame);
  }
}

namespace Collapsible {
  export type Props = CollapsibleProps;
}

export { Collapsible };
